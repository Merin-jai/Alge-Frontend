// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Table, Spinner, Button, Form } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import "../style/PrintingDashboard.css"; // Custom CSS for styling

// function PrintingPage() {
//   const [orders, setOrders] = useState([]); // State for all orders
//   const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
//   const [loading, setLoading] = useState(true); // State for loading
//   const [searchTerm, setSearchTerm] = useState(""); // Search term state
//   const [startDate, setStartDate] = useState(""); // Start date filter
//   const [endDate, setEndDate] = useState(""); // End date filter
//   const [statusFilter, setStatusFilter] = useState(""); // Status filter
//   const role = localStorage.getItem("role"); // Retrieve printing type (role) from localStorage
//   const navigate = useNavigate();

//   // Fetch orders from backend
//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("User not logged in!");
//       navigate("/Login");
//       return;
//     }

//     try {
//       const response = await axios.get(
//         "https://algebra1.ddns.net/api/orders/child-orders",
//         {
//           params: { role },
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Sort: Pending on top, Printed below
//       const sortedOrders = response.data.sort((a, b) => {
//         if (a.orderstatus === "Pending" && b.orderstatus === "Printed") return -1;
//         if (a.orderstatus === "Printed" && b.orderstatus === "Pending") return 1;
//         return 0;
//       });

//       setOrders(sortedOrders);
//       setFilteredOrders(sortedOrders);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setOrders([]);
//       setFilteredOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Dynamic filtering based on search term, date range, and status
//   useEffect(() => {
//     let filtered = orders;

//     if (searchTerm) {
//       filtered = filtered.filter(
//         (order) =>
//           order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           order.invoicenumber.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (startDate) {
//       filtered = filtered.filter(
//         (order) => new Date(order.billdate) >= new Date(startDate)
//       );
//     }

//     if (endDate) {
//       filtered = filtered.filter(
//         (order) => new Date(order.billdate) <= new Date(endDate)
//       );
//     }

//     if (statusFilter) {
//       filtered = filtered.filter((order) => order.orderstatus === statusFilter);
//     }

//     setFilteredOrders(filtered);
//   }, [searchTerm, startDate, endDate, statusFilter, orders]);

//   const handleViewDetails = (childOrderId) => {
//     navigate(`/PrintingOrder/${childOrderId}`);
//   };

//   if (loading) {
//     return (
//       <div className="spinner-container">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="printing-page-container">
//       <div className="printing-page-content">
//         <h2 className="printing-page-title">Orders for {role}</h2>
//         <div className="filter-container">
//           {/* Search Box */}
//           <Form.Control
//             type="text"
//             placeholder="Search by customer name or invoice"
//             className="filter-control"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {/* Start and End Date Filters */}
//           <div className="date-filters">
//             <Form.Control
//               type="date"
//               className="filter-control"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//             <Form.Control
//               type="date"
//               className="filter-control"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>
//           {/* Status Filter */}
//           <Form.Control
//             as="select"
//             className="filter-control"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="">All</option>
//             <option value="Pending">Pending</option>
//             <option value="Printed">Printed</option>
//           </Form.Control>
//         </div>
//         {filteredOrders.length === 0 ? (
//           <div className="no-orders">No orders found.</div>
//         ) : (
//           <Table bordered responsive>
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer Name</th>
//                 <th>Invoice Number</th>
//                 <th>Bill Date</th>
//                 <th>Printing Type</th>
//                 <th>Wastage Charge</th>
//                 <th>Total Amount</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order.child_order_id}>
//                   <td>{order.child_order_id}</td>
//                   <td>{order.customer_name || "Unknown Customer"}</td>
//                   <td>{order.invoicenumber || "N/A"}</td>
//                   <td>{new Date(order.billdate).toLocaleDateString()}</td>
//                   <td>{order.printingtype || "N/A"}</td>
//                   <td>₹{order.wastagecharge || "N/A"}</td>
//                   <td>₹{order.amount || "N/A"}</td>
//                   <td
//                     style={{
//                       color: order.orderstatus === "Printed" ? "green" : "red",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {order.orderstatus}
//                   </td>
//                   <td>
//                     <Button
//                       variant="primary"
//                       onClick={() => handleViewDetails(order.child_order_id)}
//                     >
//                       View Details
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PrintingPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/PrintingDashboard.css";

function PrintingDashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("User not logged in!");
      navigate("/Login");
      return;
    }

    try {
      const response = await axios.get(
        "https://algebra1.ddns.net/api/orders/child-orders",
        {
          params: { role },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const sortedOrders = response.data.sort((a, b) => {
        if (a.orderstatus === "Pending" && b.orderstatus === "Printed") return -1;
        if (a.orderstatus === "Printed" && b.orderstatus === "Pending") return 1;
        return 0;
      });

      setOrders(sortedOrders);
      setFilteredOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.invoicenumber?.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (statusFilter) {
      filtered = filtered.filter((order) => order.orderstatus === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, startDate, endDate, statusFilter, orders]);

  const handleViewDetails = (childOrderId) => {
    navigate(`/PrintingOrder/${childOrderId}`);
  };

  if (loading) {
    return (
      <div className="custom-spinner-container">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h2 className="dashboard-title">Orders for {role}</h2>
        <div className="filter-section">
          <Form.Control
            type="text"
            placeholder="Search by customer name or invoice"
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="date-section">
            <Form.Control
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Form.Control
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <Form.Control
            as="select"
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Printed">Printed</option>
          </Form.Control>
        </div>
        {filteredOrders.length === 0 ? (
          searchTerm ? (
            <div className="no-orders">No Order found for "{searchTerm}".</div>
          ) : (
            <div className="no-orders">No orders found.</div>
          )
        ) : (

          <Table bordered responsive className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Invoice Number</th>
                <th>Bill Date</th>
                <th>Printing Type</th>
                <th>Wastage Charge</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.child_order_id}>
                  <td>{order.child_order_id}</td>
                  <td>{order.customer_name || "Unknown Customer"}</td>
                  <td>{order.invoicenumber || "N/A"}</td>
                  <td>{new Date(order.billdate).toLocaleDateString()}</td>
                  <td>{order.printingtype || "N/A"}</td>
                  <td>₹{order.wastagecharge || "N/A"}</td>
                  <td>₹{order.amount || "N/A"}</td>
                  <td
                    className={
                      order.orderstatus === "Printed"
                        ? "status-printed"
                        : "status-pending"
                    }
                  >
                    {order.orderstatus}
                  </td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleViewDetails(order.child_order_id)}
                      className="view-button"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default PrintingDashboard;
