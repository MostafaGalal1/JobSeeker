FROM python:3.10-slim

RUN apt-get update && apt-get install -y cron && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY scraper-cron /etc/cron.d/scraper-cron

RUN chmod 0644 /etc/cron.d/scraper-cron && crontab /etc/cron.d/scraper-cron

RUN mkdir -p /var/log && touch /var/log/cron.log

CMD ["sh", "-c", "cron && tail -f /var/log/cron.log"]