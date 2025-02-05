import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/PendingOrdersDashboard.css"; // Updated CSS file


const PendingOrdersDashboard = () => {
  const [masterOrders, setMasterOrders] = useState([]); 
  const [filteredOrders, setFilteredOrders] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 
  const [statusFilter, setStatusFilter] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchMasterOrders();
  }, []);

  const fetchMasterOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authorized. Please log in.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get("https://algebra1.ddns.net/api/orders/billing-master-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedOrders = response.data.sort((a, b) => {
        const statusOrder = { Printed: 1, Pending: 2, Billed: 3, Delivered: 4 };
        return statusOrder[a.order_status] - statusOrder[b.order_status];
      });

      setMasterOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching master orders:", error);
      alert("Failed to fetch master orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = masterOrders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.invoicenumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (startDate) {
      filtered = filtered.filter((order) => new Date(order.billdate) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter((order) => new Date(order.billdate) <= new Date(endDate));
    }

    if (statusFilter) {
      filtered = filtered.filter((order) => order.order_status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, startDate, endDate, statusFilter, masterOrders]);

  const handleManagePayment = (masterOrderId) => {
    navigate(`/billing/${masterOrderId}`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
    fetchMasterOrders();
  };

  return (
    <Container className="pending-orders-dashboard-container">

      <h2 className="pending-orders-dashboard-title">Master Orders</h2>

      {/* Filters */}
      <Form className="pending-orders-dashboard-filter-container">
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search by customer name or invoice"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              as="select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Printed">Printed</option>
              <option value="Billed">Billed</option>
              <option value="Delivered">Delivered</option>
            </Form.Control>
          </Col>
        </Row>
        <Button className="pending-orders-dashboard-reset-button" variant="secondary" onClick={handleResetFilters}>
          Reset
        </Button>
      </Form>

      {/* Orders Table */}
      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length > 0 ? (
        <Table striped bordered hover responsive className="pending-orders-dashboard-table">
          <thead>
            <tr>
              <th>Master Order ID</th>
              <th>Invoice Number</th>
              <th>Customer Name</th>
              <th>Contact Number</th>
              <th>No. of Orders</th>
              <th>Total Wastage Charge</th>
              <th>Total Amount</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.master_order_id}>
                <td>{order.master_order_id || "N/A"}</td>
                <td>{order.invoicenumber || "N/A"}</td>
                <td>{order.customer_name || "N/A"}</td>
                <td>{order.customer_contact || "N/A"}</td>
                <td>{order.child_count || 0}</td>
                <td>₹{order.total_wastage_charge || 0}</td>
                <td>₹{order.total_amount || 0}</td>
                <td>₹{order.grand_total || 0}</td>
                <td>
                  <span className={`pending-orders-dashboard-badge ${order.order_status.toLowerCase()}`}>
                    {order.order_status}
                  </span>
                </td>
                <td>
                  <Button onClick={() => handleManagePayment(order.master_order_id)} className="pending-orders-dashboard-action-button">
                    Manage Payment
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No orders found for the selected filters.</p>
      )}
    </Container>
  );
};

export default PendingOrdersDashboard;
