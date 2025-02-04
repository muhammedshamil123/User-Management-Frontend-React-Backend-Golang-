import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./pages/Dashboard/Dasboard";
function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/user/login" element={<Login role="user" />} />
        <Route path="/user/register" element={<Register role="user" />} />
        <Route path="/user/home" element={<HomePage />} />
        <Route path="/user/profile" element={<ProfilePage />} />


        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login role="admin" />} />
        <Route path="/admin/register" element={<Register role="admin" />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;