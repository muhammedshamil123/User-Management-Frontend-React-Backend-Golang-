import React from 'react';

const SearchBar = ({ setSearchTerm }) => {
    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by name or email....."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
