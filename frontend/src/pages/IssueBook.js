import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const IssueBook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedBook = location.state?.book;

  const [formData, setFormData] = useState({
    bookId: selectedBook?._id || '',
    studentId: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });
  
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooks();
    fetchStudents();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books?available=true&limit=100');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users?role=student&isActive=true&limit=100');
      setStudents(response.data.users);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/borrowings/issue', formData);
      navigate('/borrowings');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>Issue Book</h1>
      
      <div className="card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Book *</label>
            <select name="bookId" value={formData.bookId} onChange={handleChange} required>
              <option value="">Choose a book</option>
              {books.map(book => (
                <option key={book._id} value={book._id}>
                  {book.title} by {book.author} (Available: {book.availableCopies})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Student ID *</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              required
            />
            <small style={{ color: 'var(--gray)' }}>
              Enter student ID (e.g., STU001, STU002)
            </small>
          </div>

          <div className="form-group">
            <label>Due Date *</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Issuing...' : 'Issue Book'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/borrowings')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBook;