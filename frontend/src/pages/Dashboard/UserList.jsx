import React, { useState } from 'react';
import UserCard from './UserCard';

const UserList = ({ users, fetchUsers }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = users.slice(startIndex, endIndex);

    const totalPages = Math.ceil(users.length / itemsPerPage);

    // Handle page navigation
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="user-list">
            <div className="user-cards">
                {currentUsers.map((user) => (
                    <UserCard key={user.id} user={user} fetchUsers={fetchUsers} />
                ))}
            </div>
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default UserList;
