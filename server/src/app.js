'use strict'

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import * as rfs from 'rotating-file-stream';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase, initializeDatabase } from './db.js';
import authRoute from './routes/auth.js';
import clientsRoute from './routes/clients.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* SERVER & PARAMETERS */
const app = express();

/* SECURITY */
app.use(helmet());

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
// Routers
// Auth API
app.use('/api/auth', authRoute);
// Clients API
app.use('/api/clients', clientsRoute);

export default app;
