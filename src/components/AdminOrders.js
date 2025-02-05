import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Table, Button, Form, Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]); // Store the fetched orders
  const [filters, setFilters] = useState({
    status: "",
    startDate: null,
    endDate: null,
    search: "",
  }); // Manage all filters
  const [loading, setLoading] = useState(false); // Manage loading state
  const [typingTimeout, setTypingTimeout] = useState(null); // Manage search debounce
  const navigate = useNavigate(); // For navigation

  // Fetch orders from the API
  const fetchOrders = async (currentFilters) => {
    setLoading(true);
    try {
      const { status, startDate, endDate, search } = currentFilters;

      const response = await axios.get("https://algebra1.ddns.net/api/admin-orders", {
        params: {
          status,
          startDate: startDate ? startDate.toISOString().split("T")[0] : null,
          endDate: endDate ? endDate.toISOString().split("T")[0] : null,
          search,
        },
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger API call when filters change
  useEffect(() => {
    fetchOrders(filters);
  }, [filters]);

  // Handle search input dynamically with debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;

    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Update search filter with debounce logic
    setTypingTimeout(
      setTimeout(() => {
        setFilters((prevFilters) => ({ ...prevFilters, search: value }));
      }, 300)
    );
  };

  // Handle other filter changes (e.g., status, dates)
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFilters((prevFilters) => ({ ...prevFilters, [name]: date }));
  };

  // Navigate to the edit or detail page for the selected order
  const handleViewDetails = (orderId) => {
    navigate(`/edit-order/${orderId}`); // Navigate to the edit-order path
  }

  return (
    <div className="admin-orders">
      <div className="container">
        <h2>Admin Orders</h2>

        {/* Filters Section */}
        <div className="filters d-flex flex-wrap gap-3 mb-4">
          <Form.Control
            type="text"
            placeholder="Search by Name, Invoice, or Phone"
            onChange={handleSearchChange}
            className="flex-grow-1"
          />
          <Form.Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Printed">Printed</option>
            <option value="Billed">Billed</option>
            <option value="Delivered">Delivered</option>
          </Form.Select>
          <DatePicker
            selected={filters.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
            placeholderText="Start Date"
            className="form-control"
          />
          <DatePicker
            selected={filters.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
            placeholderText="End Date"
            className="form-control"
          />
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" />
            <p>Loading orders...</p>
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Phone Number</th>
                <th>Invoice</th>
                <th>Status</th>
                <th>No. of Work Orders</th>
                <th>Total Amount</th>
                <th>Outstanding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.orderid}>
                    <td>{order.orderid}</td>
                    <td>{order.customername}</td>
                    <td>{order.phonenumber}</td>
                    <td>{order.invoicenumber}</td>
                    <td>{order.status}</td>
                    <td>{order.workorders}</td>
                    <td>₹{parseFloat(order.totalamount || 0).toLocaleString()}</td>
                    <td>₹{parseFloat(order.outstandingamount || 0).toLocaleString()}</td>
                    <td>
                      <Button
                        onClick={() => handleViewDetails(order.orderid)}
                        variant="info"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
