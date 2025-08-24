export interface EvaluationData {
    id: number,
    name: string,
    bpmnXml: string,
    expectedValues: ExpectedValues[],
    datasetId: number
}

export interface ExpectedValues {
    value: string
    reason?: string
}

export interface EvaluationDataMeta {
    id: number,
    name?: string,
    datasetId?: number
}