import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to get the appropriate database path
const getDatabasePath = () => {
    // In development or standalone Node.js, use relative path
    const dbDir = path.join(__dirname, '../../database');
        
    // Ensure the database directory exists
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    
    return path.join(dbDir, 'database.sqlite');
};

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: getDatabasePath(),
    logging: false
});

export { sequelize };

