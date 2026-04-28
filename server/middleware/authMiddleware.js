import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'adminHead')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

export const adminHead = (req, res, next) => {
    if (req.user && req.user.role === 'adminHead') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin head' });
    }
};
