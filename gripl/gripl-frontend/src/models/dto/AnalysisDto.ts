export interface AnalysisRequest {
    bpmnXml: String
}

export interface AnalysisResponse {
    activityElementIds: string[]
}