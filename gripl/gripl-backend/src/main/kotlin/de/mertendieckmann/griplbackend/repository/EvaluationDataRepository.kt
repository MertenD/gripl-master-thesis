package de.mertendieckmann.griplbackend.repository

import com.fasterxml.jackson.databind.ObjectMapper
import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import de.mertendieckmann.griplbackend.model.dto.EvaluationDataWithOptionalId
import org.postgresql.util.PGobject
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository

@Repository
class EvaluationDataRepository(
    private val jdbc: JdbcTemplate,
    private val objectMapper: ObjectMapper
) {

    private val mapper = RowMapper { rs, _ ->
        EvaluationData.fromRow(
            id = rs.getLong("id"),
            name = rs.getString("name"),
            bpmnXml = rs.getString("bpmn_xml"),
            expectedJson = rs.getString("expected_values")
        )
    }

    fun getAllEvaluationData(): List<EvaluationData> {
        return jdbc.query("SELECT * FROM evaluation_data", mapper)
    }

    fun getEvaluationDataById(id: Long): EvaluationData? {
        return jdbc.query("SELECT * FROM evaluation_data WHERE id = ?", mapper, id).firstOrNull()
    }

    fun insertEvaluationData(data: EvaluationDataWithOptionalId): Int? {
        val sql = """
            INSERT INTO evaluation_data (name, bpmn_xml, expected_values)
            VALUES (?, ?, ?::jsonb)
            RETURNING id
        """.trimIndent()

        val json  = objectMapper.writeValueAsString(data.expectedValues)
        val value = PGobject().apply { type = "jsonb"; this.value = json }

        return jdbc.queryForObject(
            sql,
            Int::class.java,
            data.name,
            data.bpmnXml,
            value
        )!!
    }

    fun updateEvaluationData(data: EvaluationData): Int {
        val sql = """
            UPDATE evaluation_data
            SET name = ?, bpmn_xml = ?, expected_values = ?::jsonb
            WHERE id = ?
        """.trimIndent()

        return jdbc.update(sql) { ps ->
            ps.setString(1, data.name)
            ps.setString(2, data.bpmnXml)

            val json     = objectMapper.writeValueAsString(data.expectedValues)
            val pgObject = PGobject().apply {
                type  = "jsonb"
                value = json
            }
            ps.setObject(3, pgObject)
            ps.setLong(4, data.id)
        }
    }

    fun deleteEvaluationData(id: Long): Int {
        val sql = "DELETE FROM evaluation_data WHERE id = ?"
        return jdbc.update(sql, id)
    }
}