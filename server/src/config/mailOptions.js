var mailOptions = {
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASSWORD
    },
    receiver: process.env.MAIL_RECEIVER
}

module.exports = { mailOptions }