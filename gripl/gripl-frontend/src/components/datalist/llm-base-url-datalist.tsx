interface LlmBaseUrlDatalistProps {
    id: string
}

export default function LlmBaseUrlDatalist({ id }: LlmBaseUrlDatalistProps) {

    return <datalist id={id}>
        <option value="https://api.openai.com/v1"/>
        <option value="https://openrouter.ai/api/v1"/>
        <option value="http://localhost:1234/v1"/>
    </datalist>
}