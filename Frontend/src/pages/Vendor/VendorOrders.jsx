

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { useWebSocket } from "../../context/WebSocketContext.jsx";
import api from "../../api/axios.js";

// The strict order of operations
const STATUS_ORDER = ["pending", "accepted", "in_progress", "on_the_way", "completed"];

const VendorOrders = () => {
  const { user } = useAuthContext();
  const { lastMessage } = useWebSocket();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.get("/orders/vendor");
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!lastMessage) return;
    const { topic, data } = lastMessage;
    if (topic === "orders/new") {
      if (!data.vendor || data.vendor?._id === user?._id) {
        setOrders((prev) => (prev.find((o) => o._id === data._id) ? prev : [data, ...prev]));
      }
    }
    if (topic === "orders/update") {
      setOrders((prev) => prev.map((o) => (o._id === data._id ? data : o)));
    }
  }, [lastMessage, user]);

  const updateStatus = async (orderId, status) => {
    try {
      const res = await api.put(`/orders/${orderId}`, { status });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data : o)));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
        Live Vendor Dashboard
      </h2>

      <div className="space-y-4">
        {orders.map((order) => {
          // Find the "rank" of the current status
          const currentStatusIndex = STATUS_ORDER.indexOf(order.status);

          return (
            <div key={order._id} className="bg-white border rounded-xl p-5 shadow-sm">
              
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-sm font-bold text-gray-500">#{order._id.slice(-6)}</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 uppercase text-gray-600">
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {STATUS_ORDER.slice(1).map((status) => {
                  const targetIndex = STATUS_ORDER.indexOf(status);
                  const isCompleted = currentStatusIndex >= targetIndex;
                  const isNextStep = targetIndex === currentStatusIndex + 1;
                  
                  return (
                    <button
                      key={status}
                      disabled={isCompleted || !isNextStep}
                      onClick={() => updateStatus(order._id, status)}
                      className={`py-2 px-3 rounded-lg text-sm font-bold transition-all border
                        ${isCompleted 
                          ? "bg-green-50 border-green-200 text-green-600 cursor-default" 
                          : isNextStep 
                            ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 shadow-md"
                            : "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isCompleted && <span>✓</span>}
                        {status.replace("_", " ")}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorOrders;
