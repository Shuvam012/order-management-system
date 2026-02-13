// import React, { useEffect, useState } from "react";
// import { useWebSocket } from "../../context/WebSocketContext.jsx";
// import api from "../../api/axios.js";

// const AllOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filter, setFilter] = useState("");
//   const { ws } = useWebSocket();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const res = await api.get("/orders");
//       setOrders(res.data);
//     };
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     if (!ws) return;
//     // ws.onmessage = (e) => {
//     //   const data = JSON.parse(e.data);
//     //   if (data.type === "order_update") {
//     //     setOrders((prev) =>
//     //       prev.map((o) => (o._id === data.order._id ? data.order : o))
//     //     );
//     //   }
//     // };
  
// //     ws.onmessage = (e) => {
// //   const data = JSON.parse(e.data);

// //   if (data.topic === "vendor/status") {
// //     // Only one vendor in your case
// //     setOrders((prev) =>
// //       prev.map((o) =>
// //         o.vendor?._id === data.data.vendorId // make sure payload contains vendorId
// //           ? { ...o, vendor: { ...o.vendor, isOnline: data.data.status === "online" } }
// //           : o
// //       )
// //     );
// //   }

// //   if (data.topic === "orders/update") {
// //     setOrders((prev) =>
// //       prev.map((o) => (o._id === data.data.orderId ? { ...o, status: data.data.status } : o))
// //     );
// //   }
// // };

// ws.onmessage = (e) => {
//   const data = JSON.parse(e.data);

//   if (data.topic === "vendor/status") {
//     const { vendorId, status } = data.data;
//     setOrders((prev) =>
//       prev.map((o) => {
//         // If this order belongs to the vendor who just changed status
//         if (o.vendor && o.vendor._id === vendorId) {
//           return { 
//             ...o, 
//             vendor: { ...o.vendor, isOnline: status === "online" } 
//           };
//         }
//         return o;
//       })
//     );
//   }

// //   if (data.topic === "vendor/status") {
// //     if (!data.data.vendorId) return; // skip if vendorId missing
// //     setOrders((prev) =>
// //         prev.map((o) =>
// //             o.vendor?._id === data.data.vendorId
// //                 ? { ...o, vendor: { ...o.vendor, isOnline: data.data.status === "online" } }
// //                 : o
// //         )
// //     );
// // }

// }


  
  
//   }, [ws]);

//   const filteredOrders = filter
//     ? orders.filter((o) => o.status === filter)
//     : orders;

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">All Orders</h2>
//       <div className="mb-4 space-x-2">
//         <button onClick={() => setFilter("")}>All</button>
//         <button onClick={() => setFilter("pending")}>Pending</button>
//         <button onClick={() => setFilter("accepted")}>Accepted</button>
//         <button onClick={() => setFilter("on_the_way")}>On The Way</button>

//         <button onClick={() => setFilter("in_progress")}>In Progress</button>
//         <button onClick={() => setFilter("completed")}>Completed</button>
//       </div>
//       {filteredOrders.map((order) => (
//         <div key={order._id} className="border p-4 mb-3 rounded shadow">
//           <p>Order ID: {order._id}</p>
//           <p>Status: {order.status}</p>
//           {/* <p>Vendor: {order.vendor?.name || "Unassigned"}</p> */}
//           <p>
//   Vendor: {order.vendor?.name || "Unassigned"}{" "}
//   {order.vendor && (
//     <span className={`ml-2 font-bold ${order.vendor.isOnline ? "text-green-600" : "text-red-600"}`}>
//       ({order.vendor.isOnline ? "Online" : "Offline"})
//     </span>
//   )}
// </p>

//         </div>
//       ))}
//     </div>
//   );
// };

// export default AllOrders;

import React, { useEffect, useState } from "react";
import { useWebSocket } from "../../context/WebSocketContext.jsx";
import api from "../../api/axios.js";

const AllOrders = () => {
  const { messages } = useWebSocket();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/orders");
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  // useEffect(() => {
  //   messages.forEach((data) => {
  //     if (data.topic === "vendor/status") {
  //       const { vendorId, status } = data.data;
  //       setOrders((prev) =>
  //         prev.map((o) =>
  //           o.vendor && o.vendor._id === vendorId
  //             ? { ...o, vendor: { ...o.vendor, isOnline: status === "online" } }
  //             : o
  //         )
  //       );
  //     }

  //     if (data.topic === "orders/update") {
  //       setOrders((prev) =>
  //         prev.map((o) => (o._id === data.data.orderId ? { ...o, status: data.data.status } : o))
  //       );
  //     }

  //     if (data.topic === "orders/update") {
  //       setOrders((prev) => [data.data, ...prev]);
  //     }
  //   });
  // }, [messages]);

useEffect(() => {
  messages.forEach((data) => {
    if (data.topic === "orders/update") {
      setOrders((prev) =>
        prev.map((o) =>
          o._id === data.data.orderId
            ? { ...o, status: data.data.status, vendor: data.data.vendor }
            : o
        )
      );
    }

    if (data.topic === "orders/new") {
      setOrders((prev) => [data.data, ...prev]);
    }

    if (data.topic === "vendor/status") {
      setOrders((prev) =>
        prev.map((o) =>
          o.vendor?._id === data.data.vendorId
            ? { ...o, vendor: { ...o.vendor, isOnline: data.data.status === "online" } }
            : o
        )
      );
    }
  });
}, [messages]);


  const filteredOrders = filter
    ? orders.filter((o) => o.status === filter)
    : orders;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      <div className="mb-4 space-x-2">
        {["All", "pending", "accepted", "on_the_way", "in_progress", "completed"].map((f) => (
          <button key={f} onClick={() => setFilter(f === "All" ? "" : f)}>
            {f}
          </button>
        ))}
      </div>
      {filteredOrders.map((order) => (
        <div key={order._id} className="border p-4 mb-3 rounded shadow">
          <p>Order ID: {order._id}</p>
          <p>Status: {order.status}</p>
          <p>
            Vendor: {order.vendor?.name || "Unassigned"}{" "}
            {order.vendor && (
              <span className={`ml-2 font-bold ${order.vendor.isOnline ? "text-green-600" : "text-red-600"}`}>
                ({order.vendor.isOnline ? "Online" : "Offline"})
              </span>
            )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AllOrders;

