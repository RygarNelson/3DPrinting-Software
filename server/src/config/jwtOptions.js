const secret = process.env.JWT_SECRET;
const jwtOptions = {
    expiresIn: process.env.JWT_EXPIRESIN
};

export { secret, jwtOptions };
