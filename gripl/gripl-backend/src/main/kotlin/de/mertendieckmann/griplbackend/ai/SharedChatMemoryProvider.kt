package de.mertendieckmann.griplbackend.ai

import dev.langchain4j.memory.ChatMemory
import dev.langchain4j.memory.chat.ChatMemoryProvider

class SharedChatMemoryProvider(
    private val maxMessages: Int = 50
) : ChatMemoryProvider {
    private val memories = java.util.concurrent.ConcurrentHashMap<Any, ChatMemory>()
    override fun get(memoryId: Any) =
        memories.computeIfAbsent(memoryId) {
            dev.langchain4j.memory.chat.MessageWindowChatMemory.withMaxMessages(maxMessages)
        }
}