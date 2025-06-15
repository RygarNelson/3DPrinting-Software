'use strict'

const { checkSchema } = require('express-validator');

module.exports = {
    check: function() {
        return checkSchema({
            firstname: {
                escape: true,
                notEmpty: {
                    if: value => {
                        return value.companyname !== ''
                    },
                    errorMessage: 'Il campo Nome non è valido'
                }
            },
            lastname: {
                escape: true,
                notEmpty: {
                    if: value => {
                        return value.companyname !== ''
                    },
                    errorMessage: 'Il campo Cognome non è valido'
                }
            },
            companyname: {
                escape: true,
                notEmpty: {
                    if: value => {
                        return value.firstname == '' && value.lastname == ''
                    },
                    errorMessage: 'Il campo Ragione Sociale non è valido'
                }
            },
            phone: {
                isMobilePhone: {
                    options: 'it-IT',
                    if: value => {
                        return value.phone !== ''
                    },
                    errorMessage: 'Il campo Telefono non è valido'
                }
            },
            email: {
                isEmail: {
                    if: value => {
                        return value.email !== ''
                    },
                    errorMessage: 'Il campo Email non è valido'
                }
            }
        })
    }
}