from pydantic import BaseModel
from typing import Dict, List, Literal


class LoanRequest(BaseModel):
    Age: int
    Sex: str
    Job: int
    Housing: str
    Saving_accounts: str   # rename safely
    Checking_account: str  # rename safely
    Credit_amount: float
    Duration: int
    Purpose: str

    max_acceptable_loss: float


class ModelResult(BaseModel):
    probability_default: float
    expected_loss: float
    decision: str


class ModelPrediction(BaseModel):
    model: str
    probability_default: float
    probability_non_default: float
    decision: Literal["Grant", "Deny"]
    confidence: float
    concept: str
    description: str


class DecisionPolicy(BaseModel):
    cost_grant: float
    cost_deny: float
    optimal_action: Literal["Grant", "Deny"]
    expected_loss_grant: float
    expected_loss_deny: float
    policy_probability_default: float
    review_flag: bool
    review_reasons: List[str]


class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    roc_auc: float
    f1_score: float


class EvaluationMetrics(BaseModel):
    decision_tree: ModelMetrics
    naive_bayes: ModelMetrics
    knn: ModelMetrics


class ConfusionMatrix(BaseModel):
    model: str
    tp: int
    fp: int
    tn: int
    fn: int


class LoanResponse(BaseModel):
    applicant: LoanRequest
    predictions: List[ModelPrediction]
    decision_policy: DecisionPolicy
    evaluation_metrics: EvaluationMetrics
    confusion_matrices: List[ConfusionMatrix]
    results: Dict[str, ModelResult]
