'use strict'

import { checkSchema } from 'express-validator';

const validationSchema = {
    check: function() {
        return checkSchema({
            nome_proprietario: {
                escape: true,
                optional: false,
                notEmpty: {
                    errorMessage: 'Il campo Nome Proprietario non è valido'
                },
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'Il nome proprietario non può superare i 60 caratteri'
                }
            },
            cognome_proprietario: {
                escape: true,
                optional: false,
                notEmpty: {
                    errorMessage: 'Il campo Cognome Proprietario non è valido'
                },
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'Il cognome proprietario non può superare i 60 caratteri'
                }
            },
            iban: {
                escape: true,
                optional: false,
                notEmpty: {
                    errorMessage: 'Il campo IBAN non è valido'
                },
                isLength: {
                    options: { max: 27 },
                    errorMessage: 'Il campo IBAN non può superare i 27 caratteri'
                }
            }
        });
    }
};

export default validationSchema;