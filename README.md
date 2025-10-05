# Acquisitions JSM

A Node.js/Express application for acquisitions management, powered by Neon Database and Drizzle ORM.

## Features

- 🚀 Express.js REST API
- 🗄️ Neon Serverless Postgres database
- 🔄 Drizzle ORM for database operations
- 🔒 JWT authentication with Arcjet security
- 🐳 Full Docker support (development & production)
- 📝 Request logging with Winston and Morgan
- 🛡️ Security best practices with Helmet
- 🔄 Complete CI/CD pipeline with GitHub Actions

## Quick Start

### Prerequisites

- Node.js 20+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- Neon Database account ([sign up here](https://neon.tech))

### Local Development (Without Docker)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.production.example .env
   # Edit .env with your Neon database URL
   ```

3. **Run database migrations:**

   ```bash
   npm run db:migrate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3000`

### Docker Development (With Neon Local)

For a complete Docker-based development environment with **Neon Local** proxy:

1. **Configure Neon credentials:**

   ```bash
   # Create .env file
   cat > .env << EOF
   NEON_API_KEY=your_neon_api_key_here
   NEON_PROJECT_ID=your_neon_project_id_here
   EOF
   ```

2. **Start development environment:**

   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

3. **Access the application:**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/health

For detailed Docker setup instructions, see **[DOCKER.md](./DOCKER.md)**

## Docker Setup

This project includes complete Docker support with separate configurations for development and production:

- **Development**: Uses Neon Local proxy for ephemeral database branches
- **Production**: Connects directly to Neon Cloud database

### Quick Commands

```bash
# Development (with Neon Local)
docker-compose -f docker-compose.dev.yml up --build

# Production
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

📚 **Full documentation**: See [DOCKER.md](./DOCKER.md) for complete setup guide, troubleshooting, and best practices.

## CI/CD Pipeline

This project includes a complete CI/CD pipeline with GitHub Actions:

- 🔍 **Code Quality**: ESLint and Prettier checks on every PR
- 🧪 **Testing**: Automated tests with PostgreSQL and coverage reporting
- 🐳 **Docker**: Multi-platform image builds and automated publishing to Docker Hub

### Workflows

| Workflow            | Triggers                    | Purpose                                          |
| ------------------- | --------------------------- | ------------------------------------------------ |
| **Lint and Format** | Push/PR to `main`/`staging` | Code quality checks with auto-fix suggestions    |
| **Tests**           | Push/PR to `main`/`staging` | Run tests with coverage and database integration |
| **Docker Build**    | Push to `main`              | Build and publish Docker images                  |

📋 **CI/CD Documentation**: See [CI-CD.md](./CI-CD.md) for complete pipeline documentation.

### Quick Setup

1. **Set GitHub Secrets**:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub access token

2. **Push to trigger workflows**:
   ```bash
   git push origin main  # Triggers all workflows
   git push origin staging  # Triggers lint and tests
   ```

## Available Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start development server with hot reload |
| `npm test`             | Run tests with coverage                  |
| `npm run test:watch`   | Run tests in watch mode                  |
| `npm run lint`         | Run ESLint                               |
| `npm run lint:fix`     | Fix ESLint issues automatically          |
| `npm run format`       | Format code with Prettier                |
| `npm run format:check` | Check code formatting                    |
| `npm run db:generate`  | Generate database migrations             |
| `npm run db:migrate`   | Apply database migrations                |
| `npm run db:studio`    | Open Drizzle Studio                      |

## Project Structure

```
acquisitions-jsm/
├── .github/
│   └── workflows/          # CI/CD workflows
│       ├── lint-and-format.yml
│       ├── tests.yml
│       └── docker-build-and-push.yml
├── src/
│   ├── app.js              # Express app configuration
│   ├── app.test.js         # Application tests
│   ├── index.js            # Application entry point
│   ├── server.js           # Server setup
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # Database models (Drizzle)
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── validations/        # Request validators
├── drizzle/                # Database migrations
├── Dockerfile              # Docker image definition
├── docker-compose.dev.yml  # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
├── .env.development        # Development environment vars
├── .env.production.example # Production environment template
├── CI-CD.md               # CI/CD pipeline documentation
└── drizzle.config.js       # Drizzle ORM configuration
```

## API Endpoints

### Health & Status

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api` - API status

### Authentication

- `POST /api/auth/*` - Authentication endpoints

## Environment Variables

### Required Variables

| Variable       | Description                     | Example                                  |
| -------------- | ------------------------------- | ---------------------------------------- |
| `NODE_ENV`     | Environment mode                | `development` or `production`            |
| `PORT`         | Server port                     | `3000`                                   |
| `DATABASE_URL` | Neon database connection string | `postgresql://user:pass@...neon.tech/db` |
| `JWT_SECRET`   | JWT signing secret              | Generated with `openssl rand -base64 32` |

### Optional Variables

| Variable    | Description       | Default |
| ----------- | ----------------- | ------- |
| `LOG_LEVEL` | Logging verbosity | `info`  |

See `.env.production.example` for a complete list.

## Database

This project uses:

- **[Neon](https://neon.tech)**: Serverless Postgres database
- **[Drizzle ORM](https://orm.drizzle.team)**: TypeScript ORM

### Running Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### With Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Production
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

## Testing

The project uses Node.js built-in test runner with coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

Tests are automatically run in CI/CD pipeline with PostgreSQL database integration.

## Security

This application implements multiple security layers:

- **Helmet.js**: Secure HTTP headers
- **CORS**: Cross-origin resource sharing control
- **Arcjet**: Rate limiting and bot protection
- **JWT**: Token-based authentication
- **bcrypt**: Password hashing

## Development

### Code Style

This project uses:

- **ESLint**: Code linting
- **Prettier**: Code formatting

```bash
# Check code style
npm run lint
npm run format:check

# Auto-fix issues
npm run lint:fix
npm run format
```

### Hot Reload

The development server (`npm run dev`) uses Node.js `--watch` flag for automatic restarts on file changes.

## Deployment

### Using Docker

1. **Build production image:**

   ```bash
   docker build -t acquisitions-jsm:latest .
   ```

2. **Configure production environment:**

   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your production values
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Automated Deployment

The CI/CD pipeline automatically builds and pushes Docker images to Docker Hub when code is pushed to the `main` branch.

**Image Tags:**

- `latest` - Latest stable version
- `prod-YYYYMMDD-HHmmss` - Production timestamp tags
- `main-<sha>-YYYYMMDD-HHmmss` - Commit-specific tags

### Platform Deployment

This application can be deployed to:

- **Docker-based platforms**: AWS ECS, Google Cloud Run, Azure Container Instances
- **Platform-as-a-Service**: Heroku, Railway, Render
- **Kubernetes**: Using the provided Dockerfile

Ensure you set the required environment variables in your deployment platform.

## Monitoring

- **Health Endpoint**: `GET /health` returns service status
- **Logs**: Application uses Winston for structured logging
- **Metrics**: HTTP request logging via Morgan
- **CI/CD**: GitHub Actions workflows provide build and deployment monitoring

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure all tests pass (`npm test`)
5. Ensure code quality passes (`npm run lint && npm run format:check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

The CI/CD pipeline will automatically run code quality checks and tests on your PR.

## License

ISC

## Support

- [GitHub Issues](https://github.com/SajMohammed/acquisitions-jsm/issues)
- [Neon Documentation](https://neon.tech/docs)
- [Docker Documentation](./DOCKER.md)
- [CI/CD Documentation](./CI-CD.md)

## Acknowledgments

- Built with [Express.js](https://expressjs.com/)
- Database by [Neon](https://neon.tech)
- ORM by [Drizzle](https://orm.drizzle.team)
- Security by [Arcjet](https://arcjet.com)
- CI/CD by [GitHub Actions](https://github.com/features/actions)
