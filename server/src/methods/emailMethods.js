const nodemailer = require('nodemailer')

const { mailOptions } = require('../config/mailOptions')

const transporter = nodemailer.createTransport({
    service: mailOptions.service,
    auth: mailOptions.auth
})

module.exports = {
    composeMessage: function (req) {
        return '<div>message<div>'      
    },
    notifyMail: function (subject, text) {
        let message = {
            from: '',
            to: mailOptions.receiver,
            subject: subject,
            html: text
        };
        try {
            return transporter.sendMail(message)
        } catch (error) {
            console.log(error)
            return null
        }
    }
}