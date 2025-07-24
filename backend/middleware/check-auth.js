const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];         

        if (!token) {
            throw new Error('Authentication Failed!');
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
        

        req.userData = {
            userId: decodedToken.userId,
            email: decodedToken.email,
            role: decodedToken.role 
        };

        next();
    } catch (err) {
        console.error('[AUTH ERROR]', err.message);
        return res.status(401).json({ message: 'Authentication Failed!' });
    }
}
