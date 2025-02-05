import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import "../style/Header.css"; // Import CSS

const Header = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    let role = localStorage.getItem("role")?.trim();

    if (!role) {
      alert("No role found! Logging out.");
      handleLogout();
      return;
    }

    switch (role) {
      case "Admin":
        navigate("/AdminDashboard");
        break;
      case "Designer":
        navigate("/DesignerDashboard");
        break;
      case "Billing":
        navigate("/BillingManagement");
        break;
      default:
        if (["UV", "Solvent", "Eco Solvent", "Flatbed", "Vinyl"].includes(role)) {
          navigate("/PrintingDashboard");
        } else {
          alert(`Role not recognized: ${role}. Logging out.`);
          handleLogout();
        }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar expand="lg" className="header-navbar">
      <Navbar.Brand>MyOrder App</Navbar.Brand>
      <Nav className="nav-buttons ml-auto">
        <Button className="btn-dashboard" onClick={handleDashboard}>
          Dashboard
        </Button>
        <Button className="btn-back" onClick={handleBack}>
          Back
        </Button>
        <Button className="btn-logout" onClick={handleLogout}>
          Logout
        </Button>
      </Nav>
    </Navbar>
  );
};

export default Header;
