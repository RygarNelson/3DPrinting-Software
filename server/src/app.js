'use strict'

import compression from 'compression';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import * as rfs from 'rotating-file-stream';
import { fileURLToPath } from 'url';
import { connectToDatabase, initializeDatabase } from './db.js';
import authRoute from './routes/auth.route.js';
import clienteRoute from './routes/cliente.route.js';
import modelloRoute from './routes/modello.route.js';
import spesaRoute from './routes/spesa.route.js';
import stampanteRoute from './routes/stampante.route.js';
import venditaRoute from './routes/vendita.route.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* SERVER & PARAMETERS */
const app = express();

/* COMPRESSION */
// Enable compression for all responses when browser supports it
app.use(compression());

/* SECURITY */
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for Angular app
}));

/* LOGGING */
// Create a rotating write stream
try {
    var accessLogStream = rfs.createStream('access.log', {
        interval: '1d', // rotate daily
        path: path.join(process.cwd(), 'log'), // Use process.cwd() for more reliable path
        compress: 'gzip', // compress rotated files
    });
    
    // Handle stream errors
    accessLogStream.on('error', (err) => {
        console.error('Access log stream error:', err);
    });
    
    app.use(morgan('combined', {
        stream: accessLogStream
    }));
    app.use(morgan('combined'));
    
    console.log('Rotating file stream initialized successfully');
} catch (error) {
    console.error('Failed to initialize rotating file stream:', error);
    // Fallback to console logging
    app.use(morgan('combined'));
}

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
app.use('/api/stampante', stampanteRoute);
app.use('/api/modello', modelloRoute);
app.use('/api/cliente', clienteRoute);
app.use('/api/vendita', venditaRoute);
app.use('/api/spesa', spesaRoute);

/* STATIC FILES - Angular App */
// Check if Angular static files directory exists
const angularStaticPath = path.join(__dirname, '../client_static_files');
const indexPath = path.join(angularStaticPath, 'index.html');

const angularAppExists = fs.existsSync(angularStaticPath) && fs.existsSync(indexPath);

if (angularAppExists) {
    console.log('Angular static files found, serving from:', angularStaticPath);
    
    // Serve static files from the Angular static files directory
    app.use(express.static(angularStaticPath, {
        setHeaders: (res, path) => {
            res.setHeader('Cache-Control', 'no-cache');
        }
    }));

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
    console.log('Angular static files not found at:', angularStaticPath);
}

// Add global error handler middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: 'Errore generale',
        technical_data: err.toString()
    });
});

export default app;
