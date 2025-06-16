export interface EvaluationData {
    id: number,
    bpmnXml: string,
    expectedValues: ExpectedValues[]
}

export interface ExpectedValues {
    value: string
}