'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            data_vendita: {
                optional: false,
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
                optional: false,
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
                optional: false,
                isArray: {
                    errorMessage: 'I dettagli devono essere un array',
                }
            },
            'dettagli.*.modello_id': {
                optional: false,
                isInt: {
                    errorMessage: 'Il modello_id deve essere un intero',
                },
                toInt: true
            },
            'dettagli.*.quantita': {
                optional: false,
                isDecimal: {
                    options: { decimal_digits: '0,4' },
                    errorMessage: 'La quantita deve essere un decimale con 4 cifre decimali',
                }
            },
            'dettagli.*.prezzo': {
                optional: false,
                isDecimal: {
                    options: { decimal_digits: '0,5' },
                    errorMessage: 'Il prezzo deve essere un decimale con 5 cifre decimali',
                }
            },
            stato_spedizione: {
                optional: false,
                isInt: {
                    errorMessage: 'Lo stato spedizione deve essere un intero',
                },
                toInt: true
            },
            link_tracciamento: {
                optional: true,
                isLength: {
                    options: { max: 500 },
                    errorMessage: 'Il link tracciamento non può superare i 500 caratteri'
                }
            },
            'dettagli.*.stato_stampa': {
                optional: false,
                isInt: {
                    errorMessage: 'Lo stato stampa deve essere un intero',
                },
                toInt: true
            }
        });
    }
};

export default validationSchema; 