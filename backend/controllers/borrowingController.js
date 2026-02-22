const Borrowing = require('../models/Borrowing');
const Book = require('../models/Book');
const User = require('../models/User');

const issueBook = async (req, res) => {
    try {
        const { bookId, studentId, dueDate } = req.body;
        
        const book = await Book.findById(bookId);
        if (!book || !book.isActive) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        if (book.availableCopies < 1) {
            return res.status(400).json({ message: 'No copies available' });
        }
        
        const student = await User.findOne({ studentId, role: 'student' });
        if (!student || !student.isActive) {
            return res.status(404).json({ message: 'Student not found or inactive' });
        }
        
        // Check if student already has 3 books
        const activeBorrowings = await Borrowing.countDocuments({
            student: student._id,
            status: { $in: ['active', 'overdue'] }
        });
        
        if (activeBorrowings >= 3) {
            return res.status(400).json({ message: 'Student already has 3 books issued' });
        }
        
        const borrowing = await Borrowing.create({
            book: bookId,
            student: student._id,
            borrowedBy: req.user._id,
            dueDate: new Date(dueDate)
        });
        
        book.availableCopies -= 1;
        await book.save();
        
        student.borrowedBooks.push(borrowing._id);
        await student.save();
        
        const populatedBorrowing = await Borrowing.findById(borrowing._id)
            .populate('book', 'title isbn author')
            .populate('student', 'name studentId email')
            .populate('borrowedBy', 'name');
        
        res.status(201).json(populatedBorrowing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const returnBook = async (req, res) => {
    try {
        const borrowing = await Borrowing.findById(req.params.id);
        
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing record not found' });
        }
        
        if (borrowing.status === 'returned') {
            return res.status(400).json({ message: 'Book already returned' });
        }
        
        const fine = borrowing.calculateFine();
        if (fine > 0) {
            borrowing.fine.amount = fine;
            borrowing.status = 'overdue';
        }
        
        borrowing.returnDate = new Date();
        borrowing.status = 'returned';
        await borrowing.save();
        
        const book = await Book.findById(borrowing.book);
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }
        
        const student = await User.findById(borrowing.student);
        if (student) {
            student.borrowedBooks = student.borrowedBooks.filter(
                id => id.toString() !== borrowing._id.toString()
            );
            await student.save();
        }
        
        const updatedBorrowing = await Borrowing.findById(borrowing._id)
            .populate('book', 'title isbn author')
            .populate('student', 'name studentId email');
        
        res.json(updatedBorrowing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBorrowings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        let filter = {};
        
        if (req.user.role === 'student') {
            filter.student = req.user._id;
        }
        
        if (req.query.status) {
            filter.status = req.query.status;
        }
        
        if (req.query.studentId && req.user.role === 'librarian') {
            const student = await User.findOne({ studentId: req.query.studentId });
            if (student) {
                filter.student = student._id;
            }
        }
        
        const borrowings = await Borrowing.find(filter)
            .populate('book', 'title isbn author category')
            .populate('student', 'name studentId email department')
            .populate('borrowedBy', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Borrowing.countDocuments(filter);
        
        res.json({
            borrowings,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBorrowingStats = async (req, res) => {
    try {
        const totalBooks = await Book.countDocuments({ isActive: true });
        const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
        const activeBorrowings = await Borrowing.countDocuments({ status: 'active' });
        const overdueBorrowings = await Borrowing.countDocuments({ status: 'overdue' });
        
        const popularBooks = await Borrowing.aggregate([
            { $group: { _id: "$book", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: "books", localField: "_id", foreignField: "_id", as: "book" } },
            { $unwind: "$book" },
            { $project: { title: "$book.title", author: "$book.author", count: 1 } }
        ]);
        
        res.json({
            totalBooks,
            totalStudents,
            activeBorrowings,
            overdueBorrowings,
            popularBooks
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { issueBook, returnBook, getBorrowings, getBorrowingStats };