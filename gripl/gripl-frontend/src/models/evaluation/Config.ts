export type EndpointChoice = "default" | "preset" | "custom";

export interface AnalysisEndpoint {
    endpoint: string;
    name: string;
}

export interface ModelRowState {
    id: string;
    label: string;
    endpointChoice: EndpointChoice;
    selectedPresetEndpoint: string;
    customEndpoint: string;
    baseUrl: string | null;
    modelName: string | null;
    apiKey: string | null;
    timeoutSeconds: number | null;
    temperature: number | null;
    topP: number | null;
}