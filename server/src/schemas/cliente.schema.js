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
                },
                custom: {
                    options: (value, { req }) => {
                        const nome = req.body.nome ? req.body.nome.trim() : '';
                        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
                        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
                        if (!nome && !cognome && !ragione_sociale) {
                            throw new Error('Almeno uno tra Nome, Cognome o Ragione Sociale deve essere valorizzato');
                        }
                        else if (!nome && cognome) {
                            throw new Error('Il nome deve essere valorizzato se e\' valorizzato il cognome');
                        }
                        return true;
                    }
                }
            },
            cognome: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'Il cognome non può superare i 60 caratteri'
                },
                custom: {
                    options: (value, { req }) => {
                        const nome = req.body.nome ? req.body.nome.trim() : '';
                        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
                        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
                        if (!nome && !cognome && !ragione_sociale) {
                            throw new Error('Almeno uno tra Nome, Cognome o Ragione Sociale deve essere valorizzato');
                        }
                        else if (nome && !cognome) {
                            throw new Error('Il cognome deve essere valorizzato se e\' valorizzato il nome');
                        }
                        return true;
                    }
                }
            },
            ragione_sociale: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 60 },
                    errorMessage: 'La ragione sociale non può superare i 60 caratteri'
                },
                custom: {
                    options: (value, { req }) => {
                        const nome = req.body.nome ? req.body.nome.trim() : '';
                        const cognome = req.body.cognome ? req.body.cognome.trim() : '';
                        const ragione_sociale = req.body.ragione_sociale ? req.body.ragione_sociale.trim() : '';
                        if (!nome && !cognome && !ragione_sociale) {
                            throw new Error('Almeno uno tra Nome, Cognome o Ragione Sociale deve essere valorizzato');
                        }
                        return true;
                    }
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
                    if: (value) => value !== undefined && value !== null && value !== '',
                    errorMessage: 'Il campo Email non è valido'
                }
            },
            telefono: {
                escape: true,
                optional: true,
                isLength: {
                    options: { max: 50 },
                    errorMessage: 'Il telefono non può superare i 50 caratteri'
                }
            },
        });
    }
};

export default validationSchema; 