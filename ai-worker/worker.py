import pika
import json
import time
import os
from dotenv import load_dotenv

load_dotenv()

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
QUEUE_TASK = "ai_task_queue"
QUEUE_RESULT = "ai_result_queue"

def process_ai_task(ch, method, properties, body):
    task = json.loads(body)
    print(f" [x] Received Task: {task['id']}")
    
    # Simulate AI Processing Time
    time.sleep(3)
    
    result = {
        "id": task['id'],
        "status": "COMPLETED",
        "result": "Phát hiện vết nứt bề mặt (YOLOv8)",
        "timestamp": time.time()
    }
    
    # Push back to result queue
    ch.basic_publish(
        exchange='',
        routing_key=QUEUE_RESULT,
        body=json.dumps(result)
    )
    
    print(f" [x] Task {task['id']} Processed and Result Sent.")
    ch.basic_ack(delivery_tag=method.delivery_tag)

def start_worker():
    while True:
        try:
            print(f" [*] Attempting to connect to RabbitMQ at {RABBITMQ_HOST}...")
            connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, heartbeat=600))
            channel = connection.channel()

            channel.queue_declare(queue=QUEUE_TASK, durable=True)
            channel.queue_declare(queue=QUEUE_RESULT, durable=True)

            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue=QUEUE_TASK, on_message_callback=process_ai_task)

            print(' [*] Connected! Waiting for AI tasks. To exit press CTRL+C')
            channel.start_consuming()
        except Exception as e:
            print(f"Error connecting to RabbitMQ: {e}. Retrying in 5s...")
            time.sleep(5)

if __name__ == "__main__":
    start_worker()
