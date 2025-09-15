
export interface MultiEvaluationRequest {
    models: ModelRunConfig[];
    datasets: number[];
    defaultEvaluationEndpoint: string;
    seed?: string;
    maxConcurrent: number | null;
}

export interface ModelRunConfig {
    label: string;
    evaluationEndpoint?: string | null;
    llmProps?: LlmPropsOverride | null;
}

export interface LlmPropsOverride {
    baseUrl?: string | null;
    modelName?: string | null;
    apiKey?: string | null;
    timeoutSeconds?: number | null;
}