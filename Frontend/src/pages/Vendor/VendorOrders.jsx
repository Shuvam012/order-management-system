// import React, { useEffect, useState } from "react";
// import { useAuthContext } from "../../context/AuthContext.jsx";

// import { useWebSocket } from "../../context/WebSocketContext.jsx";
// // import api from "../../api/axios.js";
// import api from "../../api/axios.js";

// const VendorOrders = () => {
//   const { user } = useAuthContext();
//   const { ws } = useWebSocket();
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const res = await api.get("/orders/vendor");
//       setOrders(res.data);
//     };
//     fetchOrders();
//   }, []);

//   // Real-time new order updates
//   useEffect(() => {
//     if (!ws) return;
//     ws.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       if (data.type === "new_order" && data.vendorId === user.id) {
//         setOrders((prev) => [data.order, ...prev]);
//       }
//     };
//   }, [ws, user]);

//   // const updateStatus = async (orderId, status) => {
//   //   await api.patch(`/orders/${orderId}`, { status });
//   //   setOrders((prev) =>
//   //     prev.map((o) => (o._id === orderId ? { ...o, status } : o))
//   //   );
//   // };

// const updateStatus = async (orderId, status) => {
//   const res = await api.put(`/orders/${orderId}`, { status });
//   const updatedOrder = res.data;

//   setOrders((prev) =>
//     prev.map((o) => (o._id === orderId ? updatedOrder : o))
//   );
// };


//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
//       {orders.map((order) => (
//         <div key={order._id} className="border p-4 mb-3 rounded shadow">
//           <p>Order ID: {order._id}</p>
//           <p>Items: {order.items}</p>
//           <p>Status: {order.status}</p>
//           <div className="space-x-2 mt-2">
//             {["accepted", "on_the_way", "in_progress", "completed"].map(
//               (status) =>
//                 status !== order.status && (
//                   <button
//                     key={status}
//                     className="bg-blue-600 text-white px-3 py-1 rounded"
//                     onClick={() => updateStatus(order._id, status)}
//                   >
//                     {status}
//                   </button>
//                 )
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VendorOrders;


import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useWebSocket } from "../../context/WebSocketContext.jsx";
import api from "../../api/axios.js";

const VendorOrders = () => {
  const { user } = useAuthContext();
  const { messages } = useWebSocket(); // use messages
  const [orders, setOrders] = useState([]);

  // Fetch initial orders
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/orders/vendor");
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  // Listen for real-time updates
  useEffect(() => {
    messages.forEach((data) => {
      if (data.topic === "orders/new" && (!data.data.vendor || data.data.vendor === user._id)) {
        setOrders((prev) => [data.data, ...prev]);
      }
      if (data.topic === "orders/update") {
        setOrders((prev) =>
          prev.map((o) => (o._id === data.data.orderId ? { ...o, status: data.data.status } : o))
        );
      }
    });
  }, [messages, user]);

  // const updateStatus = async (orderId, status) => {
  //   const res = await api.put(`/orders/${orderId}`, { status });
  //   setOrders((prev) =>
  //     prev.map((o) => (o._id === orderId ? res.data : o))
  //   );
  // };
  const updateStatus = async (orderId, status) => {
  try {
    const res = await api.put(`/orders/${orderId}`, { status });
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? res.data : o))
    );
  } catch (err) {
    console.error("Failed to update order status:", err.response?.data || err.message);
    alert("Failed to update order. Check server logs.");
  }
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="border p-4 mb-3 rounded shadow">
          <p>Order ID: {order._id}</p>
          <p>Items: {JSON.stringify(order.items)}</p>
          <p>Status: {order.status}</p>
          <div className="space-x-2 mt-2">
            {["accepted", "on_the_way", "in_progress", "completed"].map(
              (status) =>
                status !== order.status && (
                  <button
                    key={status}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => updateStatus(order._id, status)}
                  >
                    {status}
                  </button>
                )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorOrders;

