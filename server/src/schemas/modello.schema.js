'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            nome: {
                escape: true,
                optional: false,
                notEmpty: {
                    errorMessage: 'Il campo Nome non è valido'
                },
                isLength: {
                    options: { max: 255 },
                    errorMessage: 'Il nome non può superare i 255 caratteri'
                }
            },
            descrizione: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 500 },
                    errorMessage: 'La descrizione non può superare i 500 caratteri'
                }
            }
        });
    }
};

export default validationSchema;