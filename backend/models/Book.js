const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publisher: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Computer Science', 'Engineering', 'Mathematics', 'Physics', 
               'Chemistry', 'Biology', 'Literature', 'History', 'Economics', 
               'Management', 'Other']
    },
    description: String,
    edition: String,
    totalCopies: { type: Number, required: true, min: 1 },
    availableCopies: { type: Number, required: true, min: 0 },
    location: {
        shelf: String,
        row: String
    },
    coverImage: { type: String, default: 'default-book.png' },
    tags: [String],
    isActive: { type: Boolean, default: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);