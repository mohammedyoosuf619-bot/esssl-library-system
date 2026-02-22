import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['librarian', 'student'] },
    { path: '/books', label: 'Books', icon: '📚', roles: ['librarian', 'student'] },
    { path: '/borrowings', label: 'Borrowings', icon: '📋', roles: ['librarian', 'student'] },
    { path: '/profile', label: 'Profile', icon: '👤', roles: ['librarian', 'student'] },
  ];

  const librarianMenu = [
    { path: '/users', label: 'Users', icon: '👥', roles: ['librarian'] },
    { path: '/books/add', label: 'Add Book', icon: '➕', roles: ['librarian'] },
    { path: '/borrowings/issue', label: 'Issue Book', icon: '📤', roles: ['librarian'] },
    { path: '/reports', label: 'Reports', icon: '📊', roles: ['librarian'] },
  ];

  const allMenuItems = [...menuItems, ...(user?.role === 'librarian' ? librarianMenu : [])];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{
        background: '#2c3e50',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>📚 ESSSL Library</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>Welcome, {user?.name} ({user?.role})</span>
          <button onClick={handleLogout} style={{
            padding: '8px 16px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        <aside style={{
          width: '250px',
          background: 'white',
          boxShadow: '2px 0 5px rgba(0,0,0,0.05)'
        }}>
          <ul style={{ listStyle: 'none', padding: '20px 0' }}>
            {allMenuItems.map(item => (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '12px 20px',
                  color: location.pathname === item.path ? '#667eea' : '#666',
                  cursor: 'pointer',
                  background: location.pathname === item.path ? 'rgba(102,126,234,0.1)' : 'transparent',
                  borderLeft: location.pathname === item.path ? '3px solid #667eea' : 'none'
                }}
              >
                <span style={{ marginRight: '10px' }}>{item.icon}</span> {item.label}
              </li>
            ))}
          </ul>
        </aside>

        <main style={{
          flex: 1,
          padding: '30px',
          background: '#f8f9fa'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;