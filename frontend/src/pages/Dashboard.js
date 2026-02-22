import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentBorrowings, setRecentBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, borrowingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/borrowings/stats'),
        axios.get('http://localhost:5000/api/borrowings?limit=5')
      ]);
      
      setStats(statsRes.data);
      setRecentBorrowings(borrowingsRes.data.borrowings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      
      {user.role === 'librarian' && stats && (
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <div className="card">
            <h3>Total Books</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalBooks}</p>
          </div>
          <div className="card">
            <h3>Total Students</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.totalStudents}</p>
          </div>
          <div className="card">
            <h3>Active Borrowings</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.activeBorrowings}</p>
          </div>
          <div className="card">
            <h3>Overdue Books</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--danger)' }}>
              {stats.overdueBorrowings}
            </p>
          </div>
        </div>
      )}

      {user.role === 'student' && (
        <div className="card">
          <h3>Your Borrowings</h3>
          <p>Total books borrowed: {user.borrowedBooks?.length || 0}</p>
        </div>
      )}

      <div className="card">
        <h3>Recent Borrowings</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Book</th>
              <th>Student</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentBorrowings.map(borrowing => (
              <tr key={borrowing._id}>
                <td>{borrowing.book?.title}</td>
                <td>{borrowing.student?.name}</td>
                <td>{new Date(borrowing.borrowDate).toLocaleDateString()}</td>
                <td>{new Date(borrowing.dueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`badge badge-${borrowing.status === 'active' ? 'success' : 
                                                    borrowing.status === 'overdue' ? 'danger' : 'warning'}`}>
                    {borrowing.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;