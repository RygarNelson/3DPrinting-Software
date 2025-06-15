var secret = process.env.JWT_SECRET
var jwtOptions = {
    expiresIn: process.env.JWT_EXPIRESIN
}

module.exports = { secret, jwtOptions }
