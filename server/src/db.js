'use strict'

const mongoose = require('mongoose');

var connection = mongoose
                .set('strictQuery', true)
                .connect(process.env.DB_CONNECTION_URL)
                .then(() => {
                    console.log("Successfully connected to the database")
                })
                .catch((error) => {
                    console.log("Could not connect to the database. Exiting now...", error)
                    process.exit();
                })

module.exports = { connection }