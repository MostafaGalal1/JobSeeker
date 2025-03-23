# email_server.py
from smtplib import SMTP 
import psycopg2
from flask import Flask, jsonify
import requests
from dotenv import load_dotenv
import os
from concurrent.futures import ThreadPoolExecutor

load_dotenv()

app = Flask(__name__)



SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")
API_BACKEND_URL = os.getenv("API_BACKEND_URL")

def send_email(to_email, subject, body):
    try:
        # Combine the subject and body (RFC 5322 format)
        message = f"Subject: {subject}\n\n{body}"

        server = SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()

        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, message)

    except Exception as e:
        print("Error in sending emails: " + e)
    
    finally:
        server.quit()

def fetch_and_send_emails():
    try:
        jobs_response = requests.get(f"{API_BACKEND_URL}/jobs")
        jobs_response.raise_for_status()
        jobs = jobs_response.json()  

        emails_response = requests.get(f"{API_BACKEND_URL}/users")
        emails_response.raise_for_status()
        emails = emails_response.json()

        # Create the message body
        subject = "📋 Latest Job Listings:\n\n"
        body = generate_email_body(jobs)

        with ThreadPoolExecutor(max_workers=100) as executer:
            for email in emails:
                executer.submit(send_email, email, subject, body)


    except psycopg2.Error as e:
        print("Query execution error:", e)

def generate_email_body(jobs):
    body = ""
    for job in jobs:
        try:
            job_id = job.get("job_id")
            title = job.get("job_title")
            company = job.get("company_name")
            exp_years = job.get("experience_years")
            exp_level = job.get("experience_level")
            salary = job.get("salary")
            city = job.get("city")
            country = job.get("country")
            job_link = job.get("job_url")

            # Append job info to body
            body += f"""
🆔 ID: {job_id}
🏢 Company: {company}
📌 Title: {title}
💼 Experience: {exp_years} ({exp_level})
💰 Salary: {salary}
📍 Location: {city}, {country}
🔗 Job Link: {job_link}

----------------------------------------
"""
        except Exception as e:
            print(f"Error processing job: {job}, Error: {e}")

    return body

@app.route('/send-emails', methods=['POST'])
def trigger_email():
    fetch_and_send_emails()
    return jsonify({"status": "Sending Emails."}), 200

@app.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "Email server is running."}), 200

if __name__ == '__main__':
    print("📧 Starting email server...")
    app.run(debug=True, port=5001)  
