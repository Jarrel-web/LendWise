MODEL_PRESENTATION = {
    "DecisionTree": {
        "model": "Decision Tree",
        "concept": "Complexity & Interpretability",
        "description": "Uses hierarchical splits on features to classify risk. Tuned depth controls model complexity to balance bias-variance tradeoff.",
    },
    "NaiveBayes": {
        "model": "Naive Bayes",
        "concept": "Independence Assumption",
        "description": "Assumes feature independence to compute posterior probability. May overestimate confidence when features are correlated.",
    },
    "KNN": {
        "model": "K-NN",
        "concept": "Distance Sensitivity",
        "description": "Classifies based on nearest neighbors in feature space. Requires feature scaling; sensitive to distance metric choice.",
    },
}

MODEL_ORDER = ("DecisionTree", "NaiveBayes", "KNN")

