import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Card, Container, Modal, Row, Col, Table } from "react-bootstrap";
import "../style/OrderCreatePage.css"; // Import the new CSS file

const printingTypes = ["Solvant", "Eco Solvant", "Vinyl", "UV", "UV Flatbed"];

const OrderCreatePage = () => {
  const [materials, setMaterials] = useState([]);
  const [customer, setCustomer] = useState({
    name: "",
    contact: "",
    address: "",
    id: null,
  });
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [printingDetails, setPrintingDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState(null);
  const [grandTotal, setGrandTotal] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("https://algebra1.ddns.net/api/materials", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, [token]);

  const handleContactChange = async (e) => {
    const contact = e.target.value.trim();
    setCustomer((prev) => ({ ...prev, contact }));
    setIsExistingCustomer(false);

    if (contact.length === 0) {
      setCustomer({ name: "", contact: "", address: "", id: null });
      setSuggestions([]);
      return;
    }

    if (contact.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`https://algebra1.ddns.net/api/customers?contact=${contact}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuggestions(response.data.customers || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setSuggestions([]);
    }
  };

  const handleCustomerSelect = (selectedCustomer) => {
    setCustomer({
      name: selectedCustomer.name,
      contact: selectedCustomer.phonenumber,
      address: selectedCustomer.address,
      id: selectedCustomer.customerid,
    });
    setIsExistingCustomer(true);
    setSuggestions([]);
  };

  useEffect(() => {
    const total = printingDetails.reduce((sum, part) => sum + part.totalAmount, 0);
    setGrandTotal(total);
  }, [printingDetails]);

  const addNewPart = () => {
    setPrintingDetails((prev) => [
      ...prev,
      {
        material: null,
        printingType: "",
        length: 0,
        height: 0,
        quantity: 0,
        totalArea: 0,
        totalAmount: 0,
      },
    ]);
  };

  const removePart = (index) => {
    const updatedParts = [...printingDetails];
    updatedParts.splice(index, 1);
    setPrintingDetails(updatedParts);
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...printingDetails];
    updatedParts[index][field] = value;

    if (["length", "height", "quantity", "material"].includes(field)) {
      const { length, height, quantity, material } = updatedParts[index];
      const totalArea = (length || 0) * (height || 0) * (quantity || 0);
      const totalAmount = material ? totalArea * material.ratepersqft : 0;
      updatedParts[index].totalArea = totalArea;
      updatedParts[index].totalAmount = totalAmount;
    }

    setPrintingDetails(updatedParts);
  };

  const openMaterialModal = (index) => {
    setShowModal(true);
    setSelectedPartIndex(index);
  };

  const selectMaterialForPart = (material) => {
    const updatedParts = [...printingDetails];
    updatedParts[selectedPartIndex].material = material;
    setPrintingDetails(updatedParts);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer.contact.trim()) {
      alert("Please enter a contact number.");
      return;
    }

    let customerId = customer.id;
    if (!customerId) {
      if (!customer.name.trim() || !customer.address.trim()) {
        alert("Please fill in Customer Name and Address for a new customer.");
        return;
      }

      try {
        const custResponse = await axios.post(
          "https://algebra1.ddns.net/api/customers",
          {
            name: customer.name.trim(),
            contact: customer.contact.trim(),
            address: customer.address.trim(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        customerId = custResponse.data.customer.customerid;
      } catch (error) {
        console.error("Error creating new customer:", error);
        alert("Failed to create new customer.");
        return;
      }
    }

    try {
      const response = await axios.post(
        "https://algebra1.ddns.net/api/orders",
        {
          customerId: customerId,
          createdBy: 1,
          printingDetails: printingDetails.map((part) => ({
            materialId: part.material?.materialid,
            printingType: part.printingType,
            length: part.length,
            height: part.height,
            quantity: part.quantity,
            totalArea: part.totalArea,
            totalAmount: part.totalAmount,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order created successfully!");
      setCustomer({ name: "", contact: "", address: "", id: null });
      setIsExistingCustomer(false);
      setPrintingDetails([]);
      setGrandTotal(0);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order.");
    }
  };

  return (
    <>
      <Container className="order-container">
        <Card className="order-card">
          <h2 className="order-title">Create Order</h2>
          <Form onSubmit={handleSubmit}>
            {/* Customer Details Section */}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={customer.contact}
                    onChange={handleContactChange}
                    required
                    placeholder="Enter contact number"
                  />
                  {suggestions.length > 0 && (
                    <ul className="suggestions">
                      {suggestions.map((c) => (
                        <li
                          key={c.customerid}
                          onClick={() => handleCustomerSelect(c)}
                          className="suggestion-item"
                        >
                          {c.phonenumber} - {c.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Customer Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={customer.name}
                    readOnly={isExistingCustomer}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    placeholder="Enter customer name"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={customer.address}
                    readOnly={isExistingCustomer}
                    onChange={(e) =>
                      setCustomer((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="Enter address"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Printing Details Section */}
            {printingDetails.map((part, index) => (
              <div key={index} className="part-container">
                <h4 className="order-label">Item {index + 1}</h4>
                <Button
                  variant="light"
                  onClick={() => removePart(index)}
                  className="remove-button"
                >
                  -
                </Button>
                <Form.Group className="mb-3">
                  <Form.Label>Printing Type</Form.Label>
                  <Form.Control
                    as="select"
                    value={part.printingType}
                    onChange={(e) =>
                      handlePartChange(index, "printingType", e.target.value)
                    }
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
                <Button
                  variant="primary"
                  onClick={() => openMaterialModal(index)}
                  className="select-material-button"
                >
                  Select Material
                </Button>
                {part.material && (
                  <p>
                    <strong>Material:</strong> {part.material.materialname} - ₹
                    {part.material.ratepersqft}/sqft
                  </p>
                )}
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Length</Form.Label>
                      <Form.Control
                        type="number"
                        value={part.length || ""}
                        onChange={(e) =>
                          handlePartChange(index, "length", parseFloat(e.target.value) || 0)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Height</Form.Label>
                      <Form.Control
                        type="number"
                        value={part.height || ""}
                        onChange={(e) =>
                          handlePartChange(index, "height", parseFloat(e.target.value) || 0)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        type="number"
                        value={part.quantity || ""}
                        onChange={(e) =>
                          handlePartChange(index, "quantity", parseInt(e.target.value) || 0)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Area</Form.Label>
                      <Form.Control
                        type="number"
                        value={part.totalArea || ""}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Total Amount</Form.Label>
                      <Form.Control
                        type="number"
                        value={part.totalAmount || ""}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            ))}

            <div className="add-button-wrapper">
              <Button variant="light" onClick={addNewPart} className="add-button">
                +
              </Button>
            </div>

            {printingDetails.length > 0 && (
              <div className="grand-total-box">
                <h3>Grand Total: ₹{grandTotal.toFixed(2)}</h3>
              </div>
            )}

            {printingDetails.length > 0 && (
              <Button variant="success" type="submit">
                Create Order
              </Button>
            )}
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
                {materials.length > 0 ? (
                  materials.map((material) => (
                    <tr key={material.materialid}>
                      <td>{material.materialname}</td>
                      <td>{material.ratepersqft}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => selectMaterialForPart(material)}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No materials available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
};

export default OrderCreatePage;
