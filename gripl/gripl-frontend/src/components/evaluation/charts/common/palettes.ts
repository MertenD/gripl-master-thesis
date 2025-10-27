export const defaultColors = {
    passed: "#22c55e",
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
    "#3b82f6",
    "#ef4444",
    "#fb923c",
    "#22c55e",
    "#a855f7",
    "#eab308",
    "#14b8a6",
    "#ec4899",
    "#8b5cf6",
    "#f97316",
];

export const mergeEvalColors = (getEvaluationColors?: () => any) => {
    try {
        const custom = getEvaluationColors?.();
        return { ...defaultColors, ...(custom ?? {}) };
    } catch {
        return defaultColors;
    }
};
