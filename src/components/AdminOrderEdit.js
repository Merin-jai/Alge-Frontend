import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Modal,
  Table,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import "../style/adminOrderEdit.css";


// Example status options for Master & Child
const masterOrderStatuses = ["Pending", "Printed", "Billed", "Delivered"];
const childOrderStatuses = ["Pending", "Printed", "Billed", "Delivered"];
const printingTypes = ["Solvant", "Eco Solvant", "Vinyl", "UV", "UV Flatbed"];

const AdminOrderEdit = () => {
  const { orderId } = useParams();

  // Master order + customer info
  const [masterOrder, setMasterOrder] = useState({
    orderid: "",
    invoicenumber: "",
    customername: "",
    customercontact: "",
    customeraddress: "",
    orderstatus: "",
  });

  // Child orders & payment history
  const [childOrders, setChildOrders] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Materials
  const [materials, setMaterials] = useState([]);

  // Child editing
  const [selectedChildOrder, setSelectedChildOrder] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMaterialModal, setShowMaterialModal] = useState(false);

  // Payment editing
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [newPaymentAmount, setNewPaymentAmount] = useState("");

  // Loading
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 1) Fetch Data on Mount
  // -----------------------------
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await axios.get(
          `https://algebra1.ddns.net/api/admin-orders/${orderId}`
        );
        const { masterOrder, childOrders, paymentHistory } = res.data;

        // Store master order fields (including status)
        setMasterOrder({
          orderid: masterOrder.orderid,
          invoicenumber: masterOrder.invoicenumber,
          customername: masterOrder.customername,
          customercontact: masterOrder.customercontact,
          customeraddress: masterOrder.customeraddress,
          orderstatus: masterOrder.orderstatus || "Pending",
        });

        setChildOrders(childOrders || []);
        setPaymentHistory(paymentHistory || []);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchMaterials = async () => {
      try {
        // If your backend "materials" route is /api/admin-orders/materials, change below
        const response = await axios.get("https://algebra1.ddns.net/api/materials");
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
        alert("Failed to fetch materials.");
      }
    };

    fetchOrderDetails();
    fetchMaterials();
  }, [orderId]);

  // Calculate Grand Total (Amount + Wastage)
  const grandTotal = childOrders.reduce((acc, order) => {
    const amt = parseFloat(order.amount) || 0;
    const wastage = parseFloat(order.wastagecharge) || 0;
    return acc + amt + wastage;
  }, 0);

  // Calculate Payment Received
  const totalPaymentReceived = paymentHistory.reduce((acc, pay) => {
    return acc + (parseFloat(pay.amount) || 0);
  }, 0);

  // Outstanding = GrandTotal - PaymentReceived
  const outstandingAmount = grandTotal - totalPaymentReceived;

  if (loading) {
    return <p>Loading...</p>;
  }

  // -------------------------------------
  // 2) Master Order Status Update
  // -------------------------------------
  const handleMasterStatusChange = async () => {
    if (!masterOrder.orderstatus) {
      alert("Please select a status for the master order.");
      return;
    }
    try {
      await axios.put(
        `https://algebra1.ddns.net/api/admin-orders/${masterOrder.orderid}/status`,
        {
          orderstatus: masterOrder.orderstatus,
        }
      );
      alert("Master order status updated!");
    } catch (error) {
      console.error("Error updating master order status:", error);
      alert("Failed to update master order status.");
    }
  };

  // -------------------------------------
  // 3) Child Order Editing (with status)
  // -------------------------------------
  const handleChildOrderChange = (field, value) => {
    if (!selectedChildOrder) return;

    let newValue;
    if (field === "quantity") {
      newValue = parseInt(value, 10) || 0;
    } else if (field === "length" || field === "height") {
      newValue = parseFloat(value) || 0;
    } else {
      // For printingtype, orderstatus, etc., keep string
      newValue = value;
    }

    const updatedOrder = {
      ...selectedChildOrder,
      [field]: newValue,
    };

    // Recalc area/amount if length/height/quantity changed
    if (
      selectedMaterial &&
      (field === "length" || field === "height" || field === "quantity")
    ) {
      const totalArea =
        parseFloat(updatedOrder.length || 0) *
        parseFloat(updatedOrder.height || 0) *
        parseInt(updatedOrder.quantity || 0, 10);

      const totalAmount =
        totalArea * parseFloat(selectedMaterial.ratepersqft || 0);

      updatedOrder.totalarea = parseFloat(totalArea.toFixed(2));
      updatedOrder.amount = parseFloat(totalAmount.toFixed(2));
    }

    setSelectedChildOrder(updatedOrder);
  };

  const handleUpdateChildOrder = async () => {
    if (!selectedChildOrder) {
      alert("No child order selected.");
      return;
    }
    if (!selectedMaterial) {
      alert("Please select a material for the child order.");
      return;
    }
    if (!selectedChildOrder.printingtype) {
      alert("Please select a printing type.");
      return;
    }
    if (!selectedChildOrder.orderstatus) {
      alert("Please select a child order status.");
      return;
    }

    try {
      const updatedOrder = {
        ...selectedChildOrder,
        materialid: selectedMaterial.materialid,
      };
      // PUT /api/admin-orders/child/:order_cid
      await axios.put(
        `https://algebra1.ddns.net/api/admin-orders/child/${selectedChildOrder.order_cid}`,
        updatedOrder
      );

      alert("Child order updated successfully.");
      setSelectedChildOrder(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating child order:", error);
      alert("Failed to update child order.");
    }
  };

  const handleDeleteChildOrder = async (order_cid) => {
    if (!window.confirm("Are you sure you want to delete this child order?")) return;
    try {
      await axios.delete(`https://algebra1.ddns.net/api/admin-orders/child/${order_cid}`);
      alert("Child order deleted successfully.");
      setChildOrders((prev) => prev.filter((o) => o.order_cid !== order_cid));
    } catch (error) {
      console.error("Error deleting child order:", error);
      alert("Failed to delete child order.");
    }
  };

  // -------------------------------------
  // 4) Payment Editing & Deleting
  // -------------------------------------
  const handleDeletePayment = async (payment_cid) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axios.delete(`https://algebra1.ddns.net/api/admin-orders/payment/${payment_cid}`);
      alert("Payment deleted successfully.");
      setPaymentHistory((prev) => prev.filter((p) => p.payment_cid !== payment_cid));
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment.");
    }
  };

  // Enter "edit mode" for a payment
  const handleEditPayment = (payment_cid, currentAmount) => {
    setEditingPaymentId(payment_cid);
    setNewPaymentAmount(currentAmount.toString());
  };

  // Save payment updates to server
  const handleSavePayment = async (payment_cid) => {
    if (!newPaymentAmount) {
      alert("Please enter a new amount.");
      return;
    }
    try {
      await axios.put(`https://algebra1.ddns.net/api/admin-orders/payment/${payment_cid}`, {
        amount: parseFloat(newPaymentAmount),
      });
      alert("Payment updated successfully.");
      setEditingPaymentId(null);
      setNewPaymentAmount("");

      // Refresh
      window.location.reload();
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment.");
    }
  };

  // Cancel editing
  const handleCancelPaymentEdit = () => {
    setEditingPaymentId(null);
    setNewPaymentAmount("");
  };

  return (
    <Container className="admin-order-edit-container">

      {/* Master Order Info & Status */}
      <Card className="my-4 p-4">
        <Row className="align-items-center">
          <Col xs={6}>
            <h5>Order ID: {masterOrder.orderid}</h5>
          </Col>
          <Col xs={6} className="text-right">
            <h5>Invoice No: {masterOrder.invoicenumber}</h5>
          </Col>
        </Row>
        <hr />
        <h2>Edit Master Order</h2>
        <h4>Customer Details</h4>
        <p>
          <strong>Name:</strong> {masterOrder.customername}
        </p>
        <p>
          <strong>Contact:</strong> {masterOrder.customercontact}
        </p>
        <p>
          <strong>Address:</strong> {masterOrder.customeraddress}
        </p>

        <Form.Group as={Row} className="mt-3">
          <Form.Label column sm={2}>
            Order Status:
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              as="select"
              value={masterOrder.orderstatus}
              onChange={(e) =>
                setMasterOrder((prev) => ({
                  ...prev,
                  orderstatus: e.target.value,
                }))
              }
            >
              <option value="" disabled>
                --Select Status--
              </option>
              {masterOrderStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col sm={4}>
            <Button variant="primary" onClick={handleMasterStatusChange}>
              Update Master Order Status
            </Button>
          </Col>
        </Form.Group>
      </Card>

      {/* Child Orders */}
      <Card className="my-4 p-4">
        <h4>Child Orders</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Child ID</th>
              <th>Material</th>
              <th>Printing Type</th>
              <th>Length</th>
              <th>Height</th>
              <th>Quantity</th>
              <th>Total Area</th>
              <th>Wastage Charge</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {childOrders.map((order) => (
              <tr key={order.order_cid}>
                <td>{order.order_cid}</td>
                <td>{order.materialname}</td>
                <td>{order.printingtype}</td>
                <td>{order.length}</td>
                <td>{order.height}</td>
                <td>{order.quantity}</td>
                <td>{order.totalarea}</td>
                <td>₹{order.wastagecharge || 0}</td>
                <td>₹{order.amount || 0}</td>
                <td>{order.orderstatus || "Pending"}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={() => {
                      setSelectedChildOrder(order);
                      const matchedMat = materials.find(
                        (m) => m.materialid === order.materialid
                      );
                      if (matchedMat) setSelectedMaterial(matchedMat);
                    }}
                    style={{ marginRight: "0.5rem" }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteChildOrder(order.order_cid)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Grand Total (Amount + Wastage) */}
        <div className="mt-3">
          <h5>
            Grand Total (Amount + Wastage): ₹{grandTotal.toLocaleString()}
          </h5>
        </div>

        {/* Edit Child Order Form */}
        {selectedChildOrder && (
          <div style={{ marginTop: "2rem" }}>
            <h5>Edit Child Order</h5>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Length</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedChildOrder.length || ""}
                      onChange={(e) =>
                        handleChildOrderChange("length", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Height</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedChildOrder.height || ""}
                      onChange={(e) =>
                        handleChildOrderChange("height", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedChildOrder.quantity || ""}
                      onChange={(e) =>
                        handleChildOrderChange("quantity", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Printing Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedChildOrder.printingtype || ""}
                      onChange={(e) =>
                        handleChildOrderChange("printingtype", e.target.value)
                      }
                      required
                    >
                      <option value="" disabled>
                        Select Printing Type
                      </option>
                      {printingTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {/* Child Order Status */}
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Order Status</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedChildOrder.orderstatus || ""}
                      onChange={(e) =>
                        handleChildOrderChange("orderstatus", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        --Select Child Status--
                      </option>
                      {childOrderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>

              {/* Change Material Button */}
              <Row className="mt-3">
                <Col md={6}>
                  <Button
                    variant="primary"
                    onClick={() => setShowMaterialModal(true)}
                  >
                    Change Material
                  </Button>
                  {selectedMaterial && (
                    <p className="mt-2">
                      <strong>Selected Material:</strong> {selectedMaterial.materialname} - ₹
                      {selectedMaterial.ratepersqft}/sqft
                    </p>
                  )}
                </Col>
              </Row>

              {/* Display Calculations */}
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Area</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedChildOrder.totalarea || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Total Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={selectedChildOrder.amount || ""}
                      readOnly
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="success"
                onClick={handleUpdateChildOrder}
                className="mt-3"
              >
                Save Changes
              </Button>
            </Form>
          </div>
        )}
      </Card>

      {/* Payment History + Totals */}
      <Card className="my-4 p-4">
        <h4>Payment History</h4>
        <Table bordered>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Payment Type</th>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Billed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.length > 0 ? (
              paymentHistory.map((payment) => (
                <tr key={payment.payment_cid}>
                  <td>{payment.payment_cid}</td>
                  <td>{payment.payment_type}</td>
                  <td>{payment.payment_method}</td>
                  <td>
                    {editingPaymentId === payment.payment_cid ? (
                      <Form.Control
                        type="number"
                        value={newPaymentAmount}
                        onChange={(e) => setNewPaymentAmount(e.target.value)}
                      />
                    ) : (
                      <>₹{payment.amount.toLocaleString()}</>
                    )}
                  </td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>{payment.billed_by}</td>
                  <td>
                    {editingPaymentId === payment.payment_cid ? (
                      <>
                        <Button
                          variant="success"
                          style={{ marginRight: "0.5rem" }}
                          onClick={() => handleSavePayment(payment.payment_cid)}
                        >
                          Save
                        </Button>
                        <Button variant="secondary" onClick={handleCancelPaymentEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="info"
                          style={{ marginRight: "0.5rem" }}
                          onClick={() =>
                            handleEditPayment(payment.payment_cid, payment.amount)
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeletePayment(payment.payment_cid)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No payment history available.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Show Payment Received + Outstanding */}
        <Row className="mt-3">
          <Col md={6}>
            <h5>
              Total Payment Received: ₹{totalPaymentReceived.toLocaleString()}
            </h5>
          </Col>
          <Col md={6}>
            <h5>
              Outstanding Amount: ₹{outstandingAmount.toLocaleString()}
            </h5>
          </Col>
        </Row>
      </Card>

      {/* Material Selection Modal */}
      <Modal show={showMaterialModal} onHide={() => setShowMaterialModal(false)}>
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
              {materials.map((mat) => (
                <tr key={mat.materialid}>
                  <td>{mat.materialname}</td>
                  <td>₹{mat.ratepersqft}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSelectedMaterial(mat);
                        setShowMaterialModal(false);

                        // If we have a child order open, recalc
                        if (selectedChildOrder) {
                          const totalArea =
                            parseFloat(selectedChildOrder.length || 0) *
                            parseFloat(selectedChildOrder.height || 0) *
                            parseInt(selectedChildOrder.quantity || 0, 10);

                          const totalAmount =
                            totalArea * parseFloat(mat.ratepersqft || 0);

                          setSelectedChildOrder((prev) => ({
                            ...prev,
                            totalarea: parseFloat(totalArea.toFixed(2)),
                            amount: parseFloat(totalAmount.toFixed(2)),
                          }));
                        }
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

export default AdminOrderEdit;

