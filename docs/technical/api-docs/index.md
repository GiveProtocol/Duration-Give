---
layout: modern
title: "API Documentation"
description: "Complete REST API documentation for integrating with Give Protocol services"
---

# API Documentation

Give Protocol provides a comprehensive REST API for integrating charitable giving functionality into your applications.

## Base URL

```
https://api.giveprotocol.io/v1
```

## Authentication

### API Keys

```http
Authorization: Bearer your_api_key_here
```

### OAuth 2.0

For user-specific operations:

```http
Authorization: Bearer user_access_token
```

## Endpoints

### Charities

#### List Charities

```http
GET /charities
```

**Parameters:**

- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset
- `category` (optional): Filter by category
- `verified` (optional): Filter by verification status

**Response:**

```json
{
  "charities": [
    {
      "id": "charity_123",
      "name": "Education for All",
      "category": "education",
      "description": "Providing quality education globally",
      "verified": true,
      "wallet_address": "0x...",
      "impact_metrics": {
        "total_donations": "50000.00",
        "beneficiaries_reached": 1250,
        "projects_completed": 15
      }
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

#### Get Charity Details

```http
GET /charities/{charity_id}
```

### Donations

#### Create Donation

```http
POST /donations
```

**Request Body:**

```json
{
  "charity_id": "charity_123",
  "amount": "100.00",
  "currency": "GLMR",
  "message": "Keep up the great work!",
  "anonymous": false,
  "recurring": {
    "frequency": "monthly",
    "duration_months": 12
  }
}
```

**Response:**

```json
{
  "donation_id": "donation_456",
  "transaction_hash": "0x...",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_confirmation": "2024-01-15T10:32:00Z"
}
```

#### Get Donation Status

```http
GET /donations/{donation_id}
```

#### List User Donations

```http
GET /users/me/donations
```

### Volunteer Hours

#### Submit Volunteer Hours

```http
POST /volunteer/hours
```

**Request Body:**

```json
{
  "charity_id": "charity_123",
  "hours": 8,
  "date": "2024-01-15",
  "description": "Helped organize fundraising event",
  "proof_documents": ["doc_url_1", "doc_url_2"]
}
```

#### Get Verification Status

```http
GET /volunteer/hours/{submission_id}
```

### Impact Tracking

#### Get User Impact

```http
GET /users/me/impact
```

**Response:**

```json
{
  "total_donated": "2500.00",
  "total_volunteer_hours": 45,
  "charities_supported": 8,
  "impact_metrics": {
    "people_helped": 150,
    "projects_funded": 5,
    "carbon_offset": "2.5 tons"
  },
  "achievements": [
    {
      "badge": "First Donation",
      "earned_at": "2023-12-01T00:00:00Z"
    }
  ]
}
```

#### Get Charity Impact

```http
GET /charities/{charity_id}/impact
```

## Webhooks

Subscribe to real-time events:

### Webhook Events

- `donation.completed`
- `donation.failed`
- `volunteer.hours.verified`
- `charity.verification.updated`

### Webhook Payload Example

```json
{
  "event": "donation.completed",
  "data": {
    "donation_id": "donation_456",
    "charity_id": "charity_123",
    "amount": "100.00",
    "donor_id": "user_789",
    "transaction_hash": "0x..."
  },
  "timestamp": "2024-01-15T10:32:00Z",
  "webhook_id": "webhook_abc123"
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @giveprotocol/sdk
```

```javascript
import { GiveProtocol } from "@giveprotocol/sdk";

const gp = new GiveProtocol({
  apiKey: "your_api_key",
  environment: "production", // or 'sandbox'
});

// Make a donation
const donation = await gp.donations.create({
  charityId: "charity_123",
  amount: "100.00",
  currency: "GLMR",
});
```

### Python

```bash
pip install giveprotocol-python
```

```python
from giveprotocol import GiveProtocol

gp = GiveProtocol(api_key='your_api_key')

# List charities
charities = gp.charities.list(verified=True)

# Create donation
donation = gp.donations.create(
    charity_id='charity_123',
    amount='100.00',
    currency='GLMR'
)
```

## Rate Limits

- **Standard**: 1000 requests per hour
- **Premium**: 10,000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642252800
```

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_CHARITY",
    "message": "The specified charity ID does not exist",
    "details": {
      "charity_id": "charity_invalid"
    }
  }
}
```

### Common Error Codes

- `INVALID_API_KEY`: Invalid or missing API key
- `INSUFFICIENT_FUNDS`: Not enough balance for donation
- `CHARITY_NOT_FOUND`: Charity ID does not exist
- `VALIDATION_ERROR`: Request validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Testing

### Sandbox Environment

```
https://api-sandbox.giveprotocol.io/v1
```

### Test Data

- Test charity ID: `charity_test_123`
- Test wallet addresses provided in sandbox
- No real transactions processed

## Security

### Best Practices

- Store API keys securely
- Use HTTPS for all requests
- Validate webhook signatures
- Implement proper error handling
- Monitor API usage and errors

### Webhook Signature Verification

```javascript
const crypto = require("crypto");

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return signature === digest;
}
```

## Support

- **Documentation**: Full API reference available
- **SDK Examples**: Sample code in multiple languages
- **Postman Collection**: Import ready-to-use requests
- **Support**: [Contact our technical team](/community/contact/)

## Need Help?

Check out our [smart contract documentation](/technical/smart-contracts/) for blockchain integration or visit our [Help Center](/help-center/faq/) for general support.
