terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {
  host    = "npipe:////.//pipe//docker_engine"
}

# Network
resource "docker_network" "backend" {
  name = "backend-network"
}

# Named volumes
resource "docker_volume" "postgres_data" {
  name = "postgres_data"
}

resource "docker_volume" "rabbitmq_data" {
  name = "rabbitmq_data"
}

resource "docker_volume" "elasticsearch_data" {
  name = "elasticsearch_data"
}

# Add local path variable for absolute paths in binds
locals {
  project_root = abspath(path.module)
}

# Docker images
resource "docker_image" "users_service" {
  name = "node:14-alpine"
  keep_locally = true
}

resource "docker_image" "jobs_service" {
  name = "node:14-alpine"
  keep_locally = true
}

resource "docker_image" "resumes_service" {
  name = "node:14-alpine"
  keep_locally = true
}

resource "docker_image" "scraping_service" {
  name = "node:14-alpine"
  keep_locally = true
}

# Pull standard images
resource "docker_image" "postgres" {
  name = "postgres:latest"
  keep_locally = true
}

resource "docker_image" "rabbitmq" {
  name = "rabbitmq:management"
  keep_locally = true
}

resource "docker_image" "redis" {
  name = "redis:latest"
  keep_locally = true
}

resource "docker_image" "elasticsearch" {
  name = "docker.elastic.co/elasticsearch/elasticsearch:8.6.0"
  keep_locally = true
}

resource "docker_image" "kibana" {
  name = "docker.elastic.co/kibana/kibana:8.6.0"
  keep_locally = true
}

resource "docker_image" "logstash" {
  name = "docker.elastic.co/logstash/logstash:8.6.0"
  keep_locally = true
}

resource "docker_image" "nginx" {
  name = "nginx:latest"
  keep_locally = true
}

resource "docker_image" "node" {
  name = "node:14-alpine"
  keep_locally = true
}

# Containers
resource "docker_container" "messaging_queue_service" {
  name  = "messaging-queue-service"
  image = docker_image.rabbitmq.name

  env = [
    "RABBITMQ_DEFAULT_USER=guest",
    "RABBITMQ_DEFAULT_PASS=guest"
  ]

  ports {
    internal = 5672
    external = 5672
  }
  ports {
    internal = 15672
    external = 15672
  }

  mounts {
    type   = "volume"
    source = docker_volume.rabbitmq_data.name
    target = "/var/lib/rabbitmq"
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  healthcheck {
    test     = ["CMD", "rabbitmqctl", "status"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }
}

resource "docker_container" "jobs_db" {
  name  = "jobs-db"
  image = docker_image.postgres.name

  env = [
    "POSTGRES_USER=postgres",
    "POSTGRES_PASSWORD=postgres",
    "POSTGRES_DB=jobsdb"
  ]

  ports {
    internal = 5432
    external = 5432
  }

  mounts {
    type   = "volume"
    source = docker_volume.postgres_data.name
    target = "/var/lib/postgresql/data"
  }
  
  # Mount init.sql if it exists
  dynamic "mounts" {
    for_each = fileexists("${path.module}/jobs-db/init.sql") ? [1] : []
    content {
      type      = "bind"
      source    = "${local.project_root}/jobs-db/init.sql"
      target    = "/docker-entrypoint-initdb.d/init.sql"
      read_only = true
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  healthcheck {
    test     = ["CMD-SHELL", "pg_isready -U postgres"]
    interval = "5s"
    timeout  = "2s"
    retries  = 5
  }
}

resource "docker_container" "redis_service" {
  name  = "redis-service"
  image = docker_image.redis.name

  ports {
    internal = 6379
    external = 6379
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  healthcheck {
    test     = ["CMD", "redis-cli", "ping"]
    interval = "5s"
    timeout  = "3s"
    retries  = 5
  }
}

resource "docker_container" "search_index_service" {
  name  = "search-index-service"
  image = docker_image.elasticsearch.name

  env = [
    "discovery.type=single-node",
    "ES_JAVA_OPTS=-Xms512m -Xmx512m",
    "xpack.security.enabled=false"
  ]

  ports {
    internal = 9200
    external = 9200
  }

  mounts {
    type   = "volume"
    source = docker_volume.elasticsearch_data.name
    target = "/usr/share/elasticsearch/data"
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  healthcheck {
    test     = ["CMD-SHELL", "curl -s http://localhost:9200/_cluster/health || exit 1"]
    interval = "10s"
    timeout  = "5s"
    retries  = 5
  }
}

resource "docker_container" "users_service" {
  name  = "users-service"
  image = docker_image.users_service.name

  dynamic "mounts" {
    for_each = dirname(fileexists("${path.module}/users-service/server.js") ? "${path.module}/users-service/server.js" : "${path.module}/non-existent-path") != "${path.module}/non-existent-path" ? [1] : []
    content {
      type   = "bind"
      source = "${local.project_root}/users-service"
      target = "/app"
    }
  }
  
  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.messaging_queue_service
  ]

  working_dir = "/app"
  command = ["node", "server.js"]
}

resource "docker_container" "jobs_service" {
  name  = "jobs-service"
  image = docker_image.jobs_service.name

  dynamic "mounts" {
    for_each = dirname(fileexists("${path.module}/jobs-service/server.js") ? "${path.module}/jobs-service/server.js" : "${path.module}/non-existent-path") != "${path.module}/non-existent-path" ? [1] : []
    content {
      type   = "bind"
      source = "${local.project_root}/jobs-service"
      target = "/app"
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.jobs_db,
    docker_container.messaging_queue_service
  ]

  working_dir = "/app"
  command = ["node", "server.js"]
}

resource "docker_container" "resumes_service" {
  name  = "resumes-service"
  image = docker_image.resumes_service.name

  dynamic "mounts" {
    for_each = dirname(fileexists("${path.module}/resumes-service/server.js") ? "${path.module}/resumes-service/server.js" : "${path.module}/non-existent-path") != "${path.module}/non-existent-path" ? [1] : []
    content {
      type   = "bind"
      source = "${local.project_root}/resumes-service"
      target = "/app"
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.messaging_queue_service
  ]

  working_dir = "/app"
  command = ["node", "server.js"]
}

resource "docker_container" "scraping_service" {
  name  = "scraping-service"
  image = docker_image.scraping_service.name

  dynamic "mounts" {
    for_each = dirname(fileexists("${path.module}/scraping-service/index.js") ? "${path.module}/scraping-service/index.js" : "${path.module}/non-existent-path") != "${path.module}/non-existent-path" ? [1] : []
    content {
      type   = "bind"
      source = "${local.project_root}/scraping-service"
      target = "/app"
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.jobs_db,
    docker_container.messaging_queue_service
  ]

  working_dir = "/app"
  command = ["node", "index.js"]
}

resource "docker_container" "notification_service" {
  name  = "notification-service"
  image = docker_image.node.name

  dynamic "mounts" {
    for_each = dirname(fileexists("${path.module}/notification-service/notification.js") ? "${path.module}/notification-service/notification.js" : "${path.module}/non-existent-path") != "${path.module}/non-existent-path" ? [1] : []
    content {
      type   = "bind"
      source = "${local.project_root}/notification-service"
      target = "/app"
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.redis_service,
    docker_container.messaging_queue_service
  ]

  working_dir = "/app"
  command = ["node", "notification.js"]
}

resource "docker_container" "search_index_ui" {
  name  = "search-index-ui-service"
  image = docker_image.kibana.name

  env = [
    "ELASTICSEARCH_HOSTS=http://search-index-service:9200"
  ]

  ports {
    internal = 5601
    external = 5601
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.search_index_service
  ]
}

resource "docker_container" "logstash" {
  name  = "logstash"
  image = docker_image.logstash.name

  ports {
    internal = 5044
    external = 5044
  }
  ports {
    internal = 9600
    external = 9600
  }

  # Mount logstash config if it exists
  dynamic "mounts" {
    for_each = fileexists("${path.module}/search-index-service/logstash.conf") ? [1] : []
    content {
      type      = "bind"
      source    = "${local.project_root}/search-index-service/logstash.conf"
      target    = "/usr/share/logstash/pipeline/logstash.conf"
      read_only = true
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.search_index_service,
    docker_container.messaging_queue_service
  ]
}

resource "docker_container" "reverse_proxy" {
  name  = "reverse-proxy"
  image = docker_image.nginx.name

  ports {
    internal = 80
    external = 80
  }

  # Mount nginx config if it exists
  dynamic "mounts" {
    for_each = fileexists("${path.module}/reverse-proxy/nginx.conf") ? [1] : []
    content {
      type      = "bind"
      source    = "${local.project_root}/reverse-proxy/nginx.conf"
      target    = "/etc/nginx/nginx.conf"
      read_only = true
    }
  }

  networks_advanced {
    name = docker_network.backend.name
  }

  depends_on = [
    docker_container.users_service,
    docker_container.jobs_service,
    docker_container.resumes_service
  ]
}