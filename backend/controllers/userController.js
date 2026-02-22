const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const filter = {};
        
        if (req.query.role) {
            filter.role = req.query.role;
        }
        
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { studentId: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        const users = await User.find(filter)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await User.countDocuments(filter);
        
        res.json({
            users,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Only librarians can update other users
        if (req.user.role !== 'librarian' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const { name, email, department, semester, contactNumber, address, isActive } = req.body;
        
        user.name = name || user.name;
        user.email = email || user.email;
        user.department = department || user.department;
        user.semester = semester || user.semester;
        user.contactNumber = contactNumber || user.contactNumber;
        user.address = address || user.address;
        
        if (isActive !== undefined && req.user.role === 'librarian') {
            user.isActive = isActive;
        }
        
        await user.save();
        
        res.json({
            _id: user._id,
            studentId: user.studentId,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            semester: user.semester,
            contactNumber: user.contactNumber,
            address: user.address,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getUsers, getUserById, updateUser };