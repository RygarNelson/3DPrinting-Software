'use strict'

const mongoose = require('mongoose');

const ClientsSchema = mongoose.Schema({
    _id: mongoose.ObjectId,
    firstname: { type : String },
    lastname: { type : String },
    companyname: { type : String },
    phone: { type : String },
    email: { type : String },
}, {
    timestamps: true
});

module.exports = mongoose.model('Clients', ClientsSchema);