import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Welcome to the Home Page</h2>
      <button onClick={() => navigate('/LoginPage')}>Go to LoginPage</button>
      <button onClick={() => navigate('/MaterialManagement')}>Go to MaterialManagement</button>
      <button onClick={() => navigate('/OrderCreatePage')}>Go to OrderCreatePage</button>
      <button onClick={() => navigate('/UserManagement')}>Go to UserManagement</button>
      <button onClick={() => navigate('/EditOrder')}>Go to EditOrder</button>
      <button onClick={() => navigate('/PendingOrdersDashboard')}>Go to PendingOrdersDashboard</button>
      <button onClick={() => navigate('/demo')}>Go to DemoPage</button> {/* Corrected path */}
      <button onClick={() => navigate('/EditDesignerOrder')}>Go to EditDesignerOrder</button>
      <button onClick={() => navigate('/PrintingDashboard')}>Go to PrintingDashboard</button>
      <button onClick={() => navigate('/AdminDashboard')}>Go to AdminDashboard</button>


    </div>
  );
};

export default HomePage;
