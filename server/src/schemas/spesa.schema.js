'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            data_spesa: {
                optional: false,
                isISO8601: {
                    errorMessage: 'La data spesa non è valida',
                },
                toDate: true
            },
            totale_spesa: {
                optional: false,
                isDecimal: {
                    options: { decimal_digits: '0,5' },
                    errorMessage: 'Il totale spesa non è valido',
                }
            },
            descrizione: {
                optional: false,
                isLength: {
                    options: { max: 500 },
                    errorMessage: 'La descrizione non può superare i 500 caratteri'
                }
            },
            quantita: {
                optional: false,
                isDecimal: {
                    options: { decimal_digits: '0,4' },
                    errorMessage: 'La quantità non è valida',
                }
            },
            tipo_spesa: {
                optional: false,
                isInt: {
                    errorMessage: 'Il tipo spesa non è valido',
                }
            },
            unita_misura: {
                optional: false,
                isInt: {
                    errorMessage: 'L\'unità di misura non è valida',
                }
            }
        });
    }
};

export default validationSchema;