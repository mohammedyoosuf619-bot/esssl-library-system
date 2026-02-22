import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('circulation');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/borrowings/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    // In a real app, this would call an API to generate and download report
    alert(`Generating ${reportType} report for ${dateRange.start} to ${dateRange.end}`);
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div>
      <h1>Reports & Analytics</h1>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '30px' }}>
        <div className="card">
          <h3>Total Books</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats?.totalBooks}</p>
        </div>
        <div className="card">
          <h3>Total Students</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats?.totalStudents}</p>
        </div>
        <div className="card">
          <h3>Active Borrowings</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats?.activeBorrowings}</p>
        </div>
        <div className="card">
          <h3>Overdue Books</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--danger)' }}>
            {stats?.overdueBorrowings}
          </p>
        </div>
      </div>

      <div className="card">
        <h2>Generate Report</h2>
        
        <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
          <div className="form-group">
            <label>Report Type</label>
            <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
              <option value="circulation">Circulation Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="fines">Fines Collection Report</option>
              <option value="students">Student Activity Report</option>
              <option value="popular">Popular Books Report</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          <button className="btn btn-primary" onClick={generateReport}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Popular Books</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Book Title</th>
              <th>Author</th>
              <th>Times Borrowed</th>
            </tr>
          </thead>
          <tbody>
            {stats?.popularBooks?.map((book, index) => (
              <tr key={index}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;