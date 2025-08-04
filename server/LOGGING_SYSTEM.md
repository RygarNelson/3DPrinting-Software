# Database Logging System Documentation

## Overview

The database logging system automatically tracks all changes made to the database, including:
- **INSERT** operations (new records)
- **UPDATE** operations (field-level changes)
- **DELETE** operations (hard deletes)
- **SOFT_DELETE** operations (paranoid deletes)
- **RESTORE** operations (restoring soft-deleted records)

## Architecture

### Components

1. **T_LOGS Table** - Stores all database change logs
2. **LoggingService** - Centralized logging functionality
3. **BaseRepository** - Provides automatic logging for CRUD operations
4. **LoggingContext Middleware** - Sets user context from HTTP requests
5. **LogRepository** - Manages log queries and statistics

### Database Schema

```sql
CREATE TABLE T_LOGS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name VARCHAR(100) NOT NULL,           -- Name of the modified table
    record_id INTEGER NULL,                     -- ID of the modified record
    operation VARCHAR(20) NOT NULL,             -- INSERT, UPDATE, DELETE, SOFT_DELETE, RESTORE
    field_name VARCHAR(100) NULL,               -- Specific field changed (for UPDATE operations)
    old_value TEXT NULL,                        -- Previous value
    new_value TEXT NULL,                        -- New value
    old_record TEXT NULL,                       -- Complete old record as JSON
    new_record TEXT NULL,                       -- Complete new record as JSON
    user_id INTEGER NULL,                       -- ID of the user who made the change
    ip_address VARCHAR(45) NULL,                -- IP address of the user
    user_agent TEXT NULL,                       -- User agent string
    session_id VARCHAR(255) NULL,               -- Session identifier
    additional_data TEXT NULL,                  -- Additional context data as JSON
    createdAt DATETIME NOT NULL,                -- When the log was created
    updatedAt DATETIME NOT NULL                 -- When the log was last updated
);
```

## Usage

### 1. Automatic Logging (Recommended)

Extend the `BaseRepository` class to get automatic logging for all CRUD operations:

```javascript
import BaseRepository from './base.repository.js';
import Cliente from '../models/cliente.model.js';

class ClienteRepository extends BaseRepository {
    constructor() {
        super(Cliente, 'T_CLIENTI');
    }

    // All CRUD operations are automatically logged
    async insertOne(data, additionalData = null) {
        return super.insertOne(data, additionalData);
    }

    async updateOne(id, data, additionalData = null) {
        return super.updateOne(id, data, additionalData);
    }

    async deleteOne(id, additionalData = null) {
        return super.deleteOne(id, additionalData);
    }
}
```

### 2. Manual Logging

Use the `LoggingService` directly for custom operations:

```javascript
import loggingService from '../services/logging.service.js';

// Set context (usually done by middleware)
loggingService.setContext({
    user_id: 123,
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0...',
    session_id: 'session123'
});

// Log operations
await loggingService.logInsert('T_CLIENTI', 456, { nome: 'John', cognome: 'Doe' });
await loggingService.logUpdate('T_CLIENTI', 456, oldData, newData);
await loggingService.logDelete('T_CLIENTI', 456, deletedData);
```

### 3. HTTP Request Logging

Add the logging middleware to your routes:

```javascript
import { setLoggingContext, clearLoggingContext } from '../middleware/loggingContext.js';

router.use(authenticate);
router.use(setLoggingContext);    // Sets user context from request
router.use(clearLoggingContext);  // Clears context after request
```

## API Endpoints

### Get Logs with Filtering

```
GET /api/logs?table_name=T_CLIENTI&operation=UPDATE&limit=50&offset=0
```

**Query Parameters:**
- `table_name` - Filter by table name
- `record_id` - Filter by record ID
- `operation` - Filter by operation type
- `user_id` - Filter by user ID
- `date_from` - Filter from date (ISO format)
- `date_to` - Filter to date (ISO format)
- `limit` - Number of records to return (default: 100)
- `offset` - Number of records to skip (default: 0)
- `order` - Sort order: ASC or DESC (default: DESC)

### Get Log Statistics

```
GET /api/logs/statistics?table_name=T_CLIENTI&date_from=2024-01-01
```

Returns statistics about logs including:
- Total number of logs
- Operations breakdown
- Tables breakdown
- Users breakdown

### Get Recent Logs

```
GET /api/logs/recent?days=7&limit=50
```

### Get Logs for Specific Table

```
GET /api/logs/table/T_CLIENTI?limit=100
```

### Get Logs for Specific Record

```
GET /api/logs/record/T_CLIENTI/123?limit=50
```

### Get Logs for Specific User

```
GET /api/logs/user/456?limit=100
```

### Get Logs by Operation Type

```
GET /api/logs/operation/UPDATE?limit=100
```

### Get Field Change Logs

```
GET /api/logs/field-changes/T_CLIENTI/nome?limit=100
```

### Clean Old Logs (Admin Only)

```
POST /api/logs/clean
Content-Type: application/json

{
    "days_to_keep": 365,
    "archive": false
}
```

## Examples

### Example 1: Creating a New Repository with Logging

```javascript
// models/product.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: "T_PRODUCTS",
    timestamps: true,
    paranoid: true
});

export default Product;
```

```javascript
// repositories/product.repository.js
import BaseRepository from './base.repository.js';
import Product from '../models/product.model.js';

class ProductRepository extends BaseRepository {
    constructor() {
        super(Product, 'T_PRODUCTS');
    }

    // Custom method with additional logging context
    async createProductWithCategory(productData, categoryId) {
        const additionalData = {
            category_id: categoryId,
            operation: 'CREATE_WITH_CATEGORY'
        };
        
        return this.insertOne(productData, additionalData);
    }
}

const productRepository = new ProductRepository();
export default productRepository;
```

### Example 2: Custom Logging in Routes

```javascript
// routes/product.route.js
import express from 'express';
import { setLoggingContext, clearLoggingContext } from '../middleware/loggingContext.js';
import productRepository from '../repositories/product.repository.js';
import loggingService from '../services/logging.service.js';

const router = express.Router();

router.use(setLoggingContext);
router.use(clearLoggingContext);

router.post('/', async (req, res) => {
    try {
        const product = await productRepository.insertOne(req.body, {
            request_source: 'HTTP',
            endpoint: req.originalUrl,
            method: req.method
        });
        
        res.json({ success: true, data: product });
    } catch (error) {
        // Log the error
        await loggingService.logOperation({
            table_name: 'T_PRODUCTS',
            operation: 'ERROR',
            additional_data: {
                error: error.message,
                request_body: req.body
            }
        });
        
        res.status(500).json({ success: false, error: error.message });
    }
});
```

### Example 3: Bulk Operations with Logging

```javascript
// Bulk insert with logging
const products = [
    { name: 'Product 1', price: 10.99 },
    { name: 'Product 2', price: 20.99 }
];

const additionalData = {
    operation: 'BULK_IMPORT',
    source: 'CSV_FILE',
    total_records: products.length
};

await productRepository.bulkInsert(products, additionalData);
```

## Performance Considerations

### Indexes

The system creates the following indexes for optimal performance:
- `IX_T_LOGS_TABLE_NAME` - For filtering by table
- `IX_T_LOGS_RECORD_ID` - For filtering by record ID
- `IX_T_LOGS_OPERATION` - For filtering by operation type
- `IX_T_LOGS_CREATED_AT` - For date-based queries
- `IX_T_LOGS_USER_ID` - For filtering by user
- `IX_T_LOGS_TABLE_RECORD` - Composite index for table + record queries

### Log Cleanup

Implement regular log cleanup to prevent the logs table from growing too large:

```javascript
// Run this periodically (e.g., via cron job)
const deletedCount = await logRepository.cleanOldLogs(365, false);
console.log(`Cleaned ${deletedCount} old log entries`);
```

### Selective Logging

You can disable logging for certain operations by not extending `BaseRepository` or by using the model directly:

```javascript
// Direct model usage (no logging)
const result = await Cliente.create(data);

// Repository usage (with logging)
const result = await clienteRepository.insertOne(data);
```

## Security Considerations

1. **Authentication Required**: All log endpoints require authentication
2. **Admin Privileges**: Log cleanup requires admin privileges
3. **Data Sanitization**: Sensitive data should be filtered before logging
4. **Access Control**: Consider implementing role-based access to log data

## Troubleshooting

### Common Issues

1. **Logs not being created**: Check if the logging context is set properly
2. **Performance issues**: Ensure indexes are created and consider log cleanup
3. **Memory usage**: Monitor log table size and implement cleanup strategies

### Debug Mode

Enable debug logging by setting the context manually:

```javascript
loggingService.setContext({
    user_id: 1,
    ip_address: '127.0.0.1',
    user_agent: 'Debug',
    session_id: 'debug-session'
});
```

## Migration Guide

### From Manual Logging

If you have existing manual logging, migrate to the new system:

1. Replace direct model calls with repository calls
2. Update routes to use the logging middleware
3. Remove manual logging code
4. Test thoroughly

### Database Migration

The system automatically creates the `T_LOGS` table during database initialization. No manual migration is required.

## Best Practices

1. **Always use repositories** for CRUD operations to ensure logging
2. **Set meaningful additional data** for better context
3. **Implement log cleanup** to manage storage
4. **Monitor log performance** and adjust indexes as needed
5. **Use appropriate log levels** for different types of operations
6. **Test logging thoroughly** in development before production 