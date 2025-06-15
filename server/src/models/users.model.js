'use strict'

const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    _id: mongoose.ObjectId,
    name: { type : String , required : true },
    surname: { type : String , required : true },
    email: { type : String , unique : true, required : true, dropDups: true },
    password: { type : String , required : true },
    role: { type : Number, required : true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Users', UsersSchema);