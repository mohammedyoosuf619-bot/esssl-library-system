const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                studentId: user.studentId,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                semester: user.semester,
                contactNumber: user.contactNumber,
                profilePicture: user.profilePicture,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { studentId, name, email, password, department, semester, contactNumber, address } = req.body;
        
        const userExists = await User.findOne({ $or: [{ email }, { studentId }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = await User.create({
            studentId,
            name,
            email,
            password,
            role: 'student',
            department,
            semester,
            contactNumber,
            address
        });
        
        res.status(201).json({
            _id: user._id,
            studentId: user.studentId,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            semester: user.semester,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.contactNumber = req.body.contactNumber || user.contactNumber;
            user.address = req.body.address || user.address;
            
            if (req.body.password) {
                user.password = req.body.password;
            }
            
            if (user.role === 'student') {
                user.department = req.body.department || user.department;
                user.semester = req.body.semester || user.semester;
            }
            
            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                studentId: updatedUser.studentId,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                department: updatedUser.department,
                semester: updatedUser.semester,
                contactNumber: updatedUser.contactNumber,
                address: updatedUser.address,
                profilePicture: updatedUser.profilePicture
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, registerUser, updateProfile };