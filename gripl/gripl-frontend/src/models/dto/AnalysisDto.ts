export interface AnalysisRequest {
    bpmnXml: String
}

export interface AnalysisResponse {
    relevantElements: AnalysisResponseElement[];
}

export interface AnalysisResponseElement {
    id: string;
    reason: string;
}