from abc import ABC, abstractmethod

from imblearn.under_sampling import NearMiss
from joblib import dump, load
from pydantic import FileUrl
from sklearn.compose import make_column_transformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OrdinalEncoder


class Model(ABC):
    @abstractmethod
    def fit(self, X, y):
        raise NotImplementedError()

    @abstractmethod
    def predict(self, x):
        raise NotImplementedError()

    @abstractmethod
    def save(self, file_url: FileUrl):
        raise NotImplementedError()

    @abstractmethod
    def load(self, file_url: FileUrl):
        raise NotImplementedError()


class Dataset:
    def __init__(self, data_frame):
        self.df = data_frame
        self.column_transformer = make_column_transformer(
            (OrdinalEncoder(), ["type"]), remainder="passthrough"
        )

    @staticmethod
    def orig_balance(row):
        bal = row["oldbalanceOrg"] - row["amount"]
        if bal == 0:
            return 0
        return -1 if bal < 0 else 1

    @staticmethod
    def dest_balance(row):
        bal = row["oldbalanceDest"] - row["amount"] - row["newbalanceDest"]
        if bal == 0:
            return 0
        return -1 if bal < 0 else 1

    def clean_transform(self):
        fraud_dataset = self.df.sample(frac=1).reset_index(drop=True)
        fraud_dataset["balanceOrig"] = fraud_dataset.apply(
            self.orig_balance, axis=1
        )
        fraud_dataset = fraud_dataset.drop(
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
        dataset = fraud_dataset.reindex(
            columns=[
                "type",
                "amount",
                "balanceOrig",
                "isFlaggedFraud",
                "isFraud",
            ]
        )
        return self.column_transformer.fit_transform(dataset)

    def train_test_split(
        self, split_ratio: float, random_state: int | None = None
    ):
        dataset = self.clean_transform()
        X = dataset[:, :-1]
        y = dataset[:, -1]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=split_ratio, random_state=random_state
        )
        X_train, y_train = NearMiss().fit_resample(X_train, y_train)
        X_test, y_test = NearMiss().fit_resample(X_test, y_test)
        return X_train, X_test, y_test, y_train

    def train(
        self,
        model: Model,
        split_ratio: float = 0.5,
        random_state: int | None = None,
    ):
        X_train, X_test, y_test, y_train = self.train_test_split(
            split_ratio=split_ratio, random_state=random_state
        )
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        report = classification_report(
            y_test, y_pred, target_names=["ok", "isFraud"]
        )
        return accuracy, report


class RandomForestModel(Model):
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)

    def fit(self, X, y):
        return self.model.fit(X, y)

    def predict(self, x):
        return self.model.predict(x)

    def save(self, file_url: FileUrl):
        return dump(self.model, str(file_url))

    def load(self, file_url: FileUrl):
        self.model = load(str(file_url))
