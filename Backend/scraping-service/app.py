import os
import pika
import redis
import dotenv
import json

from Scrapers.AmazonScraper import AmazonScraper
from Scrapers.GoogleScraper import GoogleScraper
from Scrapers.LinkedInScraper import LinkedInScraper
from Scrapers.MetaScraper import MetaScraper
from Scrapers.WuzzufScraper import WuzzufScraper


class JobScraper:
    def __init__(self):
        dotenv.load_dotenv()
        RABBITMQ_USER = os.getenv("RABBITMQ_USER")
        RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")
        RABBITMQ_HOST = os.getenv("RABBITMQ_HOST")
        RABBITMQ_PORT = os.getenv("RABBITMQ_PORT")

        self.redis = redis.Redis(host='redis-service', port=6379, db=0)

        connection = pika.BlockingConnection(
            pika.ConnectionParameters(RABBITMQ_HOST, RABBITMQ_PORT, credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
                                      ))
        self.channel = connection.channel()
        self.channel.queue_declare(queue='jobs_queue', durable=True)

        self.scrapers = [MetaScraper(), AmazonScraper(),
                         GoogleScraper(), LinkedInScraper()]
        self.fetch_jobs()

        connection.close()

    def fetch_jobs(self):
        unseen_jobs = []
        print("Fetching jobs...")

        for scraper in self.scrapers:
            jobs = scraper.scrape_jobs()
            for job in jobs:
                job_id = job.job_id

                if not self.redis.sismember("jobs_ids_cache", job_id):
                    unseen_jobs.append(job)

        for job in unseen_jobs:
            job_message = json.dumps(job.__dict__)
            self.channel.basic_publish(
                routing_key='jobs_queue',
                exchange='',
                body=job_message,
                properties=pika.BasicProperties(
                    delivery_mode=2
                )
            )
            self.redis.sadd("job_ids_cache", job_id)

        print(f"Inserted {len(unseen_jobs)} new jobs into the database")


if __name__ == "__main__":
    JobScraper()
