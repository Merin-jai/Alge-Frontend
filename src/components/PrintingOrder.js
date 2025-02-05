// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Table, Form, Button, Container, Card, Row, Col } from "react-bootstrap";
// import { useParams, useNavigate } from "react-router-dom";
// import "../style/PrintingOrder.css"; // Import updated CSS file

// const PrintingOrder = () => {
//   const { orderId } = useParams(); // Child order ID
//   const navigate = useNavigate();

//   const [orderDetails, setOrderDetails] = useState({});
//   const [wastageCharge, setWastageCharge] = useState(0);
//   const [orderStatus, setOrderStatus] = useState("");

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         const response = await axios.get(
//           `https://algebra1.ddns.net/api/orders/order-child/${orderId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const data = response.data;
//         setOrderDetails(data);
//         setWastageCharge(data.wastagecharge || 0);
//         setOrderStatus(data.orderstatus);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         alert("Failed to load order details.");
//       }
//     };

//     fetchOrderDetails();
//   }, [orderId]);

//   const handleUpdateOrder = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       await axios.put(
//         `https://algebra1.ddns.net/api/orders/order-child/${orderId}/update`,
//         {
//           wastageCharge,
//           orderStatus,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       alert("Order updated successfully!");
//       navigate("/PrintingDashboard");
//     } catch (error) {
//       console.error("Error updating order:", error);
//       alert("Failed to update order.");
//     }
//   };

//   return (
//     <Container className="printing-order-main-container">
//       <Card className="printing-order-main-card">
//         <h2 className="printing-order-main-title">Order Details</h2>
//         <Table bordered hover responsive className="printing-order-table">
//           <tbody>
//             <tr>
//               <th>Master Order ID</th>
//               <td>{orderDetails.master_order_id || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Order ID</th>
//               <td>{orderDetails.child_order_id || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Invoice Number</th>
//               <td>{orderDetails.invoicenumber || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Customer Name</th>
//               <td>{orderDetails.customername || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Customer Contact Number</th>
//               <td>{orderDetails.phonenumber || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Material Name</th>
//               <td>{orderDetails.materialname || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Length</th>
//               <td>{orderDetails.length || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Height</th>
//               <td>{orderDetails.height || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Quantity</th>
//               <td>{orderDetails.quantity || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Total Area</th>
//               <td>{orderDetails.totalarea || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Order Date</th>
//               <td>
//                 {orderDetails.billdate
//                   ? new Date(orderDetails.billdate).toLocaleDateString()
//                   : "N/A"}
//               </td>
//             </tr>
//             <tr>
//               <th>Amount</th>
//               <td>₹{orderDetails.amount || "N/A"}</td>
//             </tr>
//             <tr>
//               <th>Wastage Charge</th>
//               <td>₹{orderDetails.wastagecharge || 0}</td>
//             </tr>
//             <tr>
//               <th>Current Status</th>
//               <td>{orderDetails.orderstatus || "N/A"}</td>
//             </tr>
//           </tbody>
//         </Table>

//         {/* Highlighted Metrics */}
//         <Row className="printing-order-metrics-container text-center">
//           <Col>
//             <Card className="printing-order-highlight-card">
//               <h5>Length</h5>
//               <h3>{orderDetails.length || "N/A"}</h3>
//             </Card>
//           </Col>
//           <Col>
//             <Card className="printing-order-highlight-card">
//               <h5>Height</h5>
//               <h3>{orderDetails.height || "N/A"}</h3>
//             </Card>
//           </Col>
//           <Col>
//             <Card className="printing-order-highlight-card">
//               <h5>Quantity</h5>
//               <h3>{orderDetails.quantity || "N/A"}</h3>
//             </Card>
//           </Col>
//           <Col>
//             <Card className="printing-order-highlight-card">
//               <h5>Total Area</h5>
//               <h3>{orderDetails.totalarea || "N/A"}</h3>
//             </Card>
//           </Col>
//         </Row>

//         <Form className="printing-order-form">
//           <Form.Group>
//             <Form.Label>Wastage Charge</Form.Label>
//             <Form.Control
//               type="number"
//               value={wastageCharge}
//               onChange={(e) =>
//                 setWastageCharge(parseFloat(e.target.value) || 0)
//               }
//             />
//           </Form.Group>
//           <Form.Group className="mt-4">
//             <Form.Label>Update Status</Form.Label>
//             <Form.Control
//               as="select"
//               value={orderStatus}
//               onChange={(e) => setOrderStatus(e.target.value)}
//             >
//               <option value="Pending">Pending</option>
//               <option value="Printed">Printed</option>
//             </Form.Control>
//           </Form.Group>
//           <Button className="printing-order-save-btn mt-3" onClick={handleUpdateOrder}>
//             Save Changes
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default PrintingOrder;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../style/PrintingOrder.css"; // Updated CSS file

const PrintingOrder = () => {
  const { orderId } = useParams(); // Child order ID
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState({});
  const [wastageCharge, setWastageCharge] = useState(0);
  const [orderStatus, setOrderStatus] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          `https://algebra1.ddns.net/api/orders/order-child/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = response.data;
        setOrderDetails(data);
        setWastageCharge(data.wastagecharge || 0);
        setOrderStatus(data.orderstatus);
      } catch (error) {
        console.error("Error fetching order details:", error);
        alert("Failed to load order details.");
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleUpdateOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `https://algebra1.ddns.net/api/orders/order-child/${orderId}/update`,
        {
          wastageCharge,
          orderStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order updated successfully!");
      navigate("/PrintingDashboard");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update order.");
    }
  };

  return (
    <Container className="printing-order-main-container">
      <Card className="printing-order-main-card">
        <h2 className="printing-order-main-title">Order Details</h2>
        <Table bordered hover responsive className="printing-order-table">
          <tbody>
            <tr>
              <th>Master Order ID</th>
              <td>{orderDetails.master_order_id || "N/A"}</td>
            </tr>
            <tr>
              <th>Order ID</th>
              <td>{orderDetails.child_order_id || "N/A"}</td>
            </tr>
            <tr>
              <th>Invoice Number</th>
              <td>{orderDetails.invoicenumber || "N/A"}</td>
            </tr>
            <tr>
              <th>Customer Name</th>
              <td>{orderDetails.customername || "N/A"}</td>
            </tr>
            <tr>
              <th>Customer Contact Number</th>
              <td>{orderDetails.phonenumber || "N/A"}</td>
            </tr>
            <tr>
              <th>Material Name</th>
              <td>{orderDetails.materialname || "N/A"}</td>
            </tr>
            <tr>
              <th>Length</th>
              <td>{orderDetails.length || "N/A"}</td>
            </tr>
            <tr>
              <th>Height</th>
              <td>{orderDetails.height || "N/A"}</td>
            </tr>
            <tr>
              <th>Quantity</th>
              <td>{orderDetails.quantity || "N/A"}</td>
            </tr>
            <tr>
              <th>Total Area</th>
              <td>{orderDetails.totalarea || "N/A"}</td>
            </tr>
            <tr>
              <th>Order Date</th>
              <td>
                {orderDetails.billdate
                  ? new Date(orderDetails.billdate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <th>Amount</th>
              <td>₹{orderDetails.amount || "N/A"}</td>
            </tr>
            <tr>
              <th>Wastage Charge</th>
              <td>₹{orderDetails.wastagecharge || 0}</td>
            </tr>
            <tr>
              <th>Current Status</th>
              <td>{orderDetails.orderstatus || "N/A"}</td>
            </tr>
          </tbody>
        </Table>

        <Row className="printing-order-metrics-container text-center">
          <Col>
            <Card className="printing-order-highlight-card">
              <h5>Length</h5>
              <h3>{orderDetails.length || "N/A"}</h3>
            </Card>
          </Col>
          <Col>
            <Card className="printing-order-highlight-card">
              <h5>Height</h5>
              <h3>{orderDetails.height || "N/A"}</h3>
            </Card>
          </Col>
          <Col>
            <Card className="printing-order-highlight-card">
              <h5>Quantity</h5>
              <h3>{orderDetails.quantity || "N/A"}</h3>
            </Card>
          </Col>
          <Col>
            <Card className="printing-order-highlight-card">
              <h5>Total Area</h5>
              <h3>{orderDetails.totalarea || "N/A"}</h3>
            </Card>
          </Col>
        </Row>

        <Form className="printing-order-form">
          <Form.Group>
            <Form.Label>Wastage Charge</Form.Label>
            <Form.Control
              type="number"
              value={wastageCharge}
              onChange={(e) =>
                setWastageCharge(parseFloat(e.target.value) || 0)
              }
            />
          </Form.Group>
          <Form.Group className="mt-4">
            <Form.Label>Update Status</Form.Label>
            <Form.Control
              as="select"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Printed">Printed</option>
            </Form.Control>
          </Form.Group>
          <Button className="printing-order-save-btn mt-3" onClick={handleUpdateOrder}>
            Save Changes
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default PrintingOrder;
