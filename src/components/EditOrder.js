import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';

function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Handle edit order
  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowEditModal(true);
  };

  // Handle form input change for editing an order
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit the edited order to the backend
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/orders/${selectedOrder.id}`, selectedOrder);
      alert('Order updated successfully!');
      setShowEditModal(false);
      setOrders((prev) =>
        prev.map((order) => (order.id === selectedOrder.id ? selectedOrder : order))
      );
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Material</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.customerName}</td>
                <td>{order.material}</td>
                <td>{order.totalAmount}</td>
                <td>{order.status}</td>
                <td>
                  <Button variant="warning" onClick={() => handleEditOrder(order)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Edit Order Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Form onSubmit={handleSaveChanges}>
              <Form.Group>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  type="text"
                  name="customerName"
                  value={selectedOrder?.customerName || ''}
                  onChange={handleOrderChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Material</Form.Label>
                <Form.Control
                  type="text"
                  name="material"
                  value={selectedOrder?.material || ''}
                  onChange={handleOrderChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="totalAmount"
                  value={selectedOrder?.totalAmount || 0}
                  onChange={handleOrderChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  name="status"
                  value={selectedOrder?.status || ''}
                  onChange={handleOrderChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default OrderManagementPage;
