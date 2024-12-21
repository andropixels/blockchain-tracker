# Blockchain Price Tracker

A NestJS-based service that tracks cryptocurrency prices, sends alerts, and provides swap rate calculations.

## Quick Start

1. Clone the repository:
```bash
cd blockchain-tracker
```

2. Start the application:
```bash
docker-compose up --build
```
3. .env file 
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=blockchain_tracker

# Moralis API
MORALIS_API_KEY=

# Email
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=<your-email>
    EMAIL_PASSWORD=<app-password>

# App
PORT=3000

```

## API Documentation

Swagger UI: http://localhost:3000/api

## Testing the Application

### 1. Price Tracking APIs

Get Ethereum prices:
```bash
# Using curl
curl http://localhost:3000/prices/ethereum/hourly

# Using URL in browser
http://localhost:3000/prices/ethereum/hourly
```

Get Polygon prices:
```bash
# Using curl
curl http://localhost:3000/prices/polygon/hourly

# Using URL in browser
http://localhost:3000/prices/polygon/hourly
```

### 2. Price Alert APIs

Set alert for Ethereum:
```bash

- to send test email to hyperhire_assignment@hyperhire.in 
curl -X POST http://localhost:3000/email/test



curl -X POST http://localhost:3000/alerts \
-H "Content-Type: application/json" \
-d '{
  "chain": "ethereum",
  "targetPrice": 3400,
  "email": "hyperhire_assignment@hyperhire.in"
}'

# Using URL in browser (POST request in Swagger)
http://localhost:3000/api#/alerts/AlertController_createAlert
```

Set alert for Polygon:
```bash
curl -X POST http://localhost:3000/alerts \
-H "Content-Type: application/json" \
-d '{
  "chain": "polygon",
  "targetPrice": 1.5,
  "email": "hyperhire_assignment@hyperhire.in"
}'
```

### 3. Swap Rate APIs

Calculate ETH to BTC swap:
```bash
# Using curl
curl http://localhost:3000/swap/eth-to-btc?ethAmount=1

# Using URL in browser
http://localhost:3000/swap/eth-to-btc?ethAmount=1
```

## API Endpoints Reference

### Price Endpoints
```bash
# Get Ethereum hourly prices
GET http://localhost:3000/prices/ethereum/hourly

# Get Polygon hourly prices
GET http://localhost:3000/prices/polygon/hourly

# Response format:
[
  {
    "id": number,
    "chain": string,
    "price": string,
    "timestamp": string
  }
]
```

### Alert Endpoints
```bash
# Create price alert
POST http://localhost:3000/alerts
Content-Type: application/json

{
  "chain": "ethereum|polygon",
  "targetPrice": number,
  "email": "string"
}

# Response format:
{
  "id": number,
  "chain": string,
  "targetPrice": number,
  "email": string,
  "triggered": boolean,
  "createdAt": string
}
```

### Swap Endpoints
```bash
# Get ETH to BTC swap rate
GET http://localhost:3000/swap/eth-to-btc?ethAmount=1

# Response format:
{
  "btcAmount": number,
  "fee": {
    "eth": number,
    "usd": number
  }
}
```

## Database Queries

View latest prices:
```bash
docker exec -it blockchain-tracker_postgres_1 psql -U postgres -d blockchain_tracker -c "SELECT * FROM prices ORDER BY timestamp DESC LIMIT 5;"

# Response format:
 id |  chain   |     price      |        timestamp
----+----------+----------------+------------------------
  1 | ethereum | 3370.93936521  | 2024-12-21 18:25:01
```

View active alerts:
```bash
docker exec -it blockchain-tracker_postgres_1 psql -U postgres -d blockchain_tracker -c "SELECT * FROM alerts;"

# Response format:
 id |  chain   | targetPrice  |           email            | triggered |      createdAt
----+----------+-------------+---------------------------+-----------+---------------------
  1 | ethereum | 3400.000000 | hyperhire_assignment@... | f         | 2024-12-21 18:26:34
```

## Features

1. **Automated Price Tracking**
   - Tracks ETH and MATIC prices every 5 minutes
   - Maintains 24-hour price history
   - Access via: http://localhost:3000/prices/{chain}/hourly

2. **Price Alerts**
   - Set custom price targets for any supported chain
   - Automatic email alerts when:
     - Price reaches target value
     - Price changes by more than 3% in an hour
   - Set alerts via: http://localhost:3000/alerts

3. **Swap Rate Calculator**
   - Real-time ETH to BTC conversion rates
   - Includes fee calculations (0.03% fee)
   - Calculate via: http://localhost:3000/swap/eth-to-btc?ethAmount={amount}

## Monitoring

View application logs:
```bash
# Show all logs
docker-compose logs app

# Follow logs in real-time
docker-compose logs -f app

# Filter price updates
docker-compose logs -f app | grep "price"

# Filter alert notifications
docker-compose logs -f app | grep "alert"
```