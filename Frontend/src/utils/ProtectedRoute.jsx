// // src/components/ProtectedRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// // role can be "customer", "vendor", "admin"
// const ProtectedRoute = ({ children, user, role }) => {
//   // if no user, redirect to login
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   // if user exists but role doesn't match
//   if (role && user.role !== role) {
//     return <Navigate to="/" replace />; // or some "Not Authorized" page
//   }

//   // allowed to access
//   return children;
// };

// export default ProtectedRoute;



// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, role }) => {
//   const { user, loading } = useAuthContext();

//   if (loading) return <div>Loading...</div>;

//   if (!user) return <Navigate to="/login" replace />;

//   if (role && user.role !== role) return <Navigate to="/" replace />;

//   return children;
// };

// export default ProtectedRoute;


// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = ({ children, role }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;
//   if (!user) return <Navigate to="/login" replace />; // not logged in
//   if (role && user.role !== role) return <Navigate to="/login" replace />; // wrong role

//   return children;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuthContext();

  if (loading) return null; // wait for auth check

  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;


