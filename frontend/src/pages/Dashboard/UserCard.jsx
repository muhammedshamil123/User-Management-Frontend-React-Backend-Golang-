import React, { useState } from 'react';
import axios from 'axios';
import './usercard.css'
const UserCard = ({ user, fetchUsers }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/admin/deleteUser/${user.email}`);
            fetchUsers();
            setIsModalOpen(false); // Close the modal after successful deletion
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://localhost:8080/admin/updateUser/${user.email}`, editedUser);
            setIsEditing(false);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser({ ...user });
    };

    const openDeleteModal = () => {
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="user-card">
            {isEditing ? (
                <div className="edit-form">
                    <div className="inputs">
                        <input
                            type="text"
                            name="name"
                            value={editedUser.name}
                            onChange={handleInputChange}
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                        <input
                            type="password"
                            name="password"
                            value={editedUser.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                        />
                    </div>
                    <div className="buttons">
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="details">
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                    </div>
                    <div className="buttons">
                        <button className="edit" onClick={handleEdit}>Edit</button>
                        <button className="delete" onClick={openDeleteModal}>Delete</button>
                    </div>
                </>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Confirm Deletion</h4>
                        <p>Are you sure you want to delete this user?</p>
                        <div className="modal-buttons">
                            <button className="confirm" onClick={handleDelete}>Yes, Delete</button>
                            <button className="cancel" onClick={closeDeleteModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserCard;
