const encryptionOptions = {
    saltRounds: parseInt(process.env.ENCRYPTION_SALTROUNDS),
};

export { encryptionOptions };
