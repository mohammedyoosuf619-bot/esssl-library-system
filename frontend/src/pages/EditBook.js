import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publicationYear: new Date().getFullYear(),
    category: 'Computer Science',
    description: '',
    edition: '',
    totalCopies: 1,
    availableCopies: 1,
    location: { shelf: '', row: '' },
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Computer Science', 'Engineering', 'Mathematics', 'Physics',
    'Chemistry', 'Biology', 'Literature', 'History', 'Economics',
    'Management', 'Other'
  ];

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${id}`);
      const book = response.data;
      setFormData({
        isbn: book.isbn || '',
        title: book.title || '',
        author: book.author || '',
        publisher: book.publisher || '',
        publicationYear: book.publicationYear || new Date().getFullYear(),
        category: book.category || 'Computer Science',
        description: book.description || '',
        edition: book.edition || '',
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1,
        location: book.location || { shelf: '', row: '' },
        tags: book.tags ? book.tags.join(', ') : ''
      });
    } catch (error) {
      console.error('Error fetching book:', error);
      setError('Error loading book details');
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, formData);
      navigate('/books');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating book');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Edit Book</h1>
      
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
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
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
            <label>Available Copies</label>
            <input
              type="number"
              name="availableCopies"
              value={formData.availableCopies}
              onChange={handleChange}
              min="0"
              max={formData.totalCopies}
            />
            <small style={{ color: 'var(--gray)' }}>
              Cannot exceed total copies ({formData.totalCopies})
            </small>
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Book'}
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

export default EditBook;