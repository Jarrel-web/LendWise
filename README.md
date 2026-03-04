# LendWise

LendWise is a full-stack loan risk assessment project built to test and strengthen my understanding of core machine learning concepts, especially:

- Decision Tree
- Naive Bayes
- K-NN

This project is part of my SC4000 Machine Learning learning journey.  
In newer updates, I will test and integrate additional models from the course.

## Project Goals

- Apply multiple ML models to the same lending problem.
- Compare model behavior and performance using metrics and confusion matrices.
- Translate model probabilities into business actions (`Grant` / `Deny`) using cost-based decision policy.
- Build an explainable dashboard for model outputs and decision rationale.

## Current Stack

- Backend: FastAPI + scikit-learn model artifacts (`.pkl`)
- Frontend: Next.js + TypeScript + Recharts
- Data artifacts:
  - `backend/data/model_metrics.json`
  - `backend/data/confusion_matrices.json`

## Repository Structure

```text
backend/
  app/
    main.py
    model_loader.py
    schemas.py
    services/
      class_labels.py
      cost_policy.py
      model_metadata.py
      prediction_service.py
  data/
    german_credit_data.csv
    model_metrics.json
    confusion_matrices.json
  models/
    decision_tree.pkl
    naive_bayes.pkl
    knn.pkl

frontend/
  app/
  components/
  lib/
```

## How It Works

1. Backend loads pre-trained models from `backend/models`.
2. `/predict` receives applicant input.
3. Each model outputs `P(default|x)` (shown in UI as `Risk`).
4. System computes weighted ensemble probability (weighted by model ROC-AUC from `model_metrics.json`).
5. Cost policy compares:
   - `cost_grant = p_default * LGD * loan_amount`
   - `cost_deny = (1 - p_default) * opportunity_profit_rate * loan_amount`
6. API returns:
   - model-level predictions
   - final decision policy
   - evaluation metrics
   - confusion matrices
   - manual review flag/reasons for borderline cases

## Quick Start

## 1) Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

## 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at: `http://localhost:3000`

Default backend URL is configured in `frontend/.env.example`:

```env
BACKEND_API_URL=http://127.0.0.1:8000
```

## API

### `POST /predict`

Example request:

```json
{
  "Age": 45,
  "Sex": "male",
  "Job": 2,
  "Housing": "own",
  "Saving_accounts": "moderate",
  "Checking_account": "moderate",
  "Credit_amount": 1500,
  "Duration": 12,
  "Purpose": "radio/TV",
  "max_acceptable_loss": 2000
}
```

Response includes:

- `predictions`: per-model probabilities and decisions
- `decision_policy`: final recommendation + expected costs + review flag
- `evaluation_metrics`: loaded from `model_metrics.json`
- `confusion_matrices`: loaded from `confusion_matrices.json`

## Notes

- `Risk` in the UI corresponds to model default probability.
- `Safe` corresponds to non-default probability.
- This is a learning-focused project for model comparison and explainability, not a production credit underwriting system.

## Roadmap

- Add more SC4000 models (e.g., SVM, Logistic Regression, Random Forest, Boosting).
- Add probability calibration comparison across models.
- Add experiment tracking for model versions and metrics.
- Add model selection strategies beyond ROC-AUC weighted ensemble.

