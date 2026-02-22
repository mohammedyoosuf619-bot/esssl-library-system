import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Books = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    'Computer Science', 'Engineering', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'Literature', 'History', 'Economics',
    'Management', 'Other'
  ];

  useEffect(() => {
    fetchBooks();
  }, [page, category, searchTerm]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category) params.category = category;
      if (searchTerm) params.search = searchTerm;
      
      const response = await axios.get('http://localhost:5000/api/books', { params });
      setBooks(response.data.books);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBooks();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Books Collection</h1>
        {user.role === 'librarian' && (
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/books/add')}
          >
            + Add New Book
          </button>
        )}
      </div>

      <div className="card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <>
          <div className="grid">
            {books.map(book => (
              <div key={book._id} className="card">
                <div style={{ fontSize: '48px', textAlign: 'center' }}>📘</div>
                <h3>{book.title}</h3>
                <p style={{ color: 'var(--gray)' }}>by {book.author}</p>
                <p>ISBN: {book.isbn}</p>
                <p>Category: {book.category}</p>
                <p>Available: {book.availableCopies}/{book.totalCopies}</p>
                {user.role === 'librarian' ? (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn btn-warning"
                      onClick={() => navigate(`/books/edit/${book._id}`)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(book._id)}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  book.availableCopies > 0 && (
                    <button 
                      className="btn btn-success"
                      onClick={() => navigate('/borrowings/issue', { state: { book } })}
                    >
                      Borrow
                    </button>
                  )
                )}
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
              <button 
                className="btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button 
                className="btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Books;