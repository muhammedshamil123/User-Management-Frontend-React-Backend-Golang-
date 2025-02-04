import {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import './auth.css';

const HomePage = () => {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      if (token && decode.role=="user") {
        const decoded = JSON.parse(localStorage.getItem("userDetails"));
        setUserName(decoded?.name || "User");
      } else {
        navigate("/user/login");
      }
    }, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/user/login");
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <ul>
          <li>
            <button onClick={() => navigate("/user/profile")}>Profile</button>
          </li>
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </nav>

      <div className="welcome-message">
        <h1>Welcome, {userName}!</h1>
      </div>
    </div>
  );
};

export default HomePage;
