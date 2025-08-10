# GRIPL Backend

The GRIPL backend is a Spring Boot application that provides an API for analyzing BPMN files and evaluating a labeled Dataset of processes. It also provides all necessary CRUD endpoints for viewing and manipulating the test dataset. It is designed to work with the GRIPL frontend, but can also be used independently via the command line interface (CLI).

## Prerequisites

Before you can run the GRIPL backend, make sure to have a fresh PostgreSQL database running. The backend uses PostgreSQL as its database, so you need to have an instance running and accessible. You can use Docker to run a PostgreSQL instance or install it directly on your system.

After that you need to copy the `.env.example` file to `.env` and fill out all necessary environment variables like the database connection params or an openai api key if you want to use the OpenAI API for process analysis. The `.env` file is used to configure the backend application.

## Local usage with maven

To run the backend locally, you can use Maven. Make sure you have Maven installed on your system.
There a multiple ways to use the backend locally:

1. Run it 'normally' as the backend for the GRIPL frontend:
   ```bash
   mvn spring-boot:run
   ```

2. Run any of the [following commands](#available-commands) to analyze bpmn files or start the evaluation without the frontend only using the cli (The app will shutdown after the command is executed):
    ```bash
    mvn spring-boot:run -Dspring-boot.run.arguments="analysis ./path-to-bpmn-file.bpmn --output json"
    mvn spring-boot:run -Dspring-boot.run.arguments="evaluation"
    ```

3. Run the springboot application and activate an interactive shell to execute commands while the application is running:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.arguments="--app.shell.enabled=true"
   ```
   
## Running the Backend with Docker

You can also run the GRIPL backend using Docker. This is useful if you want to run the backend in a containerized environment. Make sure you have Docker installed on your system.

To run the backend with Docker, follow these steps:

1. Build the Docker image:
   ```bash
   docker build -t gripl-backend .
   ```
   
2. Run the Docker container (Make sure that the path to the `.env` file is correct):
   ```bash
    docker run -d --name gripl-backend -p 8080:8080 --env-file .env gripl-backend
    ```
   
## Available Commands

The backend provides several commands that can be used to analyze BPMN files or start the evaluation process. Here are the available commands:

- `analysis <bpmn-file>`: Analyzes the given BPMN file. You can specify the optional output format using the `--output` option (Available formats: `json`, `pretty` (default)).
- `evaluation`: Starts the evaluation process. This command can be used to evaluate the BPMN processes that are stored in the database. You can specify the optional output format using the `--output` option (Available formats: `json`, `pretty` (default)).
- `-h`: Displays the help message with available commands and options.

>Hint: You can use `-h` with any command (like `analysis -h`) to get more information about the specific command and its options.

## API Documentation

There is an API Swagger documentation available for the GRIPL backend. You can access it at the following URL: [https://gripl.mertendieckmann.de/api-docs](https://gripl.mertendieckmann.de/api-docs). This documentation provides detailed information about the available endpoints, request and response formats, and other relevant details. 

Note that this documentation is only up-to-date to the latest deployment of the main branch of the GRIPL backend. 

If you need a more up-to-date version you need to run the backend locally as well as the frontend to access the API documentation. Then you can access the API documentation at `http://localhost:3000/api-docs`.

