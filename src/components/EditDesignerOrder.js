import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, Modal, Table } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const printingTypes = ["Solvant", "Eco Solvant", "Vinyl", "UV", "UV Flatbed"];

const EditDesignerOrder = () => {
  const { childOrderId } = useParams();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    length: 0,
    height: 0,
    quantity: 0,
    totalArea: 0,
    totalAmount: 0,
    orderStatus: "",
  });
  const [customer, setCustomer] = useState({ name: "", contact: "", address: "" });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedPrintingType, setSelectedPrintingType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch order details and materials on component load
  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token"); // Declare token here
      if (!token) {
        alert("Unauthorized access. Please log in.");
        navigate("/Login");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/api/edit-designer-order/child/${childOrderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const order = response.data;
        setOrderDetails({
          length: order.length,
          height: order.height,
          quantity: order.quantity,
          totalArea: order.totalarea,
          totalAmount: order.amount,
          orderStatus: order.orderstatus,
        });
        setCustomer({
          name: order.customername,
          contact: order.customercontact,
          address: order.customeraddress,
        });
        setSelectedMaterial({
          materialid: order.materialid,
          materialname: order.materialname,
          ratepersqft: order.ratepersqft,
        });
        setSelectedPrintingType(order.printingtype);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to load order details.");
      }
    };

    const fetchMaterials = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/materials");
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
        alert("Failed to load materials.");
      }
    };

    fetchOrderDetails();
    fetchMaterials();
    setLoading(false);
  }, [childOrderId, navigate]);

  useEffect(() => {
    const { length, height, quantity } = orderDetails;
    const totalArea = (length || 0) * (height || 0) * (quantity || 0);
    const totalAmount = selectedMaterial ? totalArea * selectedMaterial.ratepersqft : 0;
    setOrderDetails((prev) => ({ ...prev, totalArea, totalAmount }));
  }, [orderDetails.length, orderDetails.height, orderDetails.quantity, selectedMaterial]);

  const handleInputChange = (field, value) => {
    setOrderDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    if (!selectedMaterial) {
      alert("Please select a material.");
      return;
    }
    if (!selectedPrintingType) {
      alert("Please select a printing type.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/edit-designer-order/child/edit/${childOrderId}`,
        {
          materialId: selectedMaterial.materialid,
          printingType: selectedPrintingType,
          length: orderDetails.length,
          height: orderDetails.height,
          quantity: orderDetails.quantity,
          totalArea: orderDetails.totalArea,
          totalAmount: orderDetails.totalAmount,
          orderStatus: orderDetails.orderStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Order updated successfully!");
      navigate("/DesignerDashboard");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Card className="my-4 p-4">
        <h2>Edit Child Order</h2>
        <Form onSubmit={handleUpdateOrder}>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Customer Name</Form.Label>
                <Form.Control type="text" value={customer.name} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Contact</Form.Label>
                <Form.Control type="text" value={customer.contact} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" value={customer.address} readOnly />
          </Form.Group>
          <Form.Group>
            <Form.Label>Printing Type</Form.Label>
            <Form.Control
              as="select"
              value={selectedPrintingType}
              onChange={(e) => setSelectedPrintingType(e.target.value)}
              required
            >
              <option value="">Select Printing Type</option>
              {printingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={() => setShowModal(true)} className="my-2">
            Select Material
          </Button>
          {selectedMaterial && (
            <p>
              <strong>Material:</strong> {selectedMaterial.materialname} - ₹
              {selectedMaterial.ratepersqft}/sqft
            </p>
          )}
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Length</Form.Label>
                <Form.Control
                  type="number"
                  value={orderDetails.length || ""}
                  onChange={(e) => handleInputChange("length", parseFloat(e.target.value) || 0)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Height</Form.Label>
                <Form.Control
                  type="number"
                  value={orderDetails.height || ""}
                  onChange={(e) => handleInputChange("height", parseFloat(e.target.value) || 0)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={orderDetails.quantity || ""}
                  onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 0)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Total Area</Form.Label>
                <Form.Control type="number" value={orderDetails.totalArea || ""} readOnly />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Total Amount</Form.Label>
                <Form.Control type="number" value={orderDetails.totalAmount || ""} readOnly />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Order Status</Form.Label>
            <Form.Control
              as="select"
              value={orderDetails.orderStatus || ""}
              onChange={(e) => handleInputChange("orderStatus", e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Control>
          </Form.Group>
          <Button variant="success" type="submit" className="mt-3">
            Update Order
          </Button>
        </Form>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Material Name</th>
                <th>Rate (per sqft)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material.materialid}>
                  <td>{material.materialname}</td>
                  <td>{material.ratepersqft}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedMaterial(material);
                        setShowModal(false);
                      }}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default EditDesignerOrder;
