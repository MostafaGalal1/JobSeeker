import pika
import json

job_data = {
    "job_id": 123,
    "task": "process_image",
    "params": {
        "image_url": "https://example.com/image.jpg"
    }
}

# Serialize the job to JSON
job_message = json.dumps(job_data)

# Connect to RabbitMQ server
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

# Declare a queue named 'jobs'
channel.queue_declare(queue='jobs', durable=True)  # durable=True makes the queue persistent

print(f" [x] Sent job: {job_message}")

# Close the connection
connection.close()
