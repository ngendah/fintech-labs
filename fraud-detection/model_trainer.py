import os
import numpy as np
import pandas as pd
from pydantic import FileUrl, BaseModel, Field
from joblib import dump
from .config import Settings
from sklearn.compose import make_column_transformer
from sklearn.preprocessing import OrdinalEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from imblearn.over_sampling import ADASYN
from imblearn.pipeline import Pipeline


class TrainingReport(BaseModel):
    name: str = Field()
    accuracy: float = Field()
    report: object = Field()


class FraudDetector:
    def __init__(self, test_validation_split_ratio: float = 0.4):
        self.test_validation_split_ratio = test_validation_split_ratio
        self.classifier = RandomForestClassifier(
            n_estimators=100, random_state=42
        )

    @staticmethod()
    def orig_balance(row):
        bal = row["oldbalanceOrg"] - row["amount"]
        if bal == 0:
            return 0
        return -1 if bal < 0 else 1

    @staticmethod()
    def dest_balance(row):
        bal = row["oldbalanceDest"] - row["amount"] - row["newbalanceDest"]
        if bal == 0:
            return 0
        return -1 if bal < 0 else 1

    def clean(self, dataset):
        dataset["balanceOrig"] = dataset.apply(self.orig_balance, axis=1)
        dataset = dataset.drop(
            [
                "step",
                "nameOrig",
                "nameDest",
                "oldbalanceOrg",
                "newbalanceOrig",
                "oldbalanceDest",
                "newbalanceDest",
            ],
            axis=1,
        )
        dataset = dataset.reindex(
            columns=[
                "type",
                "amount",
                "balanceOrig",
                "isFlaggedFraud",
                "isFraud",
            ]
        )
        return dataset

    def transform(self, dataset):
        transformer = make_column_transformer(
            (OrdinalEncoder(), ["type"]), remainder="passthrough"
        )
        return transformer.fit_transform(dataset)

    def training_validation_split(self, dataset):
        data_length = len(dataset)
        testing_length = data_length * self.test_validation_split_ratio
        validation_length = data_length - testing_length
        return (dataset[:testing_length, :], dataset[validation_length::, :])

    def train_model(self, dataset) -> TrainingReport:
        X = dataset[:, :-1]
        y = dataset[:, -1]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.3, random_state=42
        )
        pipeline = Pipeline(
            [
                ("adaysn", ADASYN(sampling_strategy="minority")),
                (
                    "clf",
                    RandomForestClassifier(n_estimators=2, random_state=42),
                ),
            ]
        )
        pipeline.fit(X_train, y_train)
        y_pred = self.classifier.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(
            y_test, y_pred, target_names=["ok", "isFraud"]
        )
        return TrainingReport(
            name="TrainingReport", accuracy=accuracy, report=report
        )

    def validate_model(self, dataset) -> TrainingReport:
        X_val = dataset[:, :-1]
        y_val = dataset[:, -1]
        y_pred = self.classifier.predict(X_val)
        accuracy = accuracy_score(y_val, y_pred)
        report = classification_report(
            y_val, y_pred, target_names=["ok", "isFraud"]
        )
        return TrainingReport(
            name="ValidationReport", accuracy=accuracy, report=report
        )

    def write_model(self, file_url: FileUrl):
        return dump(self.classifier, str(file_url))

    def train(
        self, name: str, settings: Settings, dataset_file_url: FileUrl
    ) -> tuple[TrainingReport]:
        dataset = pd.read_csv(dataset_file_url)
        dataset = self.clean(dataset)
        dataset = self.transform(dataset)
        training_dataset, validation_dataset = self.training_validation_split(
            dataset
        )
        training_report = self.train_model(training_dataset)
        validation_report = self.validate_model(validation_dataset)
        file_url = os.path.join(settings.model_dir, name)
        self.write_model(file_url)
        return training_report, validation_report
