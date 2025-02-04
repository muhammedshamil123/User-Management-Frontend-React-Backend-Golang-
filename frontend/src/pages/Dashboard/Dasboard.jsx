import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import CreateUserModal from './CreateUserModal';
import SearchBar from './Searchbar';
import './style.css'
import Navbar from './NavBar';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/dashboard'); 
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
        
            <Navbar />
            
            <div className="app-container">
                
                <div className="search">
                    <SearchBar setSearchTerm={setSearchTerm} />
                    <button onClick={() => setShowCreateUserModal(true)}>Create User</button>
                </div>
                <UserList
                    users={filteredUsers}
                    fetchUsers={fetchUsers}
                />
                {showCreateUserModal && <CreateUserModal setShowCreateUserModal={setShowCreateUserModal} fetchUsers={fetchUsers} />}
            </div>
        </>
    );
};

export default Dashboard;
