# LendWise

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![Recharts](https://img.shields.io/badge/Recharts-FF4B4B?style=for-the-badge)](https://recharts.org/)

Full-stack loan risk assessment project to test and strengthen my understanding of machine learning concepts from **SC4000 Machine Learning**.

Current model focus:
- Decision Tree
- Naive Bayes
- K-NN

Planned next steps:
- Integrate and evaluate more SC4000 models in future updates.

## Why This Project

LendWise is built as a learning-first system to connect ML theory with practical implementation:

- Compare multiple models on the same task.
- Inspect performance using metrics and confusion matrices.
- Convert probabilities into actionable business decisions (`Grant` / `Deny`).
- Explain model output clearly in a dashboard.

## Tech Stack

| Layer | Tools |
|---|---|
| Backend | FastAPI, scikit-learn, pandas |
| Frontend | Next.js, TypeScript, Recharts |
| Model Artifacts | `.pkl` models in `backend/models/` |
| Evaluation Artifacts | `backend/data/model_metrics.json`, `backend/data/confusion_matrices.json` |

## Project Structure

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

## ML Flow In This Project

1. Load pre-trained models from `backend/models/`.
2. Receive applicant input at `POST /predict`.
3. Get per-model risk probability (`P(default|x)`), shown in UI as **Risk**.
4. Compute weighted ensemble risk (weights from ROC-AUC in `model_metrics.json`).
5. Apply cost policy:
   - `cost_grant = p_default * LGD * loan_amount`
   - `cost_deny = (1 - p_default) * opportunity_profit_rate * loan_amount`
6. Return:
   - model predictions
   - final decision policy
   - metrics snapshot
   - confusion matrices
   - manual review flag + reasons for borderline cases

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend URL: `http://localhost:3000`

Default frontend backend target:

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

Key response sections:
- `predictions`: per-model risk/safe probabilities + decisions
- `decision_policy`: final recommendation + cost analysis + review flag
- `evaluation_metrics`: loaded from `model_metrics.json`
- `confusion_matrices`: loaded from `confusion_matrices.json`

## Terminology

- **Risk**: default probability from model output.
- **Safe**: non-default probability (`1 - risk`).

## Screenshots

### Dashboard Overview
![Dashboard Overview](assets/Screenshot%202026-03-04%20204632.png)

### Applicant Input and Decision Brief
![Applicant Input and Decision Brief](assets/Screenshot%202026-03-04%20204708.png)

### Model Comparison and Metrics
![Model Comparison and Metrics](assets/Screenshot%202026-03-04%20204725.png)

### Confusion Matrix and Policy Output
![Confusion Matrix and Policy Output](assets/Screenshot%202026-03-04%20204735.png)

## Important Note

This is an educational/learning project for model understanding and explainability.  
It is not a production-ready credit underwriting system.

## Roadmap

- Add more SC4000 models (e.g., Logistic Regression, SVM, Random Forest, Boosting).
- Compare calibrated vs uncalibrated probabilities.
- Add experiment tracking for model versions and metrics.
- Explore alternative ensemble and decision strategies beyond ROC-AUC weighting.
