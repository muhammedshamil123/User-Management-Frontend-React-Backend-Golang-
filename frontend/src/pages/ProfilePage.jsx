import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './profile.css';

const ProfilePage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(localStorage.getItem("userDetails"));
      setUserName(decoded?.name || "User");
      setEmail(decoded?.email || "user@example.com");
      setImage(decoded?.image || null);  
    } else {
      navigate("/user/login");
    }
  }, [navigate]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch(`http://localhost:8080/user/uploadImage/${email}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setImage(data.image); 
        localStorage.setItem("userDetails", JSON.stringify({ ...data.user, image: data.image }));
      } else {
        alert("Image upload failed");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userDetails");
    navigate("/user/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>User Profile</h2>
      </div>

      <div className="profile-details">
        <div className="profile-image">
          {image ? (
            <img src={image} alt="Profile" />
          ) : (
            <div className="placeholder-image">No Image</div>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <div className="user-info">
          <p><strong>Name:</strong> {userName}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfilePage;
