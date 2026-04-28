import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // Uses HTTPS in prod
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
    const { username, rollNo, password, role } = req.body;

    try {
        const userExists = await User.findOne({ rollNo });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userRole = role || 'student'; // Force student if not specified

        const user = await User.create({
            username,
            rollNo,
            password,
            role: userRole
        });

        if (user) {
            const token = generateToken(user._id, user.role);
            setTokenCookie(res, token);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                rollNo: user.rollNo,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get cookie
// @route   POST /api/auth/login
export const authUser = async (req, res) => {
    const { rollNo, password } = req.body;

    try {
        const user = await User.findOne({ rollNo });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id, user.role);
            setTokenCookie(res, token);
            res.json({
                _id: user._id,
                username: user.username,
                rollNo: user.rollNo,
                role: user.role
            });
        } else {
            res.status(401).json({ message: 'Invalid roll number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    // req.user is populated by protect middleware
    if (req.user) {
        res.json({
            _id: req.user._id,
            username: req.user.username,
            rollNo: req.user.rollNo,
            role: req.user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
