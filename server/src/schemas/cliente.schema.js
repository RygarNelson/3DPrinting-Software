'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            nome: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'Il nome non può superare i 60 caratteri'
                }
            },
            cognome: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'Il cognome non può superare i 60 caratteri'
                }
            },
            ragione_sociale: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'La ragione sociale non può superare i 60 caratteri'
                }
            },
            email: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 255 },
                    errorMessage: 'L\'email non può superare i 255 caratteri'
                },
                isEmail: {
                    errorMessage: 'Il campo Email non è valido',
                    bail: true
                }
            },
            telefono: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 50 },
                    errorMessage: 'Il telefono non può superare i 50 caratteri'
                }
            }
        });
    }
};

export default validationSchema; 