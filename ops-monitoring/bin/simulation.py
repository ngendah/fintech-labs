import logging
import os
import random
import time
import uuid
from datetime import datetime, timedelta
from logging_loki import LokiQueueHandler
from multiprocessing import Queue

# pip install --user python-logging-loki requests

LOKI_URL = f"{os.getenv("LOKI_HOST", "http://localhost:3100")}/loki/api/v1/push"
LOG_LEVEL = logging.INFO
LOG_INTERVAL_SECONDS = 1


logger = logging.getLogger("payment_logger")
logger.setLevel(LOG_LEVEL)
try:
    handler = LokiQueueHandler(
        Queue(-1),
        url=LOKI_URL,
        tags={"application": "fake_payments", "environment": "dev"},
        version="1",
    )
    logger.addHandler(handler)
except Exception as e:
    print(f"Error configuring LokiHandler: {e}")
    print("Please ensure Loki is running and the URL is correct.")
    exit()

def generate_fake_payment():
    payment_id = str(uuid.uuid4())
    user_id = f"user_{random.randint(1000, 9999)}"
    amount = round(random.uniform(1.00, 1000.00), 2)
    currency = random.choice(["KES", "UGX", "NGN", "TZS", "EGP"])
    status = random.choice(["SUCCESS", "FAILED", "PENDING", "REFUNDED"])
    payment_method = random.choice(["credit_card", "paypal", "bank_transfer", "mobile_money"])
    transaction_time = (datetime.now() - timedelta(seconds=random.randint(0, 3600))).isoformat()

    log_message = {
        "payment_id": payment_id,
        "user_id": user_id,
        "amount": amount,
        "currency": currency,
        "status": status,
        "payment_method": payment_method,
        "transaction_time": transaction_time,
    }

    if status == "FAILED":
        failure_reasons = [
            "Insufficient funds",
            "Card declined",
            "Fraud suspected",
            "Gateway error",
            "Expired card",
        ]
        log_message["failure_reason"] = random.choice(failure_reasons)

    return log_message

def main():
    try:
        while True:
            payment_data = generate_fake_payment()
            if payment_data["status"] == "SUCCESS":
                logger.info(f"Payment SUCCESS: {payment_data}")
            elif payment_data["status"] == "FAILED":
                logger.error(f"Payment FAILED: {payment_data}")
            elif payment_data["status"] == "PENDING":
                logger.warning(f"Payment PENDING: {payment_data}")
            else:
                logger.info(f"Payment REFUNDED: {payment_data}")
            time.sleep(LOG_INTERVAL_SECONDS)
    except KeyboardInterrupt:
        print("\nStopping...")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")
    finally:
        handler.close()
        print("\nFinished sending simulated logs.")

if __name__=="__main__":
    print(f"\nStarting to send simulated payment logs to Loki.")
    print(f"Logs will be sent every {LOG_INTERVAL_SECONDS} second(s)", flush=True)
    main()