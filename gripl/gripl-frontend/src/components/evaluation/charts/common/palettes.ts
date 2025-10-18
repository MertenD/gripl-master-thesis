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
    "#2563eb", // blue (aus accuracy)
    "#f97316", // orange (NEU) – klarer Abstand zu amber
    "#ef4444", // red (aus failed/falsePositive)
    "#8b5cf6", // violet (aus precision)
    "#16a34a", // green (aus passed/truePositive)
    "#64748b", // slate (NEU) – kühles Grau-Blau, neutral
    "#84cc16", // lime (NEU) – deutlich gelb-grün
    "#d946ef", // fuchsia (NEU) – magenta
    "#8b4513", // brown (NEU) – warm, weit weg von blau/grün
    "#0ea5e9", // sky (aus trueNegative)
    "#7c3aed", // violet-700 (NEU) – dunkler als precision
    "#f59e0b", // amber (aus error/recall)
    "#e11d48", // rose-600 (NEU) – fern zu rot platziert
    "#14b8a6", // teal-500 (NEU) – grünlich, nicht cyan
    "#22c55e", // green-light (aus f1Score)
];

export const mergeEvalColors = (getEvaluationColors?: () => any) => {
    try {
        const custom = getEvaluationColors?.();
        return { ...defaultColors, ...(custom ?? {}) };
    } catch {
        return defaultColors;
    }
};
