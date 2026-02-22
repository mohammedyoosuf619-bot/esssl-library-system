import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    category: 'Computer Science',
    description: '',
    edition: 'First',
    totalCopies: 1,
    location: { shelf: '', row: '' },
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Computer Science', 'Engineering', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'Literature', 'History', 'Economics',
    'Management', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/books', formData);
      navigate('/books');
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Add New Book</h1>
      
      <div className="card">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ISBN *</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Author *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Publisher *</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Publication Year *</label>
            <input
              type="number"
              name="publicationYear"
              value={formData.publicationYear}
              onChange={handleChange}
              min="1000"
              max={new Date().getFullYear()}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Edition</label>
            <input
              type="text"
              name="edition"
              value={formData.edition}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Total Copies *</label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Shelf Location</label>
            <input
              type="text"
              name="location.shelf"
              value={formData.location.shelf}
              onChange={handleChange}
              placeholder="e.g., A1"
            />
          </div>

          <div className="form-group">
            <label>Row</label>
            <input
              type="text"
              name="location.row"
              value={formData.location.row}
              onChange={handleChange}
              placeholder="e.g., 1"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., programming, javascript"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Book'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/books')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;