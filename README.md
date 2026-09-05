# Kiwi ScamCheck

Kiwi ScamCheck is a privacy-first, New Zealand-focused web application that helps users inspect suspicious messages for common scam warning signs.

🔗 **Live Demo:** https://kiwi-scamcheck.nirankar.workers.dev/

Kiwi ScamCheck analyses suspicious messages locally in the browser and returns:

* a risk score
* a risk level
* detected warning signals
* matched evidence
* explanations
* recommended actions

The goal is not to declare a message definitely safe or fraudulent. Instead, Kiwi ScamCheck helps users recognise suspicious patterns and make a more informed decision.

## Live App

Production:

`https://kiwi-scamcheck.nirankar.workers.dev/`

## Key Features

* Browser-based scam message analysis
* Privacy-first architecture
* Raw suspicious messages stay in the browser
* Risk score from 0 to 100
* Low, medium, and high risk levels
* Warning signal detection
* Evidence and explanations for each signal
* Recommended next steps
* Anonymous Yes/No feedback collection
* Dark and light theme support
* AWS serverless feedback API
* Automated tests
* GitHub Actions CI/CD
* AWS deployment using OIDC instead of permanent access keys

## Scam Detection Engine

The scam analysis runs locally in the browser through the reusable:

`@kiwi-scamcheck/scam-engine`

package.

Current warning signals include:

### Urgency

Detects language designed to pressure the user into acting quickly.

Examples include messages suggesting that immediate action is required or that access will be lost.

### Credential Request

Detects requests for sensitive information such as usernames, passwords, or similar credentials.

The detector also includes a negation guard to reduce false positives in advice such as:

> Never share your password.

### Suspicious URL

Detects selected suspicious URL patterns, including:

* URL shorteners
* raw IP-address URLs
* embedded authentication information

The current prototype deliberately does not perform network requests, DNS checks, domain-age checks, or external URL reputation lookups.

## Risk Scoring

Each detected signal contributes to the final score.

| Signal             | Severity | Score contribution |
| ------------------ | -------- | -----------------: |
| Urgency            | Medium   |                +15 |
| Credential Request | High     |                +30 |
| Suspicious URL     | High     |                +25 |

Risk levels are currently mapped as:

| Score  | Risk level |
| ------ | ---------- |
| 0–24   | Low        |
| 25–59  | Medium     |
| 60–100 | High       |

The final score is capped at 100.

## Privacy-First Design

Privacy is one of the main design requirements of Kiwi ScamCheck.

The suspicious message entered by the user is analysed locally in the browser.

The raw message is not:

* stored in DynamoDB
* sent to the feedback API
* persisted by the backend
* intentionally written to CloudWatch logs

Only structured anonymous feedback is sent to AWS.

Example feedback payload:

```json
{
  "riskLevel": "high",
  "signalCodes": [
    "URGENCY",
    "CREDENTIAL_REQUEST"
  ],
  "helpful": true,
  "engineVersion": "0.1.0"
}
```

The backend generates the feedback ID and creation timestamp.

## Architecture

```text
User
  |
  v
Cloudflare-hosted Next.js frontend
  |
  |-- Suspicious message
  |      |
  |      v
  |   Local browser analysis
  |      |
  |      v
  |   Scam detection engine
  |
  |-- Structured anonymous feedback only
         |
         v
   Amazon API Gateway
         |
         v
      AWS Lambda
         |
         v
    Amazon DynamoDB
```

The analysis path and the feedback path are intentionally separated.

The raw suspicious message stays on the client side.

## Project Structure

```text
kiwi-scamcheck/
├── src/
│   └── app/
├── packages/
│   ├── contracts/
│   ├── scam-engine/
│   └── test-data/
├── services/
│   └── feedback-api/
├── infrastructure/
├── docs/
├── .github/
│   └── workflows/
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── wrangler.jsonc
```

### `packages/contracts`

Contains shared TypeScript contracts used across the application.

### `packages/scam-engine`

Contains the browser-based scam detection and scoring logic.

### `packages/test-data`

Contains test data kept separate from production detector logic.

### `services/feedback-api`

Contains the AWS Lambda feedback API implementation, request validation, DynamoDB persistence logic, and unit tests.

### `infrastructure`

Contains the AWS SAM infrastructure template.

## Technology Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* App Router
* Static export
* Cloudflare Workers Static Assets

### Scam Analysis

* TypeScript
* Local browser execution
* Rule-based signal detection

### Backend

* Node.js 22
* AWS Lambda
* Amazon API Gateway REST API
* Amazon DynamoDB
* AWS SDK for JavaScript v3

### Infrastructure and Deployment

* AWS SAM
* AWS CloudFormation
* AWS IAM
* GitHub Actions
* GitHub OIDC
* Cloudflare Wrangler

### Testing and Quality

* Vitest
* TypeScript compiler checks
* ESLint
* GitHub Actions CI

## AWS Architecture

The AWS backend is deployed in:

`ap-southeast-6` — New Zealand

The backend consists of:

* API Gateway REST API
* AWS Lambda
* DynamoDB
* CloudWatch Logs
* private S3 bucket for SAM deployment artifacts

The DynamoDB table uses:

`feedbackId`

as the partition key.

The current prototype uses:

* 1 read capacity unit
* 1 write capacity unit

## Feedback API

### Endpoint

```text
POST /feedback
```

### Example Request

```json
{
  "riskLevel": "high",
  "signalCodes": [
    "URGENCY",
    "CREDENTIAL_REQUEST"
  ],
  "helpful": true,
  "engineVersion": "0.1.0"
}
```

### Example Response

```json
{
  "feedbackId": "471e35ed-52b1-479c-a0b9-4b35099622bf",
  "createdAt": "2026-08-30T03:26:43.946Z"
}
```

The server validates every request at runtime before persistence.

Defensive limits are also applied to fields such as signal codes and engine version.

## DynamoDB Persistence

The Lambda function stores only:

```text
feedbackId
createdAt
riskLevel
signalCodes
helpful
engineVersion
```

The raw suspicious message is never written to DynamoDB.

The write also uses a conditional expression to prevent an existing record with the same `feedbackId` from being overwritten.

## Security

The project deliberately avoids permanent AWS access keys.

### Lambda Execution Role

The Lambda function uses a dedicated execution role with permission to write only to the Kiwi ScamCheck DynamoDB table.

### CloudFormation Service Role

AWS CloudFormation uses a separate service role for infrastructure deployment.

### Developer IAM Identity

Development permissions are restricted instead of using `AdministratorAccess`.

### GitHub Actions OIDC

GitHub Actions authenticates to AWS using OpenID Connect.

The deployment workflow obtains short-lived AWS credentials and assumes a dedicated deployment role.

No permanent AWS access key or secret access key is stored in GitHub.

The OIDC trust relationship is restricted to:

* this GitHub repository
* the `main` branch

## CI/CD

GitHub Actions runs automated quality checks and AWS deployment.

The deployment path is:

```text
Push / merge to main
        |
        v
GitHub Actions
        |
        +--> Install dependencies
        +--> TypeScript checks
        +--> Tests
        +--> ESLint
        |
        v
GitHub OIDC
        |
        v
Temporary AWS credentials
        |
        v
AWS SAM build
        |
        v
CloudFormation deployment
```

This keeps permanent AWS credentials out of both the repository and GitHub secrets.

## Cloudflare Deployment

The frontend is exported as static content by Next.js.

Production builds are generated in:

```text
out/
```

Cloudflare deployment configuration is stored in:

```text
wrangler.jsonc
```

The production frontend is hosted at:

`https://kiwi-scamcheck.nirankar.workers.dev/`

## Local Development

### Requirements

* Node.js 22
* pnpm

Install dependencies:

```bash
pnpm install
```

Create:

```text
.env.local
```

in the project root.

Add:

```text
NEXT_PUBLIC_FEEDBACK_API_URL=<your-feedback-api-url>
```

The environment file is ignored by Git.

Start the local development server:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

## Quality Checks

Run TypeScript checks:

```bash
pnpm exec tsc --noEmit
```

Run tests:

```bash
pnpm test
```

Run ESLint:

```bash
pnpm lint
```

Create a production build:

```bash
pnpm build
```

The current test suite covers:

* urgency detection
* credential-request detection
* suspicious URL detection
* scoring
* recommendations
* engine evaluation
* feedback request validation
* Lambda handler behaviour
* DynamoDB persistence

## AWS SAM

Validate the infrastructure template:

```bash
sam validate \
  --template-file infrastructure/template.yaml \
  --lint \
  --profile kiwi-scamcheck-dev \
  --region ap-southeast-6
```

Build the Lambda application:

```bash
sam build \
  --template-file infrastructure/template.yaml \
  --build-in-source
```

The custom build uses esbuild to bundle the Lambda as CommonJS for the Node.js runtime.

## Observability

Lambda writes operational logs to CloudWatch Logs.

The log group uses a 7-day retention period to avoid keeping debugging logs indefinitely.

The developer IAM group has read-only access to the Kiwi ScamCheck Lambda log group for troubleshooting.

## Cost-Conscious AWS Design

Kiwi ScamCheck is intentionally designed as a small, cost-conscious AWS prototype.

Current controls include:

* Lambda configured with 128 MB memory
* 5-second Lambda timeout
* low DynamoDB provisioned capacity
* private S3 deployment artifact bucket
* lifecycle cleanup of old SAM artifacts
* 7-day CloudWatch log retention
* no NAT Gateway
* no EC2
* no RDS
* no Application Load Balancer
* no WAF
* no unnecessary always-on compute
* AWS budget and usage monitoring

The goal is to keep the prototype at or near NZ$0 out-of-pocket while still demonstrating practical AWS engineering skills.

## Current Limitations

Kiwi ScamCheck is a prototype and should not be treated as a definitive fraud-detection system.

Current limitations include:

* rule-based detection rather than a trained classification model
* limited signal catalogue
* no external URL reputation service
* no DNS or domain-age lookup
* no external threat-intelligence integration
* no user accounts
* no definitive safe/fraudulent classification

The application provides warning indicators to support user judgement.

## Future Direction

Possible future improvements include:

* broader scam signal coverage
* larger evaluation datasets
* improved explanations
* carefully selected reputation or threat-intelligence sources
* additional New Zealand-specific scam patterns

These are intentionally outside the current prototype scope.

## Author

**Nirankar Jaiswar**

Software engineer and Master of Information Technology graduate based in New Zealand.

Kiwi ScamCheck was built as a hands-on portfolio project to strengthen practical experience across:

* software engineering
* browser-based analysis
* testing
* AWS serverless architecture
* IAM
* infrastructure as code
* CI/CD
* observability
* privacy
* cost-conscious cloud deployment
