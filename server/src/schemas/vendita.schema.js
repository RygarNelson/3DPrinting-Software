'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            data_vendita: {
                optional: true,
                isISO8601: {
                    errorMessage: 'La data di vendita non è valida',
                },
                toDate: true
            },
            data_scadenza: {
                optional: true,
                isISO8601: {
                    errorMessage: 'La data di scadenza non è valida',
                },
                toDate: true
            },
            cliente_id: {
                optional: true,
                isInt: {
                    errorMessage: 'Il cliente_id deve essere un intero',
                },
                toInt: true
            },
            totale_vendita: {
                optional: true,
                isDecimal: {
                    options: { decimal_digits: '0,5' },
                    errorMessage: 'Il totale vendita deve essere un decimale',
                }
            },
            'dettagli': {
                optional: true,
                isArray: {
                    errorMessage: 'I dettagli devono essere un array',
                }
            },
            'dettagli.*.modello_id': {
                optional: true,
                isInt: {
                    errorMessage: 'Il modello_id deve essere un intero',
                },
                toInt: true
            },
            'dettagli.*.quantita': {
                optional: true,
                isDecimal: {
                    options: { decimal_digits: '0,4' },
                    errorMessage: 'La quantita deve essere un decimale con 4 cifre decimali',
                }
            },
            'dettagli.*.prezzo': {
                optional: true,
                isDecimal: {
                    options: { decimal_digits: '0,5' },
                    errorMessage: 'Il prezzo deve essere un decimale con 5 cifre decimali',
                }
            }
        });
    }
};

export default validationSchema; 