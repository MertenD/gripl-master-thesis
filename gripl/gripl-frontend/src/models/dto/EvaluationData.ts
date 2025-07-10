export interface EvaluationData {
    id: number,
    name: string,
    bpmnXml: string,
    expectedValues: ExpectedValues[]
}

export interface ExpectedValues {
    value: string
    reason?: string
}

export interface EvaluationDataMeta {
    id: number,
    name?: string
}