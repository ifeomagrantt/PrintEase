// auth middleware using JWT for route protection

const jwt = require('jsonwebtoken'); 

module.exports = (req, res, next) => {
    try {
        // Expecting format: Authorization: 'Bearer TOKEN'
        const token = req.headers.authorization?.split(' ')[1]; 

        if (!token) {
            throw new Error('Authentication Failed!');
        }

        // Decode token using the secret
        const decodedToken = jwt.verify(token, "secret_key_do_not_share");

        // Attach the user data from the token to the request
        req.userData = { userId: decodedToken.userId }; 

        // Continue with the request
        next();

    } catch (err) {
        return res.status(401).json({ message: 'Authentication Failed!' });
    }
}
