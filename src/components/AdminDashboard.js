
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";


// Date Picker imports
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Import the updated CSS file
import "../style/adminDashboard.css";
import { Container } from "react-bootstrap";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_master_orders: 0,
    total_work_orders: 0,
    total_payments: 0,
    payment_received: 0,
    total_amount: 0,
    outstanding_amount: 0,
  });

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const navigate = useNavigate();

  // Fetch data from the backend
  const fetchDashboardData = async (start, end) => {
    try {
      const response = await axios.get("https://algebra1.ddns.net/api/dashboard-data", {
        params: { startDate: start, endDate: end },
      });
      setDashboardData(
        response.data || {
          total_master_orders: 0,
          total_work_orders: 0,
          total_payments: 0,
          payment_received: 0,
          total_amount: 0,
          outstanding_amount: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Fetch data for the current date when the component mounts
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchDashboardData(today, today);
  }, []);

  // Handle date range change
  const handleDateChange = () => {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    fetchDashboardData(formattedStartDate, formattedEndDate);
  };

  // Configuration for the cards
  const cardData = [
    {
      title: "Total Master Orders",
      value: dashboardData.total_master_orders,
    },
    {
      title: "Total Work Orders",
      value: dashboardData.total_work_orders,
    },
    {
      title: "Total Payments",
      value: dashboardData.total_payments,
    },
    {
      title: "Payment Received",
      value: `₹${dashboardData.payment_received?.toLocaleString() || "0"}`,
    },
    {
      title: "Total Amount",
      value: `₹${dashboardData.total_amount?.toLocaleString() || "0"}`,
    },
    {
      title: "Outstanding Amount",
      value: `₹${dashboardData.outstanding_amount?.toLocaleString() || "0"}`,
      link: "/outstanding",
    },
  ];

  return (
    <div className="admin-dashboard-wrapper">
    {/* Header Component */}

    <div className="admin-dashboard-container">

      <Sidebar />
      <main className="admin-dashboard-content">
        <header className="admin-dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="admin-dashboard-date-picker-container">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select Start Date"
            className="admin-dashboard-date-picker"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="Select End Date"
            className="admin-dashboard-date-picker"
          />
          <button className="admin-dashboard-fetch-data-btn" onClick={handleDateChange}>
            Fetch Data
          </button>
        </div>

        <section className="admin-dashboard-overview-section">
          {cardData.map((item, index) => (
            <div
              key={index}
              className="admin-dashboard-card admin-dashboard-movement-card"
              onClick={() => {
                if (item.link) {
                  navigate(item.link);
                }
              }}
              style={{ cursor: item.link ? "pointer" : "default" }}
            >
              <h3>{item.title}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
    </div>
  );
};

export default AdminDashboard;


