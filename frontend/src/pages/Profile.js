import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    contactNumber: user.contactNumber || '',
    address: user.address || '',
    department: user.department || '',
    semester: user.semester || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        setLoading(false);
        return;
      }
      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
        setLoading(false);
        return;
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        contactNumber: formData.contactNumber,
        address: formData.address
      };

      if (user.role === 'student') {
        updateData.department = formData.department;
        updateData.semester = formData.semester;
      }

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
      }

      const response = await axios.put('http://localhost:5000/api/auth/profile', updateData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error updating profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1>My Profile</h1>
      
      <div className="card">
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          {user.role === 'student' && (
            <>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  min="1"
                  max="8"
                />
              </div>
            </>
          )}

          <h3>Change Password</h3>
          <p style={{ color: 'var(--gray)', fontSize: '14px', marginBottom: '15px' }}>
            Leave blank if you don't want to change password
          </p>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;