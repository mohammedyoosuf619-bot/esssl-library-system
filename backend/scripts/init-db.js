const mongoose = require('mongoose');
const User = require('../models/User');
const Book = require('../models/Book');
require('dotenv').config();

const initDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');
        
        // Clear existing data
        await User.deleteMany({});
        await Book.deleteMany({});
        
        // Create librarian
        const librarian = await User.create({
            studentId: 'LIB001',
            name: 'John Doe',
            email: 'librarian@esssl.edu',
            password: 'admin123',
            role: 'librarian',
            contactNumber: '0771234567'
        });
        console.log('✅ Librarian created');
        
        // Create sample students
        const students = await User.create([
            {
                studentId: 'STU001',
                name: 'Alice Johnson',
                email: 'alice@esssl.edu',
                password: 'student123',
                role: 'student',
                department: 'Computer Science',
                semester: 3,
                contactNumber: '0772345678',
                address: '123 Main St'
            },
            {
                studentId: 'STU002',
                name: 'Bob Smith',
                email: 'bob@esssl.edu',
                password: 'student123',
                role: 'student',
                department: 'Engineering',
                semester: 5,
                contactNumber: '0773456789',
                address: '456 Park Ave'
            },
            {
                studentId: 'STU003',
                name: 'Carol White',
                email: 'carol@esssl.edu',
                password: 'student123',
                role: 'student',
                department: 'Mathematics',
                semester: 2,
                contactNumber: '0774567890',
                address: '789 Oak Rd'
            }
        ]);
        console.log('✅ Sample students created');
        
        // Create sample books
        const books = await Book.create([
            {
                isbn: '978-0132350884',
                title: 'Clean Code',
                author: 'Robert C. Martin',
                publisher: 'Prentice Hall',
                publicationYear: 2008,
                category: 'Computer Science',
                description: 'A handbook of agile software craftsmanship',
                edition: '1st',
                totalCopies: 5,
                availableCopies: 5,
                location: { shelf: 'A1', row: '1' },
                tags: ['programming', 'software development'],
                addedBy: librarian._id
            },
            {
                isbn: '978-1593275846',
                title: 'Eloquent JavaScript',
                author: 'Marijn Haverbeke',
                publisher: 'No Starch Press',
                publicationYear: 2018,
                category: 'Computer Science',
                description: 'Modern JavaScript programming',
                edition: '3rd',
                totalCopies: 3,
                availableCopies: 3,
                location: { shelf: 'A1', row: '2' },
                tags: ['javascript', 'web development'],
                addedBy: librarian._id
            },
            {
                isbn: '978-0201633610',
                title: 'Design Patterns',
                author: 'Erich Gamma',
                publisher: 'Addison-Wesley',
                publicationYear: 1994,
                category: 'Computer Science',
                description: 'Elements of reusable object-oriented software',
                edition: '1st',
                totalCopies: 2,
                availableCopies: 2,
                location: { shelf: 'B1', row: '1' },
                tags: ['design patterns', 'oop'],
                addedBy: librarian._id
            },
            {
                isbn: '978-0131103627',
                title: 'The C Programming Language',
                author: 'Brian Kernighan',
                publisher: 'Prentice Hall',
                publicationYear: 1988,
                category: 'Computer Science',
                description: 'Classic C programming book',
                edition: '2nd',
                totalCopies: 4,
                availableCopies: 4,
                location: { shelf: 'A2', row: '1' },
                tags: ['c', 'programming'],
                addedBy: librarian._id
            }
        ]);
        console.log('✅ Sample books created');
        
        console.log('\n🎉 Database initialized successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('Librarian: librarian@esssl.edu / admin123');
        console.log('Students: alice@esssl.edu / student123');
        console.log('          bob@esssl.edu / student123');
        console.log('          carol@esssl.edu / student123');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
};

initDB();