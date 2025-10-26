# GRIPL Deployment Guide

This guide explains how to deploy GRIPL (GDPR Risk Identification in Processes using Large Language Models) on your own infrastructure.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start (Local Development)](#quick-start-local-development)
- [Production Deployment](#production-deployment)
- [Configuration](#configuration)
- [Advanced Deployment Options](#advanced-deployment-options)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying GRIPL, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Git** (for cloning the repository)

For the backend to work properly, you'll also need:
- An **OpenAI API key** or access to an OpenAI-compatible LLM endpoint

## Quick Start (Local Development)

Follow these steps to run GRIPL locally for development or testing:

### 1. Clone the Repository

```bash
git clone https://github.com/MertenD/gripl-master-thesis.git
cd gripl-master-thesis
```

### 2. Configure Environment Variables

Copy the example environment files and configure them:

```bash
# Root configuration
cp .env.example .env

# Backend configuration
cp gripl/gripl-backend/.env.example gripl/gripl-backend/.env
```

Edit `.env` and set your values:

```env
# Database credentials
POSTGRES_USER=gripl
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=gripldb

# PgAdmin credentials
PGADMIN_DEFAULT_EMAIL=admin@gripl.local
PGADMIN_DEFAULT_PASSWORD=your_pgadmin_password

# Application settings (for local development)
DOMAIN=localhost
PROTOCOL=http
```

Edit `gripl/gripl-backend/.env` and configure:

```env
# Required: Add your OpenAI API key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database connection (matches the root .env file)
SPRING_DATASOURCE_URL=jdbc:postgresql://gripl-postgres:5432/gripldb
SPRING_DATASOURCE_USERNAME=gripl
SPRING_DATASOURCE_PASSWORD=your_secure_password_here

# Frontend URL (internal Docker network name)
FRONTEND_BASE_URL=http://gripl-frontend:3000
```

### 3. Start the Application

```bash
docker-compose up -d
```

This will start all services:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PgAdmin** (Database Management): http://localhost:5050

### 4. Access the Application

Open your browser and navigate to:
- **GRIPL Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **PgAdmin**: http://localhost:5050 (use credentials from `.env`)

### 5. Stop the Application

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Production Deployment

For production deployment with automatic SSL certificates and reverse proxy:

### Prerequisites for Production

- A server with a public IP address
- A domain name pointing to your server
- Ports 80 and 443 open for HTTP/HTTPS traffic
- **Traefik** reverse proxy installed (or use the provided configuration)

### Production Setup

1. **Clone and Configure**

   Follow steps 1-2 from the Quick Start guide above.

2. **Update Environment Variables for Production**

   Edit `.env` for your production domain:

   ```env
   DOMAIN=your-domain.com
   PROTOCOL=https
   
   # Use strong passwords in production!
   POSTGRES_PASSWORD=very_secure_random_password
   PGADMIN_DEFAULT_PASSWORD=another_secure_password
   ```

   Edit `gripl/gripl-backend/.env`:

   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   SPRING_DATASOURCE_URL=jdbc:postgresql://gripl-postgres:5432/gripldb
   SPRING_DATASOURCE_USERNAME=gripl
   SPRING_DATASOURCE_PASSWORD=very_secure_random_password
   FRONTEND_BASE_URL=https://your-domain.com
   ```

3. **Set Up Traefik (if not already installed)**

   Create a Traefik configuration to handle SSL certificates:

   ```bash
   # Create Traefik network
   docker network create web
   ```

   You need a running Traefik instance with Let's Encrypt configured. See [Traefik documentation](https://doc.traefik.io/traefik/) for details.

4. **Deploy with Production Configuration**

   ```bash
   docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d
   ```

5. **Access Your Production Deployment**

   - **GRIPL Frontend**: https://your-domain.com
   - **Backend API**: https://your-domain.com/api
   - **PgAdmin**: https://pgadmin.your-domain.com

### Simple Production Deployment (Without Traefik)

If you don't want to use Traefik, you can deploy with the basic configuration and set up your own reverse proxy (nginx, Apache, Caddy, etc.):

```bash
docker-compose up -d
```

Then configure your reverse proxy to forward requests to:
- Frontend: `localhost:3000`
- Backend: `localhost:8080`
- PgAdmin: `localhost:5050`

## Configuration

### Environment Variables Reference

#### Root `.env` File

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `POSTGRES_USER` | PostgreSQL username | `gripl` | Yes |
| `POSTGRES_PASSWORD` | PostgreSQL password | - | Yes |
| `POSTGRES_DB` | PostgreSQL database name | `gripldb` | Yes |
| `PGADMIN_DEFAULT_EMAIL` | PgAdmin login email | `admin@gripl.local` | Yes |
| `PGADMIN_DEFAULT_PASSWORD` | PgAdmin login password | - | Yes |
| `DOMAIN` | Your domain name | `localhost` | Yes |
| `PROTOCOL` | http or https | `http` | Yes |
| `DOCKER_REGISTRY_USERNAME` | Docker Hub username (for custom builds) | - | No |
| `DOCKER_IMAGE_TAG` | Docker image tag to use | `latest` | No |

#### Backend `.env` File

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for LLM analysis | Yes |
| `OPEN_ROUTER_API_KEY` | Alternative LLM provider key | No |
| `SPRING_DATASOURCE_URL` | PostgreSQL connection URL | Yes |
| `SPRING_DATASOURCE_USERNAME` | Database username | Yes |
| `SPRING_DATASOURCE_PASSWORD` | Database password | Yes |
| `FRONTEND_BASE_URL` | Frontend URL for CORS | Yes |

### Custom LLM Configuration

GRIPL supports any OpenAI-compatible LLM endpoint. You can configure this through the backend CLI:

```bash
docker exec -it gripl-backend java -jar /app/app.jar analysis ./path-to-file.bpmn \
  --llm.base-url=http://your-llm-endpoint/v1 \
  --llm.model-name=your-model-name \
  --llm.api-key=your-api-key
```

## Advanced Deployment Options

### Building Custom Docker Images

If you want to build and push your own Docker images:

1. Set up Docker Hub credentials:

   ```bash
   docker login
   ```

2. Configure the `.env` file:

   ```env
   DOCKER_REGISTRY_USERNAME=your-dockerhub-username
   DOCKER_IMAGE_TAG=v1.0.0
   ```

3. Build and push:

   ```bash
   docker-compose build
   docker-compose push
   ```

### Using Pre-built Images

To use pre-built images from Docker Hub instead of building locally, modify your `docker-compose.yaml` to remove the `build` sections and just use the `image` directive.

### GitHub Actions for CI/CD

To set up automated builds when pushing to your repository:

1. Fork this repository to your GitHub account

2. Set up GitHub Secrets in your repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token

3. Update the workflow files in `.github/workflows/`:
   - Replace `mertend` with your Docker Hub username
   - Replace the domain references if needed

4. Push to the `main` branch to trigger automatic builds

### Running Backend CLI Commands

You can run backend commands directly in the container:

```bash
# Analyze a BPMN file
docker exec -it gripl-backend java -jar /app/app.jar analysis /path/to/file.bpmn

# Run evaluation
docker exec -it gripl-backend java -jar /app/app.jar evaluation

# Get help
docker exec -it gripl-backend java -jar /app/app.jar -h
```

### Database Backup and Restore

**Backup:**

```bash
docker exec gripl-postgres pg_dump -U gripl gripldb > backup.sql
```

**Restore:**

```bash
cat backup.sql | docker exec -i gripl-postgres psql -U gripl -d gripldb
```

## Troubleshooting

### Frontend Cannot Connect to Backend

**Problem**: Frontend shows connection errors or API calls fail.

**Solution**:
- Check that `NEXT_PUBLIC_API_BASE_URL` in frontend and `FRONTEND_BASE_URL` in backend match your deployment URLs
- Ensure both services are on the same Docker network
- Check Docker logs: `docker-compose logs gripl-backend`

### Database Connection Errors

**Problem**: Backend fails to connect to PostgreSQL.

**Solution**:
- Verify database credentials match between `.env` and `gripl/gripl-backend/.env`
- Check that the database service name in `SPRING_DATASOURCE_URL` is `gripl-postgres` (not `localhost`)
- Ensure PostgreSQL is running: `docker ps | grep postgres`
- Check PostgreSQL logs: `docker-compose logs gripl-postgres`

### Port Already in Use

**Problem**: Docker fails to start because ports are already in use.

**Solution**:
- Check what's using the port: `sudo lsof -i :3000` (or 8080, 5432, 5050)
- Either stop the conflicting service or change the port mapping in `docker-compose.yaml`
- Example: Change `"3000:3000"` to `"3001:3000"` to use port 3001 instead

### SSL Certificate Issues (Production)

**Problem**: Traefik cannot obtain SSL certificates.

**Solution**:
- Verify your domain's DNS records point to your server
- Ensure ports 80 and 443 are open
- Check Traefik logs: `docker logs traefik`
- Verify Let's Encrypt rate limits haven't been exceeded

### Out of Memory Errors

**Problem**: Services crash with out of memory errors.

**Solution**:
- Increase Docker memory limits in Docker Desktop settings
- For production, ensure your server has at least 4GB RAM
- Consider adding resource limits in `docker-compose.yaml`

### Viewing Logs

To view logs for all services:

```bash
docker-compose logs -f
```

To view logs for a specific service:

```bash
docker-compose logs -f gripl-backend
docker-compose logs -f gripl-frontend
docker-compose logs -f gripl-postgres
```

### Rebuilding After Code Changes

If you've modified the code:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/MertenD/gripl-master-thesis/issues)
- Check the [project documentation](./README.md)
- Review the [backend README](./gripl/gripl-backend/README.md) for CLI usage

## Security Notes

- Always use strong passwords in production
- Never commit `.env` files with real credentials to version control
- Keep your OpenAI API key secure and rotate it regularly
- Use HTTPS in production (via Traefik or another reverse proxy)
- Regularly update Docker images for security patches
- Consider restricting PgAdmin access or removing it in production
