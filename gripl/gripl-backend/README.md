# GRIPL Backend

The **GRIPL Backend** is a Spring Boot application that provides a REST API for analyzing BPMN files and evaluating labeled datasets of processes. It also includes full CRUD endpoints for managing the test dataset. While it is designed to work seamlessly with the GRIPL frontend, it can also be used independently via a command-line interface (CLI).

## Prerequisites

Before running the GRIPL Backend, ensure that you have a **PostgreSQL** database instance up and running. The application requires PostgreSQL, which you can set up via Docker or install directly on your system.

Next, copy the `.env.example` file to `.env` and configure all required environment variables, such as database connection details and (optionally) an OpenAI API key for process analysis. The `.env` file is used to configure the backend.

## Running Locally with Maven

You can run the backend locally using **Maven**. Make sure Maven is installed on your system.

There are several ways to run the backend locally:

1. **Run as the backend for the GRIPL frontend:**

   ```bash
   mvn spring-boot:run
   ```

2. **Run CLI commands without starting the frontend:**
   The application will shut down automatically after executing the command.

   ```bash
   mvn spring-boot:run -Dspring-boot.run.arguments="analysis ./path-to-bpmn-file.bpmn --output json"
   mvn spring-boot:run -Dspring-boot.run.arguments="evaluation"
   ```

3. **Run with interactive shell for executing commands while running:**

   ```bash
   mvn spring-boot:run -Dspring-boot.run.arguments="--app.shell.enabled=true"
   ```
   
### Optional – Customising the LLM endpoint

The backend can talk to any OpenAI‑compatible LLM.

If you want to point the analysis command at a private or self‑hosted model, simply add two extra CLI flags:

| Flag	           | Meaning                                                      | Example value                  |
|-----------------|--------------------------------------------------------------|--------------------------------|
| `--llm.base-url` | The base URL of the LLM API (must include /v1 in most cases) | `http://127.0.0.1:1234/v1`     |
| `--llm.model-name` | The name/id of the model to use | `deepseek-r1-distill-llama-8b` |
| `--llm.api-key` | The API key for the LLM (if required) | `sk-...`                       |
| `--llm.timeout-seconds` | The timeout for LLM requests in seconds (default: 30) | `240` (4 Minutes)              |

Usage example

```bash
# Run a single analysis and write JSON to stdout,
# while pointing the LLM at a private endpoint.
mvn spring-boot:run \
-Dspring-boot.run.arguments="analysis ./test-diagram.bpmn -o json \
--llm.base-url=http://127.0.0.1:1234/v1 \
--llm.model-name=deepseek-r1-distill-llama-8b"
```

The two flags are optional – if omitted, the backend falls back to the default openai model.

## Running with Docker

You can also run the backend in a containerized environment using Docker. Ensure Docker is installed on your system.

1. **Build the Docker image:**

   ```bash
   docker build -t gripl-backend .
   ```

2. **Run the Docker container** (ensure the `.env` path is correct):

   ```bash
   docker run -d --name gripl-backend -p 8080:8080 --env-file .env gripl-backend
   ```

## Available CLI Commands

The backend provides several CLI commands for BPMN analysis and dataset evaluation:

* `analysis <bpmn-file>` — Analyzes the specified BPMN file.

   * Optional: `--outputFormat` (Available: `json`, `pretty` *(default)*)
* `evaluation` — Evaluates BPMN processes stored in the database.

   * Optional: `--outputFormat` (Available: `json`, `pretty` *(default)*)
* `-h` — Displays help for commands and options.

> **Tip:** Use `-h` with any command (e.g., `analysis -h`) for detailed command-specific help.

## API Documentation

The backend provides a Swagger/OpenAPI interface for exploring and testing the REST API.

When running locally, access the API documentation at:

```
http://localhost:8080/api-docs
```

Or if you're accessing through the frontend:

```
http://localhost:3000/api-docs
```

For production deployments, the API documentation will be available at your configured domain.
