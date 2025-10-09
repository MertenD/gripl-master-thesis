package de.mertendieckmann.griplbackend

import de.mertendieckmann.griplbackend.evaluation.EvaluationRunner
import de.mertendieckmann.griplbackend.evaluation.MultiEvaluationRunner
import de.mertendieckmann.griplbackend.repository.DatasetRepository
import de.mertendieckmann.griplbackend.repository.EvaluationDataRepository
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import java.lang.reflect.Method

class MultiEvaluationRunnerSeedTest {

    private val runner = MultiEvaluationRunner(
        singleRunner = mock(EvaluationRunner::class.java),
        datasetRepository = mock(DatasetRepository::class.java),
        evaluationDataRepository = mock(EvaluationDataRepository::class.java)
    )

    private val deriveRunSeedMethod: Method =
        MultiEvaluationRunner::class.java.getDeclaredMethod(
            "deriveRunSeed",
            Int::class.javaPrimitiveType,
            Int::class.javaPrimitiveType
        ).apply { isAccessible = true }

    private fun derive(baseSeed: Int, runNumber: Int): Int =
        deriveRunSeedMethod.invoke(runner, baseSeed, runNumber) as Int

    @Test
    fun `deterministic and regression-safe`() {
        val s1 = derive(123456789, 1)
        val s1b = derive(123456789, 1)
        assertEquals(467_791_587, s1)
        assertEquals(s1, s1b)
    }

    @Test
    fun `different runNumbers yield different seeds for same baseSeed`() {
        val s1 = derive(123456789, 1)
        val s2 = derive(123456789, 2)
        val s100 = derive(123456789, 100)

        assertEquals(395_918_962, s2)
        assertEquals(1_945_655_733, s100)

        assertAll(
            { assertNotEquals(s1, s2) },
            { assertNotEquals(s1, s100) },
            { assertNotEquals(s2, s100) }
        )
    }

    @Test
    fun `seed is always within 1 to Int_MAX_VALUE`() {
        val cases = listOf(
            123456789 to 1,
            0 to 1,
            0 to 0,
            -1 to 1,
            Int.MAX_VALUE to Int.MAX_VALUE
        )
        val expected = listOf(467_791_587, 1_294_361_109, 794_128_629, 401_395_754, 1_927_389_740)

        cases.zip(expected).forEach { (input, exp) ->
            val (base, run) = input
            val seed = derive(base, run)
            assertTrue(seed in 1..Int.MAX_VALUE, "out of range for base=$base run=$run: $seed")
            assertEquals(exp, seed)
        }
    }
}
