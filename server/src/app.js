'use strict'

import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import * as rfs from 'rotating-file-stream';
import { fileURLToPath } from 'url';
import { connectToDatabase, initializeDatabase } from './db.js';
import authRoute from './routes/auth.js';
import clientsRoute from './routes/clients.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* SERVER & PARAMETERS */
const app = express();

/* SECURITY */
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for Angular app
}));

/* LOGGING */
// Create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname.substring(0, __dirname.length - 4), 'log')
});
app.use(morgan('combined', {
    stream: accessLogStream
}));
app.use(morgan('combined'));

/* CORS */
app.use(cors({credentials: true, origin: true}));
app.use(function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }  
})
app.options('*', cors({credentials: true, origin: true}));

/* MISCELLANEOUS */
app.use(express.json({limit: '10000kb'}));
app.use(express.urlencoded({'extended': true}));

/* DATABASE */
await connectToDatabase();
await initializeDatabase();

/* ROUTES */
// API Routes
app.use('/api/auth', authRoute);
app.use('/api/clients', clientsRoute);

/* STATIC FILES - Angular App */
// Check if Angular build directory and index.html exist
const angularBuildPath = path.join(__dirname, '../../client/dist/apollo-ng/browser');
const indexPath = path.join(angularBuildPath, 'index.html');

const angularAppExists = fs.existsSync(angularBuildPath) && fs.existsSync(indexPath);

if (angularAppExists) {
    console.log('Angular app found, serving static files from:', angularBuildPath);
    
    // Serve static files from the Angular build directory
    app.use(express.static(angularBuildPath));

    // Handle Angular routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        // Don't interfere with API routes
        if (req.path.startsWith('/api/')) {
            return res.status(404).json({ error: 'API endpoint not found' });
        }
        
        // Serve the Angular app's index.html for all other routes
        res.sendFile(indexPath);
    });
} else {
    console.log('Angular app not found at:', angularBuildPath);
    console.log('Make sure to build the Angular app with: ng build');
    
    // Provide a helpful message for non-API routes when Angular app is not available
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
            return res.status(404).json({ error: 'API endpoint not found' });
        }
        
        res.status(404).json({ 
            error: 'Angular app not found',
            message: 'Please build the Angular app first with: ng build',
            expectedPath: angularBuildPath
        });
    });
}

export default app;
