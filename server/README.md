# NodeJS Express Base
This repository contains a prebuilt NodeJS and ExpressJS backend server, with multiple functionalities already been implemented. You can simply download the project and start working on your REST API server.

This project has been created with the purpose to give everyone a hassle-free, pre-built configuration of a typical NodeJS + ExpressJS installation.

This project aims to be as compact as possible, so it can be used as a single, large server or as a part of multiple microservices.

## Functionalities

- Support for multiple configurations
- Support for both HTTPS and HTTP
- Support for enhanced header security
- Support for daily logging
- Support for CORS
- Support for extended JSON payloads
- Support for JsonWebToken, as standard authentication
- Support for input sanitization
- Support for middlewares
- Support for sending emails
- Support for the following databases: MySQL, PostgreSQL

## Modules

- **Bcrypt**: Encryption / Decryption of passwords
- **Cors**: Allows for REST API calls on the same machine
- **Dotenv**: Configuration files
- **Express**: Base for the server
- **Express Validator**: Input sanitization
- **Helmet**: Security module
- **JsonWebToken**: Authentication module that uses the standard [RFC 7519](https://tools.ietf.org/html/rfc7519)
- **Morgan**: Logging module
- **Mysql**: MySQL database module
- **Nodemailer**: email module
- **Nodemon**: Live Reload
- **Npm**: Standard package manager
- **Pg**: PostgreSQL database module
- **Rotating File Streams**: Allows to perform daily logs

## Structure

- Every configuration variable should be put inside the *.env* file in the root folder. 
> ***REMEMBER TO IMMEDIATELY PUT THE FILE INSIDE .gitignore, OTHERWISE YOUR SENSIBLE INFORMATION COULD BE EXPOSED***
- All configuration files should be put inside *src/config*. You can already find some examples inside the folder
- All middlewares should be put inside *src/middleware*. You can already find an example inside the folder
- *src/methods* is a folder used to store common functions. You can already find some examples inside the folder
- Routes should be placed inside *src/routes*. Then they must be declared inside the *src/app.js* file. You can already find some examples inside the folder
- *src/app.js* is the main file and contains everything for the server to function properly
- *src/db.js* contains all the necessary information to connect to a database

## Future Work

- Extend the database support for Oracle and MongoDB
- Support for extended logging via Winston
- Support for anti-tampering of log files
- SMS module
- Socket module, for live interaction
- Add scalability
- Explanation of all the configuration variables inside the *.env* file

# Server Documentation

## Audit Logs

### Enriched Vendita Logs

The system now supports enriched vendita logs that include related `dettagli` and `basette` logs within the main vendita log data. This allows you to see all related changes in a single view.

#### Endpoints

- **POST** `/api/logs/vendita/enriched` - Get enriched vendita logs with POST body parameters
- **GET** `/api/logs/vendita/enriched` - Get enriched vendita logs with query parameters

#### Parameters

- `record_id` (optional): Specific vendita ID to filter
- `operation` (optional): Filter by operation type (INSERT, UPDATE, DELETE, etc.)
- `user_id` (optional): Filter by user who made the change
- `date_from` (optional): Start date for filtering
- `date_to` (optional): End date for filtering
- `limit` (optional): Number of records to return (default: 100)
- `offset` (optional): Number of records to skip (default: 0)
- `order` (optional): Sort order - ASC or DESC (default: DESC)

#### Response Format

The enriched logs will include:

```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "table_name": "T_VENDITE",
      "record_id": 456,
      "operation": "UPDATE",
      "old_record": {
        "id": 456,
        "data_vendita": "2024-01-01",
        "dettagli": [
          {
            "id": 789,
            "modello_id": 101,
            "quantita": 5,
            "_audit": {
              "operation": "UPDATE",
              "field_name": "quantita",
              "old_value": "3",
              "new_value": "5"
            }
          }
        ],
        "basette": [
          {
            "id": 999,
            "dimensione": "10x10",
            "_audit": {
              "operation": "INSERT",
              "field_name": null,
              "old_value": null,
              "new_value": "10x10"
            }
          }
        ]
      },
      "new_record": { ... },
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 100,
    "offset": 0,
    "pages": 1
  }
}
```

#### Features

- **Consolidated View**: All related changes (vendita, dettagli, basette) are shown in one log entry
- **Audit Metadata**: Each related record includes audit information about when and how it was changed
- **Efficient Queries**: Uses batch queries to minimize database round trips
- **Clean Data Structure**: Related data is nested under `dettagli` and `basette` arrays
- **Audit Trail**: Each related record includes its own audit history

#### Usage Examples

```bash
# Get all enriched vendita logs
GET /api/logs/vendita/enriched

# Get logs for a specific vendita
GET /api/logs/vendita/enriched?record_id=456

# Get logs with pagination
GET /api/logs/vendita/enriched?limit=20&offset=40

# Get logs for a specific operation
GET /api/logs/vendita/enriched?operation=UPDATE

# Get logs within a date range
GET /api/logs/vendita/enriched?date_from=2024-01-01&date_to=2024-01-31
```

This functionality allows the frontend to display comprehensive audit information without needing to make multiple API calls or manually correlate related logs.
