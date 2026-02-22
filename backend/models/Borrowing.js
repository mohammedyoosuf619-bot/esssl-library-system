const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: Date,
    status: { 
        type: String, 
        enum: ['active', 'returned', 'overdue'], 
        default: 'active' 
    },
    fine: {
        amount: { type: Number, default: 0 },
        paid: { type: Boolean, default: false }
    },
    renewals: { type: Number, default: 0 }
});

borrowingSchema.methods.calculateFine = function() {
    if (this.status === 'returned') return 0;
    const today = new Date();
    const due = new Date(this.dueDate);
    if (today > due) {
        const daysOverdue = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
        return daysOverdue * 10;
    }
    return 0;
};

module.exports = mongoose.model('Borrowing', borrowingSchema);