from app.config import (
    DECISION_TIE_TOLERANCE,
    DEFAULT_LGD,
    OPPORTUNITY_PROFIT_RATE,
    REVIEW_COST_GAP_RATIO,
    REVIEW_PROBABILITY_SPREAD,
)


def calculate_expected_loss(prob_default, loan_amount):
    return prob_default * DEFAULT_LGD * loan_amount


def calculate_deny_loss(prob_default, loan_amount):
    return (1 - prob_default) * loan_amount * OPPORTUNITY_PROFIT_RATE


def decide_action(prob_default, loan_amount, max_acceptable_loss):
    cost_grant = calculate_expected_loss(prob_default, loan_amount)
    cost_deny = calculate_deny_loss(prob_default, loan_amount)

    if cost_grant > max_acceptable_loss:
        return "Deny"

    if abs(cost_grant - cost_deny) <= DECISION_TIE_TOLERANCE * max(cost_deny, 1.0):
        return "Grant"

    return "Grant" if cost_grant < cost_deny else "Deny"


def build_decision_policy(
    predictions,
    loan_amount,
    max_acceptable_loss,
    ensemble_prob_default=None,
):
    if ensemble_prob_default is None:
        if predictions:
            avg_prob_default = sum(p["probability_default"] for p in predictions) / len(predictions)
        else:
            avg_prob_default = 0.0
    else:
        avg_prob_default = float(ensemble_prob_default)

    cost_grant = calculate_expected_loss(avg_prob_default, loan_amount)
    cost_deny = calculate_deny_loss(avg_prob_default, loan_amount)
    optimal_action = decide_action(avg_prob_default, loan_amount, max_acceptable_loss)
    cost_gap_ratio = abs(cost_grant - cost_deny) / max(cost_deny, 1.0)

    if predictions:
        max_prob = max(p["probability_default"] for p in predictions)
        min_prob = min(p["probability_default"] for p in predictions)
        probability_spread = max_prob - min_prob
    else:
        probability_spread = 0.0

    review_reasons = []
    if cost_gap_ratio <= REVIEW_COST_GAP_RATIO:
        review_reasons.append("Low cost margin between Grant and Deny scenarios.")
    if probability_spread >= REVIEW_PROBABILITY_SPREAD:
        review_reasons.append("High disagreement between model default probabilities.")

    return {
        "cost_grant": round(cost_grant, 2),
        "cost_deny": round(cost_deny, 2),
        "optimal_action": optimal_action,
        "expected_loss_grant": round(cost_grant, 2),
        "expected_loss_deny": round(cost_deny, 2),
        "policy_probability_default": round(avg_prob_default, 4),
        "review_flag": bool(review_reasons),
        "review_reasons": review_reasons,
    }
