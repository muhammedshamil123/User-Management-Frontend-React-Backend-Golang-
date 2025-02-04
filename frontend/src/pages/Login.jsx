// Login.jsx
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import './auth.css';

const Login = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          console.log(decoded)
          if(role==="user"&&decoded.role==="user"){
            navigate("/user/home");
          }
          if(role==="admin" && decoded.role==="admin") {
            navigate("/admin/dashboard")
          } 
        }
      }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/${role}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data)
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        localStorage.setItem("userDetails", JSON.stringify(data.userDetails));
        if (role==='user') {
          navigate(`/${role}/home`);
        }else{
          navigate(`/${role}/dashboard`);
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{role === 'user' ? 'User Login' : 'Admin Login'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p>
          {role === 'user'
            ? 'Not a user? Register here.'
            : 'Not an admin? Register here.'}
        </p>
        <a href={`/${role}/register`}>Register</a>
      </div>
    </div>
  );
};

export default Login;
