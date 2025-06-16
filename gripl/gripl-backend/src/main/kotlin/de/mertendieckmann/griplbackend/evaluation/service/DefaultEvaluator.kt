package de.mertendieckmann.griplbackend.evaluation.service

import de.mertendieckmann.griplbackend.application.BpmnAnalyzer
import de.mertendieckmann.griplbackend.model.ExpectedResult
import dev.langchain4j.model.chat.ChatModel
import org.springframework.stereotype.Service

@Service
class DefaultEvaluator(
    private val llm: ChatModel
): Evaluator {
    override fun evaluate(input: String): List<ExpectedResult> {
        val analyzer = BpmnAnalyzer(llm = llm)
        val analysisResult = analyzer.analyzeBpmnForGdpr(input)
        return analysisResult.elements.map { ExpectedResult(value = it.id) }
    }
}