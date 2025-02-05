import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import "../style/BillingManagement.css";

const BillingManagement = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [childOrders, setChildOrders] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [paymentType, setPaymentType] = useState("Advance");
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [orderStatus, setOrderStatus] = useState(""); // New state for order status

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://algebra1.ddns.net/api/billing/master/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { masterOrder, childOrders, outstandingAmount, paymentHistory } = response.data;
      setOrderDetails(masterOrder);
      setChildOrders(childOrders);
      setOutstandingAmount(outstandingAmount);
      setPaymentHistory(paymentHistory);
      setOrderStatus(masterOrder.orderstatus); // Set initial status
    } catch (error) {
      console.error("Error fetching order details:", error);
      alert("Failed to fetch order details.");
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://algebra1.ddns.net/api/billing/payments`,
        {
          orderId,
          paymentType,
          paymentMethod,
          amount: parseFloat(paymentAmount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Payment successfully recorded.");
      fetchOrderDetails(); // Refresh data
      setPaymentAmount(""); // Clear input
    } catch (error) {
      console.error("Error submitting payment:", error);
      alert("Failed to record payment.");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setOrderStatus(newStatus);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://algebra1.ddns.net/api/billing/update-status`,
        { orderId, status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  if (!orderDetails) return <p>Loading order details...</p>;

  // Calculate total payments received
  const totalPaymentsReceived = paymentHistory.reduce(
    (total, payment) => total + parseFloat(payment.amount || 0),
    0
  );

  return (
    <Container>
      {/* Order Details */}
      <Card className="my-4 p-4">
        <Row>
          <Col>
            <h3>Invoice</h3>
            <p><strong>Invoice No:</strong> {orderDetails.invoicenumber}</p>
            <p><strong>Order ID:</strong> {orderDetails.orderid}</p>
            <p><strong>Customer Name:</strong> {orderDetails.customername}</p>
            <p><strong>Contact:</strong> {orderDetails.phonenumber}</p>
           
          </Col>
        </Row>
      </Card>

      {/* Child Orders Table */}
      <Table bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Child Order ID</th>
            <th>Material</th>
            <th>Length</th>
            <th>Height</th>
            <th>Total Area</th>
            <th>Amount</th>
            <th>Wastage Charge</th>
          </tr>
        </thead>
        <tbody>
          {childOrders.map((child) => (
            <tr key={child.child_order_id}>
              <td>{child.order_cid}</td>
              <td>{child.materialname}</td>
              <td>{child.length}</td>
              <td>{child.height}</td>
              <td>{child.totalarea}</td>
              <td>₹{child.amount}</td>
              <td>₹{child.wastagecharge}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Payment Section */}
      <Card className="my-4 p-4">
        <h3>Payment Management</h3>
        <Form onSubmit={handlePaymentSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Payment Type</Form.Label>
                <Form.Control
                  as="select"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="Advance">Advance</option>
                  <option value="Final Settlement">Final Settlement</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Payment Method</Form.Label>
                <Form.Control
                  as="select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </Form.Control>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button className="mt-3" type="submit">
            Submit Payment
          </Button>
          <Form.Group className="mt-3">
              <Form.Label>Order Status</Form.Label>
              <Form.Control
                as="select"
                value={orderStatus}
                onChange={handleStatusChange}
              >
                <option value="Pending">Pending</option>
                <option value="Printed">Printed</option>
                <option value="Billed">Billed</option>
                <option value="Delivered">Delivered</option>
              </Form.Control>
            </Form.Group>

        </Form>
        <p className="mt-4"><strong>Outstanding Amount:</strong> ₹{outstandingAmount}</p>
      </Card>

      {/* Payment History Table */}
      <Card className="my-4 p-4">
        <h3>Payment History</h3>
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Payment Type</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Billed By</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.payment_cid}>
                <td>{payment.payment_cid}</td>
                <td>{payment.payment_type}</td>
                <td>{payment.payment_method}</td>
                <td>₹{payment.amount}</td>
                <td>{new Date(payment.date).toLocaleDateString()}</td>
                <td>{payment.billed_by}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>Total</strong></td>
              <td><strong>₹{totalPaymentsReceived}</strong></td>
              <td colSpan="2"><strong>Outstanding:</strong> ₹{outstandingAmount}</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Container>
  );
};

export default BillingManagement;
