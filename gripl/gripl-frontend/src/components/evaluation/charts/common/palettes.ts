export const defaultColors = {
    passed: "#16a34a",
    failed: "#ef4444",
    error: "#f59e0b",
    truePositive: "#16a34a",
    falsePositive: "#ef4444",
    falseNegative: "#f59e0b",
    trueNegative: "#0ea5e9",
    accuracy: "#2563eb",
    precision: "#8b5cf6",
    recall: "#f59e0b",
    f1Score: "#22c55e",
};

export const modelPalette = [
    "#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6",
    "#06b6d4", "#a855f7", "#f43f5e", "#22c55e", "#eab308",
];

export const mergeEvalColors = (getEvaluationColors?: () => any) => {
    try {
        const custom = getEvaluationColors?.();
        return { ...defaultColors, ...(custom ?? {}) };
    } catch {
        return defaultColors;
    }
};
