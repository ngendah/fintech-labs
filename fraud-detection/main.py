from prefect import flow, task, Completed

from .config import Settings
from .data_source import fraud_detection_data

settings = Settings()


@task
def download_data():
    return fraud_detection_data(settings)


@task
def train_detection_model() -> bool:
    return False


def main():
    print("Hello from fraud-detection!")


if __name__ == "__main__":
    main()
