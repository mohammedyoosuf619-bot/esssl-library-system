import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page, role, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (role) params.role = role;
      if (searchTerm) params.search = searchTerm;
      
      const response = await axios.get('http://localhost:5000/api/users', { params });
      setUsers(response.data.users);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        isActive: !currentStatus
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>User Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/users/add')}
        >
          + Add New User
        </button>
      </div>

      <div className="card">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by name, email, or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="librarian">Librarian</option>
            <option value="student">Student</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.studentId || '-'}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-${user.role === 'librarian' ? 'warning' : 'success'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.department || '-'}</td>
                  <td>{user.semester || '-'}</td>
                  <td>{user.contactNumber}</td>
                  <td>
                    <span className={`badge badge-${user.isActive ? 'success' : 'danger'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className={`btn btn-${user.isActive ? 'warning' : 'success'}`}
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      style={{ marginRight: '5px' }}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
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

export default Users;