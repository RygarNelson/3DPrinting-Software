'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            nome: {
                escape: true,
                notEmpty: {
                    errorMessage: 'Il campo Nome non è valido'
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