var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

const { secret, jwtOptions } = require('../config/jwtOptions')
const { encryptionOptions } = require('../config/encryptionOptions')

module.exports = {
    deleteItemsOnJson: function(array, items) {
        for (let i = 0; i < items.length; i++) {
            delete array[items[i]]
        }
    },

    createJwtPayload: function(username, id, type) {
        return {
            id: id,
            username: username,
            type: type
        }
    },

    encryptPassword: function(password) {
        return bcrypt.hashSync(password, encryptionOptions.saltRounds)
    },

    comparePasswords: function(password, hash) {
        return bcrypt.compareSync(password, hash)
    },

    createJwtToken: function (payload) {
        return jwt.sign(payload, secret, jwtOptions)
    },

    checkToken: function (token) {
        try {
            return jwt.verify(token, secret)
        }
        catch (err) {
            return false
        }
    },

    getTokenValues: function (token) {
        try {
            return jwt.verify(token, secret)
        }
        catch (err) {
            return null
        }
    }
}
