import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import Profile from './pages/Profile';
import Borrowings from './pages/Borrowings';
import IssueBook from './pages/IssueBook';
import Reports from './pages/Reports';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
            <Route path="/books/add" element={<PrivateRoute librarianOnly><AddBook /></PrivateRoute>} />
            <Route path="/books/edit/:id" element={<PrivateRoute librarianOnly><EditBook /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute librarianOnly><Users /></PrivateRoute>} />
            <Route path="/users/add" element={<PrivateRoute librarianOnly><AddUser /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/borrowings" element={<PrivateRoute><Borrowings /></PrivateRoute>} />
            <Route path="/borrowings/issue" element={<PrivateRoute librarianOnly><IssueBook /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute librarianOnly><Reports /></PrivateRoute>} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;