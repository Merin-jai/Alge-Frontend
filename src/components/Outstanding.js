import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../style/adminDashboard.css";

// Simple debounce utility function
const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const Outstanding = () => {
  const [outstandingList, setOutstandingList] = useState([]);

  // Live searching
  const [searchTerm, setSearchTerm] = useState("");
  // Range for outstanding min & max
  const [range, setRange] = useState([0, 1000000]);

  // Create a debounced version of fetch
  const fetchOutstanding = useCallback(
    debounce(async (params) => {
      try {
        const res = await axios.get("http://localhost:5000/api/outstanding", {
          params,
        });
        setOutstandingList(res.data);
      } catch (err) {
        console.error("Error fetching outstanding data:", err);
      }
    }, 300),
    []
  );

  // Initial load: fetch all
  useEffect(() => {
    fetchOutstanding({ search: "", min: 0, max: 1000000 });
  }, [fetchOutstanding]);

  // When searchTerm or range changes, re-fetch (debounced)
  useEffect(() => {
    fetchOutstanding({
      search: searchTerm.trim(),
      min: range[0],
      max: range[1],
    });
  }, [searchTerm, range, fetchOutstanding]);

  return (
    <div className="admin-dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Outstanding</h1>
        </header>

        {/* Filters */}
        <div style={{ marginBottom: "20px" }}>
          {/* Search input */}
          <div style={{ marginBottom: "10px" }}>
            <label>Search (Name/Phone): </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              style={{ marginLeft: "5px" }}
            />
          </div>

          {/* Range slider for outstanding */}
          <div style={{ marginBottom: "10px", width: "300px" }}>
            <label>Outstanding Range: </label>
            <Slider
                range
                min={0}
                max={1000000}
                value={range}
                onChange={(newRange) => setRange(newRange)}
                allowCross={false}
                />

            <div style={{ marginTop: "5px" }}>
              <span>Min: ₹{range[0].toLocaleString()}</span>
              <span style={{ marginLeft: "20px" }}>
                Max: ₹{range[1].toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {outstandingList.length === 0 ? (
          <p>No data found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Master Orders</th>
                <th>Child Orders</th>
                <th>Total Amount</th>
                <th>Total Paid</th>
                <th>Outstanding</th>
              </tr>
            </thead>
            <tbody>
              {outstandingList.map((item) => (
                <tr key={item.customerid}>
                  <td>{item.customername}</td>
                  <td>{item.phonenumber}</td>
                  <td>{item.total_master_orders}</td>
                  <td>{item.total_child_orders}</td>
                  <td>₹{parseFloat(item.total_amount || 0).toLocaleString()}</td>
                  <td>₹{parseFloat(item.total_payments || 0).toLocaleString()}</td>
                  <td style={{ color: "red" }}>
                    ₹{parseFloat(item.outstanding || 0).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Outstanding;
