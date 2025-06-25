'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            data_spesa: {
                optional: false,
                isISO8601: {
                    errorMessage: 'La data di spesa non è valida',
                },
                toDate: true
            },
            totale_spesa: {
                optional: true,
                isDecimal: {
                    options: { decimal_digits: '0,5' },
                    errorMessage: 'Il totale spesa non è valido',
                }
            },
            descrizione: {
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