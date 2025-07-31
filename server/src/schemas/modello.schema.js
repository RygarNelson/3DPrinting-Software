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
            },
            tipo: {
                escape: true,
                optional: false,
                isInt: {
                    errorMessage: 'Il tipo non è valido'
                }
            },
            basetta_dimensione: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 500 },
                    errorMessage: 'La dimensione della basetta non può superare i 500 caratteri'
                }
            },
            basetta_quantita: {
                escape: true,
                optional: true,
                isInt: {
                    errorMessage: 'La quantità di basette non è valida'
                }
            },
            vinted_vendibile: {
                escape: true,
                optional: false,
                isBoolean: {
                    errorMessage: 'Il campo Vinted Vendibile non è valido'
                }
            },
            vinted_is_in_vendita: {
                escape: true,
                optional: false,
                isBoolean: {
                    errorMessage: 'Il campo Vinted Is In Vendita non è valido'
                }
            }
        });
    }
};

export default validationSchema;