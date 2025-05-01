import pika
import cohere
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance
import uuid
import json

co = cohere.Client("your-cohere-api-key")
qdrant = QdrantClient("localhost", port=6333)

collection_name = "jobs_embedding"
qdrant.recreate_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(size=4096, distance=Distance.COSINE)
)

credentials = pika.PlainCredentials('job-seeker-admin', 'yL6QteLhHHN8BausRIDxv2XzWOG2XHA76JBuLnSYsg1D')
parameters = pika.ConnectionParameters(
    host='messaging-queue-service',
    credentials=credentials
)

connection = pika.BlockingConnection(parameters)
channel = connection.channel()
channel.queue_declare(queue='embedding_tasks', durable=True)

def callback(ch, method, properties, body):
    data = json.loads(body)
    job_text = data.get("job")

    response = co.embed(texts=[job_text], model="embed-english-v3.0")
    if response.status_code != 200:
        #requeue in the queue embedding_tasks
        ...
        return
    vector = response.embeddings[0]

    point = PointStruct(id=str(uuid.uuid4()), vector=vector, payload=data)
    qdrant.upsert(collection_name=collection_name, points=[point])

    print(f"[+] Job embedded and stored: {data.get('job_title')}")
    # ack successful message
    ...

channel.basic_consume(queue='embedding_tasks',
                      on_message_callback=callback,
                      auto_ack=False)

channel.start_consuming()
