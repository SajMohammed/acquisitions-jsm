# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) setup for the **acquisitions-jsm** project using GitHub Actions.

## Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
- [Setup Requirements](#setup-requirements)
- [Workflow Details](#workflow-details)
- [Security Configuration](#security-configuration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

The CI/CD pipeline consists of three main workflows:

1. **Lint and Format** - Code quality checks
2. **Tests** - Automated testing with coverage
3. **Docker Build and Push** - Container image building and publishing

### Pipeline Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Code Quality   │    │     Testing     │    │  Docker Build   │
│   (lint-and-    │    │    (tests.yml)  │    │  (docker-build- │
│   format.yml)   │    │                 │    │  and-push.yml)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────┐              ┌─────────┐          ┌─────────────┐
    │ ESLint  │              │Node.js  │          │Multi-platform│
    │Prettier │              │Tests    │          │Docker Images │
    └─────────┘              │Coverage │          └─────────────┘
                             └─────────┘
```

---

## Workflows

### 1. Lint and Format (`lint-and-format.yml`)

**Triggers:**
- Push to `main` or `staging` branches
- Pull requests to `main` or `staging` branches

**Features:**
- ✅ ESLint code quality checks
- ✅ Prettier formatting validation
- ✅ Automatic fix suggestions
- ✅ PR comments with remediation steps
- ✅ Detailed GitHub step summaries
- ✅ Workflow annotations for issues

### 2. Tests (`tests.yml`)

**Triggers:**
- Push to `main` or `staging` branches  
- Pull requests to `main` or `staging` branches

**Features:**
- ✅ Node.js 20.x with caching
- ✅ PostgreSQL 16 test database
- ✅ Test coverage reporting
- ✅ Artifact uploads (30-day retention)
- ✅ Test failure annotations
- ✅ PR comments for failures
- ✅ Comprehensive summaries

### 3. Docker Build and Push (`docker-build-and-push.yml`)

**Triggers:**
- Push to `main` branch
- Manual trigger (`workflow_dispatch`)

**Features:**
- ✅ Multi-platform builds (amd64, arm64)
- ✅ Docker Hub publishing
- ✅ Automatic tagging with timestamps
- ✅ Build caching for efficiency
- ✅ Deployment issue creation
- ✅ Rich metadata and labels

---

## Setup Requirements

### Required Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKER_USERNAME` | Docker Hub username | `sajmohammed` |
| `DOCKER_PASSWORD` | Docker Hub password or token | `dckr_pat_xxxxx` |

### Optional Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `IMAGE_NAME` | `acquisitions-jsm` | Docker image name |
| `REGISTRY` | `docker.io` | Container registry |

---

## Workflow Details

### Lint and Format Workflow

```yaml
name: Lint and Format
on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]
```

**Process:**
1. Checkout code
2. Setup Node.js 20.x with npm caching
3. Install dependencies with `npm ci`
4. Run ESLint checks (`npm run lint`)
5. Run Prettier checks (`npm run format:check`)
6. Create annotations for any issues found
7. Add PR comments with fix suggestions
8. Generate detailed step summary
9. Fail if issues are detected

**Fix Commands Suggested:**
```bash
# Fix linting issues
npm run lint:fix

# Fix formatting issues  
npm run format

# Fix both at once
npm run lint:fix && npm run format
```

### Tests Workflow

```yaml
name: Tests
on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main, staging]
```

**Environment Variables:**
- `NODE_ENV=test`
- `NODE_OPTIONS=--experimental-vm-modules`
- `DATABASE_URL=postgresql://test_user:test_password@localhost:5432/acquisitions_test`
- `JWT_SECRET=test_jwt_secret_for_ci_testing_only`
- `LOG_LEVEL=error`

**Services:**
- **PostgreSQL 16**: Test database with health checks

**Process:**
1. Checkout code
2. Setup Node.js 20.x with npm caching
3. Start PostgreSQL service
4. Install dependencies with `npm ci`
5. Wait for database to be ready
6. Run database migrations
7. Execute tests with coverage
8. Upload coverage reports as artifacts
9. Create annotations for test failures
10. Add PR comments for failures
11. Generate comprehensive summary

**Test Command:**
```bash
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules node --test src/**/*.test.js --reporter=spec --experimental-test-coverage
```

### Docker Build and Push Workflow

```yaml
name: Docker Build and Push
on:
  push:
    branches: [main]
  workflow_dispatch:
```

**Image Tags Generated:**
- `latest` (for main branch)
- `main` (branch name)
- `main-abc1234-20241005-143022` (branch-sha-timestamp)
- `prod-20241005-143022` (production timestamp)

**Labels Added:**
- `org.opencontainers.image.title`
- `org.opencontainers.image.description`
- `org.opencontainers.image.source`
- `org.opencontainers.image.version`
- `org.opencontainers.image.created`
- `org.opencontainers.image.revision`
- `org.opencontainers.image.licenses`

**Process:**
1. Checkout code
2. Setup Docker Buildx for multi-platform builds
3. Login to Docker Hub
4. Extract metadata and generate tags
5. Build and push images for `linux/amd64` and `linux/arm64`
6. Generate build summary with deployment commands
7. Create deployment issue with instructions
8. Handle failures with detailed error messages

---

## Security Configuration

### Secret Management

**Docker Hub Access:**
- Use Docker Hub Access Tokens instead of passwords
- Limit token scope to specific repositories
- Regularly rotate tokens

**GitHub Secrets:**
```bash
# Set up Docker Hub secrets
gh secret set DOCKER_USERNAME --body "your_dockerhub_username"
gh secret set DOCKER_PASSWORD --body "dckr_pat_your_access_token"
```

### Container Security

- **Non-root user**: Dockerfile runs as user `expressjs` (UID 1001)
- **Read-only filesystem**: Containers use read-only root filesystem where possible
- **Security labels**: Images include security metadata
- **Minimal base**: Uses Alpine Linux for smaller attack surface

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Lint/Format Failures

**Problem:** ESLint or Prettier issues detected
**Solution:**
```bash
# Fix automatically
npm run lint:fix && npm run format

# Check issues manually  
npm run lint
npm run format:check
```

#### 2. Test Failures

**Problem:** Tests failing in CI
**Solution:**
```bash
# Run tests locally
npm test

# Run with same environment
NODE_ENV=test NODE_OPTIONS=--experimental-vm-modules npm test

# Check database connection
npm run db:migrate
```

**Common Causes:**
- Database connection issues
- Missing environment variables
- Test data conflicts
- Timing issues with async operations

#### 3. Docker Build Failures

**Problem:** Docker build failing
**Solution:**
```bash
# Test build locally
docker build -t acquisitions-jsm:test .

# Check for common issues:
# - Missing files (.dockerignore)
# - Invalid Dockerfile syntax
# - Network connectivity
# - Insufficient disk space
```

**Docker Hub Issues:**
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` secrets
- Check Docker Hub rate limits
- Ensure repository exists and is accessible

#### 4. Permission Issues

**Problem:** Workflow permissions denied
**Solution:**
- Ensure repository has Actions enabled
- Check secret permissions
- Verify branch protection rules don't block CI

---

## Best Practices

### Code Quality

1. **Pre-commit Hooks**: Consider adding pre-commit hooks locally:
   ```bash
   # Add to package.json
   "husky": {
     "hooks": {
       "pre-commit": "npm run lint:fix && npm run format"
     }
   }
   ```

2. **IDE Integration**: Configure ESLint and Prettier in your IDE

3. **Consistent Style**: Ensure all team members use the same formatting rules

### Testing

1. **Test Coverage**: Aim for >80% test coverage
2. **Test Types**: Include unit, integration, and end-to-end tests
3. **Test Data**: Use fixtures and factories for consistent test data
4. **Parallel Execution**: Use Node.js test runner's parallel capabilities

### Docker

1. **Image Optimization**: 
   - Multi-stage builds
   - Layer caching
   - Minimal base images

2. **Security Scanning**: Consider adding security scans:
   ```yaml
   - name: Run Trivy vulnerability scanner
     uses: aquasecurity/trivy-action@master
     with:
       image-ref: ${{ steps.meta.outputs.tags }}
   ```

3. **Tag Strategy**: Use semantic versioning for releases

### Deployment

1. **Environment Separation**: Use different Docker tags for different environments
2. **Health Checks**: Always include health check endpoints
3. **Rollback Strategy**: Keep previous image versions for quick rollbacks
4. **Monitoring**: Set up monitoring and alerting for deployed applications

---

## GitHub Actions Features Used

### Advanced Features

1. **Conditional Steps**: Using `if` conditions for different scenarios
2. **Step Outputs**: Passing data between steps
3. **Artifacts**: Uploading test results and coverage reports
4. **Caching**: NPM dependency caching for faster builds
5. **Matrix Builds**: Could be extended for multiple Node.js versions
6. **Secrets**: Secure handling of sensitive data
7. **Annotations**: Rich error reporting in the UI
8. **Step Summaries**: Detailed reports in the Actions tab

### GitHub API Integration

- **Issue Creation**: Automated deployment issues
- **PR Comments**: Contextual feedback on pull requests
- **Status Checks**: Integration with branch protection rules

---

## Monitoring and Metrics

### Key Metrics to Track

1. **Build Duration**: Monitor workflow execution times
2. **Success Rate**: Track failure rates across workflows  
3. **Test Coverage**: Monitor coverage trends
4. **Security Issues**: Track vulnerabilities in dependencies

### Alerts and Notifications

Consider setting up:
- Slack/Teams notifications for failures
- Email alerts for production deployments
- Dashboard monitoring for CI/CD metrics

---

## Future Enhancements

### Potential Improvements

1. **Security Scanning**: Add dependency and container security scans
2. **Performance Testing**: Include load testing in CI/CD
3. **Multi-Environment**: Add staging deployment workflow
4. **Release Automation**: Automated changelog generation
5. **Monitoring Integration**: Post-deployment health checks
6. **Rollback Automation**: Automatic rollback on deployment failures

### Workflow Extensions

```yaml
# Example: Add security scanning
- name: Run security audit
  run: npm audit --audit-level high

# Example: Add performance testing  
- name: Run performance tests
  run: npm run test:perf

# Example: Deploy to staging
- name: Deploy to staging
  if: github.ref == 'refs/heads/staging'
  run: ./scripts/deploy-staging.sh
```

---

## Commands Quick Reference

### Local Development
```bash
# Code quality
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Testing
npm test
npm run test:watch

# Docker
docker build -t acquisitions-jsm:local .
docker run -p 3000:3000 acquisitions-jsm:local
```

### CI/CD Management
```bash
# GitHub CLI - Manage secrets
gh secret set DOCKER_USERNAME --body "username"
gh secret set DOCKER_PASSWORD --body "token"

# GitHub CLI - Run workflows manually  
gh workflow run docker-build-and-push.yml

# GitHub CLI - View workflow runs
gh run list --workflow=docker-build-and-push.yml
```

---

For more information about GitHub Actions, see the [official documentation](https://docs.github.com/en/actions).

**Need help?** Check the troubleshooting section or open an issue on GitHub.