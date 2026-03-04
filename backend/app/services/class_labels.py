DEFAULT_LABEL_TOKENS = ("bad", "default", "1", "true", "yes")


def extract_classes(model):
    classes = getattr(model, "classes_", None)
    if classes is not None:
        return [str(c).lower() for c in classes]

    named_steps = getattr(model, "named_steps", None)
    if named_steps and "classifier" in named_steps:
        classifier = named_steps["classifier"]
        clf_classes = getattr(classifier, "classes_", None)
        if clf_classes is not None:
            return [str(c).lower() for c in clf_classes]

    return None


def default_class_index(model, proba_width):
    classes = extract_classes(model)

    if classes:
        for label in DEFAULT_LABEL_TOKENS:
            if label in classes:
                return classes.index(label)

        if "good" in classes and "bad" not in classes:
            return 1 - classes.index("good") if len(classes) == 2 else 0

    if proba_width > 1:
        return 1
    return 0

