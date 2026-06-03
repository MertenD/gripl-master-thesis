interface LlmApiKeyPlaceholderDatalistProps {
    id: string
}

export default function LlmApiKeyPlaceholderDatalist({ id }: LlmApiKeyPlaceholderDatalistProps) {

    return <datalist id={id}>
        <option value="${OPEN_ROUTER_API_KEY}"/>
    </datalist>
}