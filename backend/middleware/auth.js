const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            if (!req.user.isActive) {
                return res.status(401).json({ message: 'Account deactivated' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'No token provided' });
    }
};

const librarian = (req, res, next) => {
    if (req.user && req.user.role === 'librarian') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Librarian only.' });
    }
};

module.exports = { protect, librarian };