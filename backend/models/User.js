const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    studentId: { 
        type: String, 
        unique: true, 
        sparse: true,
        required: function() { return this.role === 'student'; }
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['librarian', 'student'], 
        default: 'student' 
    },
    department: { 
        type: String,
        required: function() { return this.role === 'student'; }
    },
    semester: { 
        type: Number,
        required: function() { return this.role === 'student'; }
    },
    contactNumber: { type: String, required: true },
    address: String,
    profilePicture: { type: String, default: 'default-avatar.png' },
    isActive: { type: Boolean, default: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Borrowing' }],
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);