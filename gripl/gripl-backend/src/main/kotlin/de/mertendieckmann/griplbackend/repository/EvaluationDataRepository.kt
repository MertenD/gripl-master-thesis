package de.mertendieckmann.griplbackend.repository

import de.mertendieckmann.griplbackend.model.dto.EvaluationData
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.stereotype.Repository

@Repository
class EvaluationDataRepository(
    private val jdbc: JdbcTemplate
) {

    private val mapper = RowMapper { rs, _ ->
        EvaluationData.fromRow(
            id = rs.getLong("id"),
            bpmnXml = rs.getString("bpmn_xml"),
            expectedJson = rs.getString("expected_json")
        )
    }

    fun getAllEvaluationData(): List<EvaluationData> {
        return jdbc.query("SELECT * FROM evaluation_data", mapper)
    }

    fun getEvaluationDataById(id: Long): EvaluationData? {
        return jdbc.queryForObject("SELECT * FROM evaluation_data WHERE id = ?", mapper, id)
    }

    fun insertEvaluationData(data: EvaluationData): Int {
        return jdbc.update(
            "INSERT INTO evaluation_data (bpmn_xml, expected_values) VALUES (?, ?)",
            data.bpmnXml, data.expectedValues
        )
    }
}