# GRIPL - GDPR Risk Identification in Processes using Large Language Models

A web application for identifying GDPR-critical tasks in business processes using Large Language Models.

## 🚀 Quick Start

Get GRIPL up and running in minutes:

```bash
# Clone the repository
git clone https://github.com/MertenD/gripl-master-thesis.git
cd gripl-master-thesis

# Set up environment variables
cp .env.example .env
cp gripl/gripl-backend/.env.example gripl/gripl-backend/.env

# Edit the .env files and add your configuration
# At minimum, set your OpenAI API key in gripl/gripl-backend/.env

# Start the application
docker-compose up -d
```

Access the application at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8080
- **PgAdmin**: http://localhost:5050

📖 **For detailed setup instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 📋 Overview

GRIPL analyzes BPMN (Business Process Model and Notation) diagrams to identify activities that may involve GDPR-relevant data processing. It uses Large Language Models to understand the semantic context of process tasks and classify them according to GDPR data processing categories.

### Key Features

- 🔍 **Automated GDPR Analysis**: Upload BPMN files and get instant analysis of GDPR-critical activities
- 🤖 **LLM-Powered**: Uses OpenAI or compatible LLM providers for intelligent task classification
- 📊 **Visual Feedback**: Interactive BPMN diagram viewer with highlighted GDPR-relevant tasks
- 🗄️ **Test Dataset Management**: Built-in dataset for evaluation and testing
- 🔧 **CLI & Web Interface**: Use via web frontend or command-line interface
- 🐳 **Docker-Ready**: Easy deployment with Docker Compose

## 🏗️ Architecture

GRIPL consists of three main components:

- **Frontend** (Next.js/React): Web interface for uploading and analyzing BPMN files
- **Backend** (Spring Boot): REST API and CLI for BPMN analysis and dataset management
- **Database** (PostgreSQL): Storage for test datasets and analysis results

## 📚 Documentation

- [**Deployment Guide**](./DEPLOYMENT.md) - Complete deployment instructions
- [**Backend Documentation**](./gripl/gripl-backend/README.md) - API and CLI usage
- [**Frontend Documentation**](./gripl/gripl-frontend/README.md) - Frontend development

## 🛠️ Development

### Prerequisites

- Node.js 18+ (for frontend)
- Java 17+ and Maven (for backend)
- PostgreSQL 15+ (for database)
- Docker and Docker Compose (recommended)

### Local Development Setup

**Backend:**
```bash
cd gripl/gripl-backend
cp .env.example .env
# Edit .env and configure database and API keys
mvn spring-boot:run
```

**Frontend:**
```bash
cd gripl/gripl-frontend
npm install
npm run dev
```

For more details, see the README files in each component directory.

## 🔑 Configuration

GRIPL requires minimal configuration to get started. The main requirements are:

1. **Database credentials** (PostgreSQL)
2. **OpenAI API key** (or compatible LLM endpoint)
3. **Domain configuration** (for production deployments)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete configuration reference.

## 🧪 Master Thesis

This repository contains the implementation developed as part of a master's thesis on "Identifying GDPR-Critical Tasks in Business Processes using Large Language Models".

The thesis documentation and experiments can be found in the `thesis/` and `experiments/` directories.

## 📄 License

This project is part of academic research. Please refer to the repository owner for licensing information.

## 🤝 Contributing

This project is part of academic research. If you'd like to contribute or use this work, please open an issue to discuss your ideas.

## 📧 Contact

For questions or issues, please open an issue on GitHub.
