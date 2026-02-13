// // src/components/Navbar.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// import { useAuth } from "../context/AuthContext";

// const Navbar = () => {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
//       <div className="text-xl font-bold">
//         <Link to="/">OrderApp</Link>
//       </div>
//       <div className="space-x-4">
//         {!user && (
//           <>
//             <Link to="/login" className="hover:text-gray-200">Login</Link>
//             <Link to="/register" className="hover:text-gray-200">Register</Link>
//           </>
//         )}
//         {user && (
//           <>
//             <span className="mr-4">Hello, {user.name}</span>
//             {user.role === "customer" && (
//               <Link to="/customer" className="hover:text-gray-200">Dashboard</Link>
//             )}
//             {user.role === "vendor" && (
//               <Link to="/vendor" className="hover:text-gray-200">Dashboard</Link>
//             )}
//             {user.role === "admin" && (
//               <Link to="/admin" className="hover:text-gray-200">Dashboard</Link>
//             )}
//             <button
//               onClick={logout}
//               className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// // src/components/Navbar.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// import { useAuthContext } from "../context/AuthContext";

// const Navbar = () => {
//   const { user, loading, logout } = useAuth();

//   if (loading) {
//     // Prevent flash before user state is determined
//     return (
//       <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
//         <div className="text-xl font-bold">OrderApp</div>
//         <div>Loading...</div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
//       <div className="text-xl font-bold">
//         <Link to="/">OrderApp</Link>
//       </div>
//       <div className="space-x-4">
//         {!user && (
//           <>
//             <Link to="/login" className="hover:text-gray-200">
//               Login
//             </Link>
//             <Link to="/register" className="hover:text-gray-200">
//               Register
//             </Link>
//           </>
//         )}
//         {user && (
//           <>
//             <span className="mr-4">Hello, {user.name}</span>
//             {user.role === "customer" && (
//               <Link to="/customer" className="hover:text-gray-200">
//                 Dashboard
//               </Link>
//             )}
//             {user.role === "vendor" && (
//               <Link to="/vendor" className="hover:text-gray-200">
//                 Dashboard
//               </Link>
//             )}
//             {user.role === "admin" && (
//               <Link to="/admin" className="hover:text-gray-200">
//                 Dashboard
//               </Link>
//             )}
//             <button
//               onClick={logout}
//               className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, loading, logout } = useAuthContext();

  if (loading) return <nav className="bg-blue-600 text-white px-6 py-4">Loading...</nav>;

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">OrderApp</Link>
      </div>
      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/login" className="hover:text-gray-200">Login</Link>
            <Link to="/register" className="hover:text-gray-200">Register</Link>
          </>
        )}
        {user && (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            {user.role === "customer" && <Link to="/customer">Dashboard</Link>}
            {user.role === "vendor" && <Link to="/vendor">Dashboard</Link>}
            {user.role === "admin" && <Link to="/admin">Dashboard</Link>}
            <button
              onClick={logout}
              className="ml-4 bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
