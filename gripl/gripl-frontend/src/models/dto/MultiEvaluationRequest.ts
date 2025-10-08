
export interface MultiEvaluationRequest {
    models: ModelRunConfig[];
    datasets: number[];
    defaultEvaluationEndpoint: string;
    seed?: number;
    maxConcurrent: number | null;
    repetitions?: number;
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