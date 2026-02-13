





import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateOrder from "./pages/Customer/CreateOrder.jsx";
// import VendorDashboard from "./pages/Vendor/VendorDashboard.jsx";
// import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import VendorOrders from "./pages/Vendor/VendorOrders.jsx";
import AllOrders from "./pages/Admin/AllOrders.jsx";


// import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <CreateOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor"
          element={
            <ProtectedRoute role="vendor">
              {/* <VendorDashboard /> */}
              <VendorOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              {/* <AdminDashboard /> */}
              <AllOrders />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;

