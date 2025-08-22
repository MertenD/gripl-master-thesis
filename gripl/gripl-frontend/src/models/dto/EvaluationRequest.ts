export interface EvaluationRequest {
    evaluationEndpoint: string;
    llmProps: LlmProps | null;
    maxConcurrent: number | null;
}

export interface LlmProps {
    baseUrl?: string | null;
    modelName?: string | null;
    apiKey?: string | null;
    timeoutSeconds?: number | null;
}