import copy
import json
from pathlib import Path

import joblib


DEFAULT_EVALUATION_SNAPSHOT = {
    "evaluation_metrics": {
        "decision_tree": {
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "roc_auc": 0.0,
            "f1_score": 0.0,
        },
        "naive_bayes": {
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "roc_auc": 0.0,
            "f1_score": 0.0,
        },
        "knn": {
            "accuracy": 0.0,
            "precision": 0.0,
            "recall": 0.0,
            "roc_auc": 0.0,
            "f1_score": 0.0,
        },
    },
    "confusion_matrices": [
        {"model": "Decision Tree", "tp": 0, "fp": 0, "tn": 0, "fn": 0},
        {"model": "Naive Bayes", "tp": 0, "fp": 0, "tn": 0, "fn": 0},
        {"model": "K-NN", "tp": 0, "fp": 0, "tn": 0, "fn": 0},
    ],
}


def load_models():
    return {
        "KNN": joblib.load("models/knn.pkl"),
        "NaiveBayes": joblib.load("models/naive_bayes.pkl"),
        "DecisionTree": joblib.load("models/decision_tree.pkl")
    }


def _normalize_model_label(label):
    normalized = str(label).strip().lower()
    mapping = {
        "decision tree": "decision_tree",
        "decision_tree": "decision_tree",
        "naive bayes": "naive_bayes",
        "naive_bayes": "naive_bayes",
        "knn": "knn",
        "k-nn": "knn",
    }
    return mapping.get(normalized)


def _resolve_data_path(path):
    file_path = Path(path)
    if not file_path.is_absolute() and not file_path.exists():
        file_path = Path(__file__).resolve().parents[1] / path
    return file_path


def _load_json_file(path):
    file_path = _resolve_data_path(path)
    if not file_path.exists():
        return None
    try:
        with file_path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except (OSError, json.JSONDecodeError):
        return None


def _parse_flat_metrics_list(items):
    parsed = copy.deepcopy(DEFAULT_EVALUATION_SNAPSHOT)
    for item in items:
        if not isinstance(item, dict):
            continue
        model_key = _normalize_model_label(item.get("Model"))
        if not model_key:
            continue
        parsed["evaluation_metrics"][model_key] = {
            "accuracy": float(item.get("Accuracy", 0.0)),
            "precision": float(item.get("Precision", 0.0)),
            "recall": float(item.get("Recall", 0.0)),
            "roc_auc": float(item.get("ROC_AUC", 0.0)),
            "f1_score": float(item.get("F1_score", 0.0)),
        }
    return parsed


def _parse_confusion_matrix_dict(raw_confusion):
    model_name_map = {
        "DecisionTree": "Decision Tree",
        "NaiveBayes": "Naive Bayes",
        "KNN": "K-NN",
    }
    parsed = []
    for model_key in ("DecisionTree", "NaiveBayes", "KNN"):
        item = raw_confusion.get(model_key, {})
        matrix = item.get("matrix") if isinstance(item, dict) else None
        if (
            isinstance(matrix, list)
            and len(matrix) == 2
            and all(isinstance(row, list) and len(row) == 2 for row in matrix)
        ):
            tn = int(matrix[0][0])
            fp = int(matrix[0][1])
            fn = int(matrix[1][0])
            tp = int(matrix[1][1])
            parsed.append(
                {
                    "model": model_name_map[model_key],
                    "tp": tp,
                    "fp": fp,
                    "tn": tn,
                    "fn": fn,
                }
            )
    return parsed


def load_evaluation_snapshot(
    metrics_path="data/model_metrics.json",
    confusion_path="data/confusion_matrices.json",
):
    snapshot = copy.deepcopy(DEFAULT_EVALUATION_SNAPSHOT)

    loaded_metrics = _load_json_file(metrics_path)
    if isinstance(loaded_metrics, list):
        snapshot.update(_parse_flat_metrics_list(loaded_metrics))
    elif isinstance(loaded_metrics, dict):
        if isinstance(loaded_metrics.get("evaluation_metrics"), dict):
            snapshot["evaluation_metrics"].update(loaded_metrics["evaluation_metrics"])
        if isinstance(loaded_metrics.get("confusion_matrices"), list):
            snapshot["confusion_matrices"] = loaded_metrics["confusion_matrices"]

    loaded_confusion = _load_json_file(confusion_path)
    if isinstance(loaded_confusion, dict):
        parsed_confusion = _parse_confusion_matrix_dict(loaded_confusion)
        if parsed_confusion:
            snapshot["confusion_matrices"] = parsed_confusion

    return snapshot
