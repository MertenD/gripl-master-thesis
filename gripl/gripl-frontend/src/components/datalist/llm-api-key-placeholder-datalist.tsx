interface LlmApiKeyPlaceholderDatalistProps {
    id: string
}

export default function LlmApiKeyPlaceholderDatalist({ id }: LlmApiKeyPlaceholderDatalistProps) {

    return <datalist id={id}>
        <option value="${OPENAI_API_KEY}"/>
        <option value="${OPEN_ROUTER_API_KEY}"/>
    </datalist>
}