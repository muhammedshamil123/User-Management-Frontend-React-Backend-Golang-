import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');

    // Navigate to the login page
    navigate('/admin/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 70px',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  logoutButton: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#ff4b5c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Navbar;
