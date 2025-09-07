interface LlmModelNameDatalistProps {
    id: string
}

export default function LlmModelNameDatalist({ id }: LlmModelNameDatalistProps) {

    return <datalist id={id}>
        <option value="deepseek/deepseek-chat-v3.1"/>
        <option value="openai/chatgpt-4o-latest"/>
        <option value="openai/gpt-3.5-turbo-16k"/>
        <option value="openai/gpt-oss-120b"/>
        <option value="openai/gpt-oss-20b"/>
    </datalist>
}