import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import "../style/Sidebar.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); // State to toggle sidebar visibility
  const navigate = useNavigate(); // Hook for navigation

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle sidebar visibility
  };

  return (
    <div>
      {/* Button to open the sidebar */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar container */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Admin</h2>
          {/* Button to close the sidebar */}
          <button className="close-btn" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/UserManagement")}>User Management</li>
          <li onClick={() => navigate("/MaterialManagement")}>Material Management</li>
          <li onClick={() => navigate("/")}>Logout</li>
          <li onClick={() => navigate("/AdminOrders")}>AdminOrders</li>

        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
