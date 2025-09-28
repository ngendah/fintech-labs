import os

import kagglehub
from kagglehub import KaggleDatasetAdapter
from pydantic import FileUrl

from .config import Settings


def fraud_detection_data(settings: Settings) -> FileUrl:
    file_name = "PS_20174392719_1491204439457_log.csv"
    file_path = os.path.join(settings.temp_dir, file_name)
    if os.path.exists(file_path):
        return FileUrl(file_path)
    df = kagglehub.load_dataset(
        KaggleDatasetAdapter.PANDAS, "ealaxi/paysim1", file_path
    )
    df.to_csv(file_path)
    return FileUrl(file_path)
