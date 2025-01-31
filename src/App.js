// import React, { useEffect } from "react";
// import { Routes, Route } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import LoginPage from './components/LoginPage';
// import OrderCreatePage from './components/OrderCreatePage';
// import MaterialManagement from './components/MaterialManagement';
// import UserManagement from './components/UserManagement';
// import Home from './components/Home'; // Updated import
// import EditOrder from './components/EditOrder';
// import PendingOrdersDashboard from './components/PendingOrdersDashboard';
// import BillingManagement from './components/BillingManagement';
// import DemoPage from './components/DemoPage'; // Correct path
// import DesignerDashboard from "./components/DesignerDashboard";
// import PrintingDashboard from "./components/PrintingDashboard";
// import PrintingOrder from "./components/PrintingOrder";// Add this to your Routes
// import AdminDashboard from "./components/AdminDashboard";// Add this to your Routes
// // import "./style/global.css"; // Import the global CSS file
// // import { initializeCubeAnimation } from './components/CubeAnimation';
// import AdminOrders from "./components/AdminOrders";// Add this to your Routes
// import AdminOrderEdit from "./components/AdminOrderEdit";
// import EditDesignerOrder from  "./components/EditDesignerOrder";











// function App() {
//   // useEffect(() => {
//   //   initializeCubeAnimation(); // Initialize cube animation on mount
//   // }, []);
//   return (
//     // <div>
//     //         <canvas id="background-cube"></canvas>
//       <Routes>
//       <Route path="/LoginPage" element={<LoginPage />} />
//       <Route path="/OrderCreatePage" element={<OrderCreatePage />} />
//       <Route path="/MaterialManagement" element={<MaterialManagement />} />
//       <Route path="/UserManagement" element={<UserManagement />} />
//       <Route path="/EditOrder" element={<EditOrder />} />
//       <Route path="/PendingOrdersDashboard" element={<PendingOrdersDashboard />} />
//       <Route path="/billing/:orderId" element={<BillingManagement />} />
//       <Route path="/demo" element={<DemoPage />} />
//       <Route path="/" element={<Home />} /> {/* Corrected component name */}
//       <Route path="/DesignerDashboard" element={<DesignerDashboard />} />
//       <Route path="/PrintingDashboard" element={<PrintingDashboard />} />
//       <Route path="/PrintingOrder/:orderId" element={<PrintingOrder />} />
//       <Route path="/AdminDashboard" element={<AdminDashboard />} />
//       <Route path="/AdminOrders" element={<AdminOrders />} />
//       <Route path="/edit-order/:orderId" element={<AdminOrderEdit />} />
//       <Route path="/EditChildOrder/:childOrderId" element={<EditDesignerOrder />} />






//     </Routes>

//     // </div>
    
    
    
//   );
// }

// export default App;

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";

// Import components
// import LoginPage from "./components/LoginPage";
// import OrderCreatePage from "./components/OrderCreatePage";
// import MaterialManagement from "./components/MaterialManagement";
// import UserManagement from "./components/UserManagement";
// import Home from "./components/Home";
// import EditOrder from "./components/EditOrder";
// import PendingOrdersDashboard from "./components/PendingOrdersDashboard";
// import BillingManagement from "./components/BillingManagement";
// import DemoPage from "./components/DemoPage";
// import DesignerDashboard from "./components/DesignerDashboard";
// import PrintingDashboard from "./components/PrintingDashboard";
// import PrintingOrder from "./components/PrintingOrder";
// import AdminDashboard from "./components/AdminDashboard";
// import AdminOrders from "./components/AdminOrders";
// import AdminOrderEdit from "./components/AdminOrderEdit";
// import EditDesignerOrder from "./components/EditDesignerOrder";
// import Outstanding from "./components/Outstanding";
// import Header from './components/Header';




// function App() {
//   return (
//     <Routes>
//       <Header/>
//       {/* General Routes */}
//       <Route path="/" element={<Home />} />
//       <Route path="/LoginPage" element={<LoginPage />} />
//       <Route path="/demo" element={<DemoPage />} />

//       {/* Designer Routes */}
//       <Route path="/DesignerDashboard" element={<DesignerDashboard />} />
//       <Route path="/EditDesignerOrder/:orderId" element={<EditDesignerOrder />} />
//       <Route path="/EditChildOrder/:childOrderId" element={<EditDesignerOrder />} />

//       {/* Admin Routes */}
//       <Route path="/AdminDashboard" element={<AdminDashboard />} />
//       <Route path="/AdminOrders" element={<AdminOrders />} />
//       <Route path="/edit-order/:orderId" element={<AdminOrderEdit />} />

//       {/* Printing Routes */}
//       <Route path="/PrintingDashboard" element={<PrintingDashboard />} />
//       <Route path="/PrintingOrder/:orderId" element={<PrintingOrder />} />

//       {/* Billing Routes */}
//       <Route path="/billing/:orderId" element={<BillingManagement />} />
//       <Route path="/PendingOrdersDashboard" element={<PendingOrdersDashboard />} />

//       {/* Material and User Management */}
//       <Route path="/MaterialManagement" element={<MaterialManagement />} />
//       <Route path="/UserManagement" element={<UserManagement />} />

//       {/* Order Creation & Editing */}
//       <Route path="/OrderCreatePage" element={<OrderCreatePage />} />
//       <Route path="/EditOrder" element={<EditOrder />} />
//       <Route path="/outstanding" element={<Outstanding />} />


//       {/* Fallback Route */}
//       <Route path="*" element={<Navigate to="/LoginPage" />} />


//     </Routes>
//   );
// }

// export default App;


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import components
import LoginPage from "./components/LoginPage";
import OrderCreatePage from "./components/OrderCreatePage";
import MaterialManagement from "./components/MaterialManagement";
import UserManagement from "./components/UserManagement";
import Home from "./components/Home";
import EditOrder from "./components/EditOrder";
import PendingOrdersDashboard from "./components/PendingOrdersDashboard";
import BillingManagement from "./components/BillingManagement";
import DemoPage from "./components/DemoPage";
import DesignerDashboard from "./components/DesignerDashboard";
import PrintingDashboard from "./components/PrintingDashboard";
import PrintingOrder from "./components/PrintingOrder";
import AdminDashboard from "./components/AdminDashboard";
import AdminOrders from "./components/AdminOrders";
import AdminOrderEdit from "./components/AdminOrderEdit";
import EditDesignerOrder from "./components/EditDesignerOrder";
import Outstanding from "./components/Outstanding";
import Header from './components/Header';

// Layout Component that Includes Header
const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

function App() {
  return (
    <Routes>
      {/* General Routes (No Header on Login Page) */}
      <Route path="/LoginPage" element={<LoginPage />} />

      {/* All Other Routes Include Header */}
      <Route
        path="/*"
        element={
          <Layout>
            <Routes>
              {/* General Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/demo" element={<DemoPage />} />

              {/* Designer Routes */}
              <Route path="/DesignerDashboard" element={<DesignerDashboard />} />
              <Route path="/EditDesignerOrder/:orderId" element={<EditDesignerOrder />} />
              <Route path="/EditChildOrder/:childOrderId" element={<EditDesignerOrder />} />

              {/* Admin Routes */}
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
              <Route path="/AdminOrders" element={<AdminOrders />} />
              <Route path="/edit-order/:orderId" element={<AdminOrderEdit />} />

              {/* Printing Routes */}
              <Route path="/PrintingDashboard" element={<PrintingDashboard />} />
              <Route path="/PrintingOrder/:orderId" element={<PrintingOrder />} />

              {/* Billing Routes */}
              <Route path="/billing/:orderId" element={<BillingManagement />} />
              <Route path="/PendingOrdersDashboard" element={<PendingOrdersDashboard />} />

              {/* Material and User Management */}
              <Route path="/MaterialManagement" element={<MaterialManagement />} />
              <Route path="/UserManagement" element={<UserManagement />} />

              {/* Order Creation & Editing */}
              <Route path="/OrderCreatePage" element={<OrderCreatePage />} />
              <Route path="/EditOrder" element={<EditOrder />} />
              <Route path="/outstanding" element={<Outstanding />} />

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/LoginPage" />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
