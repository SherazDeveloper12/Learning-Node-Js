const jwt = require('jsonwebtoken');
const authverify = (req, res, next) => {
   try {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Login Required' });
    }
    const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({ message: 'Login Required' });
    }
    console.log('Decoded JWT:', decoded);
    req.body.user = decoded;
    next();
    
   } catch (error) {
    res.status(401).json({ message: error.message });
   }
};
module.exports = { authverify };