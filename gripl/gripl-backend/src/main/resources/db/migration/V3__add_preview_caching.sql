CREATE TABLE preview_cache (
    id SERIAL PRIMARY KEY,
    evaluation_data_id INTEGER NOT NULL REFERENCES evaluation_data(id) ON DELETE CASCADE,
    url_cache_key TEXT NOT NULL UNIQUE,
    svg TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION delete_preview_cache_on_update()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM preview_cache WHERE evaluation_data_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_preview_cache_trigger
AFTER UPDATE ON evaluation_data
FOR EACH ROW
EXECUTE FUNCTION delete_preview_cache_on_update();