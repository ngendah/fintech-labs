import os

import pandas as pd
from datatime import datatime
from prefect import flow, task
from prefect.logging import get_run_logger
from prefect.transactions import transaction
from pydantic import FileUrl

from .config import Settings
from .data_source import fraud_detection_data
from .model import Dataset, RandomForestModel

settings = Settings()


@task
def download_data():
    return fraud_detection_data(settings)


@task
def train_detection_model(data_file_url: FileUrl):
    data_frame = pd.read_csv(data_file_url)
    dataset = Dataset(data_frame)
    model = RandomForestModel()
    dataset.train(model)
    name = datatime.now().strftime("%Y%m%d%H%M")
    file_path = os.path.join(settings.model_dir, f"{name}.joblib")
    return model.save(file_path)


@flow
def pipeline():
    logger = get_run_logger()
    with transaction():
        data_file_url = download_data()
        model_file_url = train_detection_model(data_file_url)
        logger.info(f"model url = {model_file_url}")


if __name__ == "__main__":
    pipeline()
