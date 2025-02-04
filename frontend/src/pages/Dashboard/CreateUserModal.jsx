import React, { useState } from 'react';
import axios from 'axios';

const CreateUserModal = ({ setShowCreateUserModal, fetchUsers }) => {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const name=newUser.name
            const email=newUser.email
            const password=newUser.password
            const response = await fetch(`http://localhost:8080/admin/addUser`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({name,email,password}),
            });
      
            const data = await response.json();
            if (response.ok) {
                setShowCreateUserModal(false)
                fetchUsers();
            } else {
                setError(data.error || 'Registration failed');
            }
          } catch (err) {
            setError(err);
          }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Create New User</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        placeholder="password"
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" onClick={handleSubmit}>Create</button>
                    <button type="button" onClick={() => setShowCreateUserModal(false)}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
