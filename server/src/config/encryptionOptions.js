var encryptionOptions = {
    saltRounds: parseInt(process.env.ENCRYPTION_SALTROUNDS),
}

module.exports = { encryptionOptions }
