CREATE TABLE evaluation_data (
    id SERIAL PRIMARY KEY,
    bpmn_xml TEXT NOT NULL,
    expected_values JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)