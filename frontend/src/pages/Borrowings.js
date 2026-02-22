import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Borrowings = () => {
  const { user } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBorrowings();
  }, [page, filter]);

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filter !== 'all') params.status = filter;
      
      const response = await axios.get('http://localhost:5000/api/borrowings', { params });
      setBorrowings(response.data.borrowings);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching borrowings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Confirm book return?')) {
      try {
        await axios.put(`http://localhost:5000/api/borrowings/return/${id}`);
        fetchBorrowings();
      } catch (error) {
        console.error('Error returning book:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const classes = {
      active: 'badge-success',
      returned: 'badge-warning',
      overdue: 'badge-danger'
    };
    return classes[status] || 'badge';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Borrowings</h1>
        {user.role === 'librarian' && (
          <button className="btn btn-primary" onClick={() => window.location.href = '/borrowings/issue'}>
            + Issue New Book
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="all">All Borrowings</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading borrowings...</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Student</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Fine</th>
                {user.role === 'librarian' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {borrowings.map(borrowing => (
                <tr key={borrowing._id}>
                  <td>
                    <strong>{borrowing.book?.title}</strong><br />
                    <small>{borrowing.book?.author}</small>
                  </td>
                  <td>
                    {borrowing.student?.name}<br />
                    <small>{borrowing.student?.studentId}</small>
                  </td>
                  <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                  <td>{new Date(borrowing.dueDate).toLocaleDateString()}</td>
                  <td>
                    {borrowing.returnDate 
                      ? new Date(borrowing.returnDate).toLocaleDateString() 
                      : '-'}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(borrowing.status)}`}>
                      {borrowing.status}
                    </span>
                  </td>
                  <td>
                    {borrowing.fine?.amount > 0 && (
                      <span style={{ color: 'var(--danger)' }}>
                        Rs. {borrowing.fine.amount}
                      </span>
                    )}
                  </td>
                  {user.role === 'librarian' && (
                    <td>
                      {borrowing.status === 'active' && (
                        <button 
                          className="btn btn-success"
                          onClick={() => handleReturn(borrowing._id)}
                        >
                          Return
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

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

export default Borrowings;