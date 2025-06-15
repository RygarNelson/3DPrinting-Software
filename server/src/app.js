'use strict'

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
var rfs = require('rotating-file-stream');
var path = require('path');
const connection = require('./db');

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

/* ROUTES */
const authRoute = require("./routes/auth");
const clientsRoute = require("./routes/clients");

// Routers
// Auth API
app.use('/api/auth', authRoute);
// Clients API
app.use('/api/clients', clientsRoute);

module.exports = app
