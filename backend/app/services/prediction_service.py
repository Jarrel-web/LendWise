import pandas as pd

from app.services.class_labels import default_class_index
from app.services.cost_policy import build_decision_policy, calculate_expected_loss, decide_action
from app.services.model_metadata import MODEL_ORDER, MODEL_PRESENTATION

METRICS_KEY_MAP = {
    "DecisionTree": "decision_tree",
    "NaiveBayes": "naive_bayes",
    "KNN": "knn",
}


def build_input_frame(request):
    return pd.DataFrame(
        [
            {
                "Age": request.Age,
                "Sex": request.Sex,
                "Job": request.Job,
                "Housing": request.Housing,
                "Saving accounts": request.Saving_accounts,
                "Checking account": request.Checking_account,
                "Credit amount": request.Credit_amount,
                "Duration": request.Duration,
                "Purpose": request.Purpose,
            }
        ]
    )


def evaluate_model(model, input_data, loan_amount, max_loss):
    probabilities = model.predict_proba(input_data)[0]
    class_index = default_class_index(model, len(probabilities))
    prob_default = float(probabilities[class_index])

    expected_loss = calculate_expected_loss(prob_default, loan_amount)
    decision = decide_action(prob_default, loan_amount, max_loss)

    return {
        "probability_default": round(prob_default, 4),
        "expected_loss": round(expected_loss, 2),
        "decision": decision,
    }


def build_prediction(model_key, result):
    prob_default = min(max(result["probability_default"], 0.0), 1.0)
    metadata = MODEL_PRESENTATION[model_key]

    return {
        "model": metadata["model"],
        "probability_default": round(prob_default, 4),
        "probability_non_default": round(1 - prob_default, 4),
        "decision": "Grant" if result["decision"] == "Grant" else "Deny",
        "confidence": round(abs(0.5 - prob_default) * 2, 4),
        "concept": metadata["concept"],
        "description": metadata["description"],
    }


def _get_model_weight(model_key, evaluation_metrics):
    if not isinstance(evaluation_metrics, dict):
        return 0.0

    metrics_key = METRICS_KEY_MAP[model_key]
    model_metrics = evaluation_metrics.get(metrics_key, {})
    if not isinstance(model_metrics, dict):
        return 0.0

    try:
        weight = float(model_metrics.get("roc_auc", 0.0))
    except (TypeError, ValueError):
        return 0.0

    return max(weight, 0.0)


def _compute_ensemble_probability(model_probabilities, evaluation_metrics):
    weighted_sum = 0.0
    total_weight = 0.0

    for model_key, prob_default in model_probabilities.items():
        weight = _get_model_weight(model_key, evaluation_metrics)
        weighted_sum += weight * prob_default
        total_weight += weight

    if total_weight <= 0:
        return sum(model_probabilities.values()) / len(model_probabilities)

    return weighted_sum / total_weight


def run_prediction(models, request, evaluation_metrics=None):
    input_data = build_input_frame(request)
    results = {}
    predictions = []
    model_probabilities = {}

    for model_name in MODEL_ORDER:
        model = models[model_name]
        result = evaluate_model(
            model=model,
            input_data=input_data,
            loan_amount=request.Credit_amount,
            max_loss=request.max_acceptable_loss,
        )
        results[model_name] = result
        model_probabilities[model_name] = result["probability_default"]
        predictions.append(build_prediction(model_name, result))

    ensemble_prob_default = _compute_ensemble_probability(
        model_probabilities=model_probabilities,
        evaluation_metrics=evaluation_metrics,
    )

    decision_policy = build_decision_policy(
        predictions=predictions,
        loan_amount=request.Credit_amount,
        max_acceptable_loss=request.max_acceptable_loss,
        ensemble_prob_default=ensemble_prob_default,
    )

    return {
        "results": results,
        "predictions": predictions,
        "decision_policy": decision_policy,
    }
