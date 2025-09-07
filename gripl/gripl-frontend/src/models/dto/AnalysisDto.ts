export interface AnalysisRequest {
    bpmnXml: String
}

export interface AnalysisResponse {
    criticalElements: CriticalElement[];
}

export interface CriticalElement {
    id: string;
    name: string;
    reason: string;
}