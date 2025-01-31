import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Spinner, Form } from "react-bootstrap";
import "../style/DesignerDashboard.css";

const DesignerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("User not logged in!");
      navigate("/Login");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/designer/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedOrders = response.data.map((order) => ({
        ...order,
        totalamount:
          typeof order.totalamount === "number"
            ? order.totalamount // Use backend-provided total
            : order.childOrders.reduce(
                (sum, child) => sum + (Number(child.amount) || 0),
                0
              ), // Calculate total dynamically
      }));

      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders dynamically
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customername.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.master_order_id.toString().includes(searchTerm)
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (order) => new Date(order.billdate) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (order) => new Date(order.billdate) <= new Date(endDate)
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, startDate, endDate, orders]);

  const handleCreateOrder = () => {
    navigate("/OrderCreatePage");
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDeleteMasterOrder = async (masterOrderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/delete/master/${masterOrderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order deleted successfully!");
      setOrders(orders.filter((order) => order.master_order_id !== masterOrderId));
    } catch (error) {
      console.error("Error deleting master order:", error);
      alert("Failed to delete the order.");
    }
  };

  const handleDeleteChildOrder = async (childOrderId, masterOrderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this child order?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/delete/child/${childOrderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Child order deleted successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.master_order_id === masterOrderId
            ? {
                ...order,
                childOrders: order.childOrders.filter(
                  (child) => child.child_order_id !== childOrderId
                ),
              }
            : order
        )
      );
    } catch (error) {
      console.error("Error deleting child order:", error);
      alert("Failed to delete the child order.");
    }
  };

  const handleEditChildOrder = (childOrderId) => {
    navigate(`/EditChildOrder/${childOrderId}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Designer Dashboard</h2>
        <div className="filter-container">
          <Form.Control
            type="text"
            placeholder="Search by Order ID or Customer Name"
            className="search-box"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="date-filters">
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Button className="create-order-btn" onClick={handleCreateOrder}>
            Create New Order
          </Button>
        </div>
        {filteredOrders.length === 0 ? (
          <div className="no-orders">No orders found.</div>
        ) : (
          <Table bordered responsive>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Total Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.master_order_id}>
                  <tr>
                    <td>{order.master_order_id}</td>
                    <td>{order.customername}</td>
                    <td>₹{(Number(order.totalamount) || 0).toFixed(2)}</td>
                    <td>
                      <Button
                        className="expand-btn"
                        onClick={() => toggleExpand(order.master_order_id)}
                      >
                        {expandedOrderId === order.master_order_id
                          ? "Collapse"
                          : "Expand"}
                      </Button>
                      <Button
                        className="delete-btn"
                        onClick={() => handleDeleteMasterOrder(order.master_order_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                  {expandedOrderId === order.master_order_id && (
                    <tr>
                      <td colSpan="4">
                        <Table bordered responsive>
                          <thead>
                            <tr>
                              <th>Child Order ID</th>
                              <th>Material</th>
                              <th>Printing Type</th>
                              <th>Dimensions</th>
                              <th>Quantity</th>
                              <th>Total Area</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.childOrders.map((child) => (
                              <tr key={child.child_order_id}>
                                <td>{child.child_order_id}</td>
                                <td>{child.materialname}</td>
                                <td>{child.printingtype}</td>
                                <td>
                                  {child.length} x {child.height}
                                </td>
                                <td>{child.quantity}</td>
                                <td>{child.totalarea}</td>
                                <td>₹{(Number(child.amount) || 0).toFixed(2)}</td>
                                <td>{child.child_order_status}</td>
                                <td>
                                  <Button
                                    className="edit-btn"
                                    onClick={() =>
                                      handleEditChildOrder(child.child_order_id)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    className="delete-btn"
                                    onClick={() =>
                                      handleDeleteChildOrder(
                                        child.child_order_id,
                                        order.master_order_id
                                      )
                                    }
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default DesignerDashboard;







