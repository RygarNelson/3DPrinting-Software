// Import required modules
import cron from 'node-cron';
import { backupDatabase } from './methods/databaseVersionMethods.js';

// Schedule the backup to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    console.log('[CRON] Starting daily database backup...');
    try {
        const backupPath = await backupDatabase();
        console.log(`[CRON] Database backup successful: ${backupPath}`);
    } catch (error) {
        console.error('[CRON] Database backup failed:', error);
    }
});

// Optional: Export or run something to keep the process alive if needed
export default cron;
