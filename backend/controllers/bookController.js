const Book = require('../models/Book');

const addBook = async (req, res) => {
    try {
        const { isbn, title, author, publisher, publicationYear, category, totalCopies, location, description, edition, tags } = req.body;
        
        const bookExists = await Book.findOne({ isbn });
        if (bookExists) {
            return res.status(400).json({ message: 'Book with this ISBN already exists' });
        }
        
        const book = await Book.create({
            isbn,
            title,
            author,
            publisher,
            publicationYear,
            category,
            description,
            edition,
            totalCopies,
            availableCopies: totalCopies,
            location,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            addedBy: req.user._id
        });
        
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const filter = { isActive: true };
        
        if (req.query.category) {
            filter.category = req.query.category;
        }
        
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        
        if (req.query.author) {
            filter.author = { $regex: req.query.author, $options: 'i' };
        }
        
        const books = await Book.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        
        const total = await Book.countDocuments(filter);
        
        res.json({
            books,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        const { totalCopies, ...updateData } = req.body;
        
        if (totalCopies !== undefined) {
            const difference = totalCopies - book.totalCopies;
            book.availableCopies += difference;
            book.totalCopies = totalCopies;
        }
        
        Object.assign(book, updateData);
        await book.save();
        
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        book.isActive = false;
        await book.save();
        
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addBook, getBooks, getBookById, updateBook, deleteBook };