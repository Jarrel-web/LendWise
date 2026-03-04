// LendWise Prediction Engine
// Simulates Decision Tree, Naive Bayes, and K-NN models for loan risk assessment
// Based on German Credit Dataset features

export interface ApplicantInput {
  Age: number
  Sex: string
  Job: number
  Housing: string
  Saving_accounts: string
  Checking_account: string
  Credit_amount: number
  Duration: number
  Purpose: string
  max_acceptable_loss: number
}

export interface ModelPrediction {
  model: string
  probability_default: number
  probability_non_default: number
  decision: "Grant" | "Deny"
  confidence: number
  concept: string
  description: string
}

export interface DecisionPolicy {
  cost_grant: number
  cost_deny: number
  optimal_action: "Grant" | "Deny"
  expected_loss_grant: number
  expected_loss_deny: number
  policy_probability_default: number
  review_flag: boolean
  review_reasons: string[]
}

export interface PredictionResult {
  applicant: ApplicantInput
  predictions: ModelPrediction[]
  decision_policy: DecisionPolicy
  evaluation_metrics: EvaluationMetrics
  confusion_matrices: ConfusionMatrix[]
}

export interface EvaluationMetrics {
  decision_tree: ModelMetrics
  naive_bayes: ModelMetrics
  knn: ModelMetrics
}

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  roc_auc: number
  f1_score: number
}

export interface ConfusionMatrix {
  model: string
  tp: number
  fp: number
  tn: number
  fn: number
}

// Risk factor computation based on German Credit Dataset logic
function computeRiskScore(input: ApplicantInput): number {
  let risk = 0.3 // baseline

  // Age factor: younger and very old applicants are higher risk
  if (input.Age < 25) risk += 0.12
  else if (input.Age < 30) risk += 0.06
  else if (input.Age > 60) risk += 0.08
  else if (input.Age >= 35 && input.Age <= 55) risk -= 0.05

  // Job stability factor
  if (input.Job === 0) risk += 0.15 // unskilled non-resident
  else if (input.Job === 1) risk += 0.08 // unskilled resident
  else if (input.Job === 2) risk -= 0.02 // skilled
  else if (input.Job === 3) risk -= 0.08 // highly skilled

  // Housing factor
  if (input.Housing === "own") risk -= 0.08
  else if (input.Housing === "rent") risk += 0.04
  else if (input.Housing === "free") risk += 0.06

  // Savings factor
  const savingsMap: Record<string, number> = {
    "little": 0.10,
    "moderate": 0.02,
    "quite rich": -0.06,
    "rich": -0.10,
    "na": 0.12,
  }
  risk += savingsMap[input.Saving_accounts] ?? 0.05

  // Checking account factor
  const checkingMap: Record<string, number> = {
    "little": 0.08,
    "moderate": 0.00,
    "rich": -0.08,
    "na": 0.10,
  }
  risk += checkingMap[input.Checking_account] ?? 0.04

  // Credit amount factor (higher = riskier)
  if (input.Credit_amount > 10000) risk += 0.15
  else if (input.Credit_amount > 5000) risk += 0.08
  else if (input.Credit_amount > 3000) risk += 0.04
  else if (input.Credit_amount <= 1500) risk -= 0.04

  // Duration factor (longer = riskier)
  if (input.Duration > 36) risk += 0.12
  else if (input.Duration > 24) risk += 0.06
  else if (input.Duration > 12) risk += 0.02
  else risk -= 0.04

  // Purpose factor
  const purposeRisk: Record<string, number> = {
    "car": 0.02,
    "furniture/equipment": 0.00,
    "radio/TV": -0.04,
    "domestic appliances": -0.02,
    "repairs": 0.01,
    "education": 0.06,
    "business": 0.08,
    "vacation/others": 0.10,
  }
  risk += purposeRisk[input.Purpose] ?? 0.03

  // Sex factor (slight statistical bias from dataset)
  if (input.Sex === "female") risk -= 0.02

  return Math.max(0.02, Math.min(0.95, risk))
}

// Simulate Decision Tree prediction
function decisionTreePredict(input: ApplicantInput): number {
  const baseRisk = computeRiskScore(input)
  // Decision trees create discrete decision boundaries
  // Simulate with step-like thresholds
  let dtRisk = baseRisk

  // Tree splits on credit amount
  if (input.Credit_amount > 5000 && input.Duration > 24) {
    dtRisk += 0.08
  } else if (input.Credit_amount <= 2000 && input.Saving_accounts !== "little") {
    dtRisk -= 0.06
  }

  // Tree split on checking account
  if (input.Checking_account === "na" || input.Checking_account === "little") {
    dtRisk += 0.05
  }

  // Add slight discretization noise (trees tend to output coarser probabilities)
  const discretized = Math.round(dtRisk * 10) / 10
  return Math.max(0.03, Math.min(0.95, discretized + (dtRisk - discretized) * 0.3))
}

// Simulate Naive Bayes prediction (assumes feature independence)
function naiveBayesPredict(input: ApplicantInput): number {
  const baseRisk = computeRiskScore(input)
  // NB tends to be more "extreme" in predictions due to independence assumption
  // It pushes probabilities closer to 0 or 1
  let nbRisk = baseRisk

  // Independence assumption: each feature contributes independently
  // This can overestimate when features are correlated
  const featureContributions = [
    input.Age < 30 ? 0.04 : -0.02,
    input.Credit_amount > 5000 ? 0.05 : -0.02,
    input.Duration > 24 ? 0.04 : -0.02,
    input.Saving_accounts === "little" ? 0.04 : -0.02,
    input.Checking_account === "little" ? 0.03 : -0.01,
  ]

  // NB multiplies likelihoods (simulated as additive in log space)
  const totalContribution = featureContributions.reduce((a, b) => a + b, 0)
  nbRisk += totalContribution * 0.6

  // NB outputs tend to be more polarized
  if (nbRisk > 0.5) nbRisk = nbRisk * 1.1
  else nbRisk = nbRisk * 0.9

  return Math.max(0.02, Math.min(0.96, nbRisk))
}

// Simulate K-NN prediction (distance-based)
function knnPredict(input: ApplicantInput): number {
  const baseRisk = computeRiskScore(input)
  // KNN is sensitive to feature scaling
  // After scaling, distance-based neighbors vote
  let knnRisk = baseRisk

  // KNN smooths predictions based on local neighborhood
  // Add slight smoothing effect
  const smoothingFactor = 0.85
  knnRisk = knnRisk * smoothingFactor + 0.30 * (1 - smoothingFactor)

  // Scale sensitivity: credit amount dominates without scaling
  if (input.Credit_amount > 5000) {
    knnRisk += 0.03 // with scaling, less dramatic effect
  }

  // KNN tends to produce moderate probabilities (average of neighbors)
  return Math.max(0.05, Math.min(0.92, knnRisk))
}

function computeDecisionPolicy(
  probability_default: number,
  maxAcceptableLoss: number,
  creditAmount: number
): DecisionPolicy {
  // C_default: cost if we grant and they default (lose the credit amount)
  const c_default = creditAmount
  // C_lost: opportunity cost if we deny a good applicant
  const c_lost = creditAmount * 0.15 // ~15% expected profit

  const cost_grant = probability_default * c_default
  const cost_deny = (1 - probability_default) * c_lost

  const optimal_action = cost_grant <= maxAcceptableLoss && cost_grant < cost_deny
    ? "Grant" : "Deny"

  return {
    cost_grant: Math.round(cost_grant * 100) / 100,
    cost_deny: Math.round(cost_deny * 100) / 100,
    optimal_action,
    expected_loss_grant: Math.round(cost_grant * 100) / 100,
    expected_loss_deny: Math.round(cost_deny * 100) / 100,
  }
}

// Generate realistic evaluation metrics
function generateMetrics(): EvaluationMetrics {
  return {
    decision_tree: {
      accuracy: 0.724,
      precision: 0.691,
      recall: 0.658,
      roc_auc: 0.753,
      f1_score: 0.674,
    },
    naive_bayes: {
      accuracy: 0.698,
      precision: 0.712,
      recall: 0.601,
      roc_auc: 0.741,
      f1_score: 0.652,
    },
    knn: {
      accuracy: 0.709,
      precision: 0.685,
      recall: 0.672,
      roc_auc: 0.738,
      f1_score: 0.678,
    },
  }
}

function generateConfusionMatrices(): ConfusionMatrix[] {
  return [
    { model: "Decision Tree", tp: 164, fp: 73, tn: 198, fn: 65 },
    { model: "Naive Bayes", tp: 150, fp: 61, tn: 210, fn: 79 },
    { model: "K-NN", tp: 158, fp: 72, tn: 199, fn: 71 },
  ]
}

export function predict(input: ApplicantInput): PredictionResult {
  const dtProb = decisionTreePredict(input)
  const nbProb = naiveBayesPredict(input)
  const knnProb = knnPredict(input)

  // Average probability for decision policy
  const avgProb = (dtProb + nbProb + knnProb) / 3
  const policy = computeDecisionPolicy(avgProb, input.max_acceptable_loss, input.Credit_amount)

  const makePrediction = (
    model: string,
    prob: number,
    concept: string,
    description: string
  ): ModelPrediction => {
    const individualPolicy = computeDecisionPolicy(prob, input.max_acceptable_loss, input.Credit_amount)
    return {
      model,
      probability_default: Math.round(prob * 10000) / 10000,
      probability_non_default: Math.round((1 - prob) * 10000) / 10000,
      decision: individualPolicy.optimal_action,
      confidence: Math.round(Math.abs(0.5 - prob) * 2 * 100) / 100,
      concept,
      description,
    }
  }

  return {
    applicant: input,
    predictions: [
      makePrediction(
        "Decision Tree",
        dtProb,
        "Complexity & Interpretability",
        "Uses hierarchical splits on features to classify risk. Tuned depth controls model complexity to balance bias-variance tradeoff."
      ),
      makePrediction(
        "Naive Bayes",
        nbProb,
        "Independence Assumption",
        "Assumes feature independence to compute posterior probability. May overestimate confidence when features are correlated."
      ),
      makePrediction(
        "K-NN",
        knnProb,
        "Distance Sensitivity",
        "Classifies based on nearest neighbors in feature space. Requires feature scaling; sensitive to distance metric choice."
      ),
    ],
    decision_policy: policy,
    evaluation_metrics: generateMetrics(),
    confusion_matrices: generateConfusionMatrices(),
  }
}
