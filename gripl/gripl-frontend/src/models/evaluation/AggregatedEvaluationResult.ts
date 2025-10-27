export interface AggregatedEvaluationResult {
    avgPrecision: number
    stdPrecision: number
    avgRecall: number
    stdRecall: number
    avgF1Score: number
    stdF1Score: number
    avgAccuracy: number
    stdAccuracy: number
    avgPassed: number
    stdPassed: number
    avgFailed: number
    stdFailed: number
    avgErrors: number
    stdErrors: number
    avgTruePositives: number
    stdTruePositives: number
    avgFalsePositives: number
    stdFalsePositives: number
    avgFalseNegatives: number
    stdFalseNegatives: number
    avgTrueNegatives: number
    stdTrueNegatives: number
    avgAmountOfRetries: number | undefined
    stdAmountOfRetries: number | undefined
}

export type AggregatedEvaluationResults = Record<string, AggregatedEvaluationResult>;