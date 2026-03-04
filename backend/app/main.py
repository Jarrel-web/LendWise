from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.model_loader import load_evaluation_snapshot, load_models
from app.schemas import LoanRequest, LoanResponse
from app.services.prediction_service import run_prediction

app = FastAPI(title="Loan Risk Multi-Model API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models = load_models()
evaluation_snapshot = load_evaluation_snapshot()


@app.get("/")
def root():
    return {"message": "Loan Risk API Running"}


@app.post("/predict", response_model=LoanResponse)
def predict_loan(request: LoanRequest):
    prediction_payload = run_prediction(
        models=models,
        request=request,
        evaluation_metrics=evaluation_snapshot["evaluation_metrics"],
    )

    return {
        "applicant": request,
        "predictions": prediction_payload["predictions"],
        "decision_policy": prediction_payload["decision_policy"],
        "evaluation_metrics": evaluation_snapshot["evaluation_metrics"],
        "confusion_matrices": evaluation_snapshot["confusion_matrices"],
        "results": prediction_payload["results"],
    }
