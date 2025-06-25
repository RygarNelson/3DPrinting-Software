import 'dotenv/config';
import https from 'https';
import http from 'http';
import fs from 'fs';
import app from './src/app.js';

const port = process.env.SERVER_PORT || 3000;
const address = process.env.SERVER_ADDRESS || 'localhost';

// Initialize database and start server
const startServer = async () => {
    try {
        try {
            const options = {
                key: fs.readFileSync(process.env.HTTPS_KEY),
                cert: fs.readFileSync(process.env.HTTPS_CERT)
            };

            const httpsServer = https.createServer(options, app);
            httpsServer.listen(port, address, () => console.log(`HTTPS server at ${address}:${port}`));
        } catch (error) {
            console.log('Key or Certificate not found. Instancing non secure server');

            const httpServer = http.createServer(app);
            httpServer.listen(port, address, () => console.log(`HTTP server at ${address}:${port}`));
        }
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
