



import React, { useEffect, useState, useRef } from "react";
import { useWebSocket } from "../../context/WebSocketContext.jsx";
import api from "../../api/axios.js";

const AllOrders = () => {
  const { lastMessage } = useWebSocket();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");
  const ordersLoaded = useRef(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        setOrders(res.data);
        ordersLoaded.current = true;
      } catch (err) { console.error(err); }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!lastMessage || !ordersLoaded.current) return;
    const { topic, data } = lastMessage;

    if (topic === "orders/new") {
      setOrders(prev => (prev.find(o => o._id === data._id) ? prev : [data, ...prev]));
    }
    if (topic === "orders/update") {
      setOrders(prev => prev.map(o => (o._id === data._id ? data : o)));
    }

    if (topic === "vendor/status") {
      setOrders(prev => prev.map(o =>
        o.vendor?._id === data.vendorId
          ? { ...o, vendor: { ...o.vendor, isOnline: data.status === "online" } }
          : o
      ));
    }
  }, [lastMessage]);

  const filteredOrders = filter ? orders.filter(o => o.status === filter) : orders;

  return (
    <div className="max-w-5xl mx-auto p-8 font-sans antialiased text-slate-900">
      <div className="flex justify-between items-baseline mb-8">
        <h1 className="text-xl font-semibold tracking-tight">Order Log</h1>
        <span className="text-xs font-mono text-slate-400">{orders.length} TOTAL</span>
      </div>

      {/* Minimal Filter Bar */}
      <div className="flex gap-6 border-b border-slate-100 mb-6 text-sm">
        {["All", "pending", "accepted", "in_progress", "on_the_way", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f === "All" ? "" : f)}
            className={`pb-3 transition-colors capitalize ${(filter === f || (f === "All" && filter === ""))
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-slate-400 hover:text-slate-600"
              }`}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Minimalist List */}
      <div className="space-y-1">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
          >
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-400 transition-colors" />
              <div>
                <p className="text-sm font-mono text-slate-500">#{order._id.slice(-6)}</p>
              </div>
            </div>

            <div className="flex-1 px-12">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{order.vendor?.name || "Unassigned"}</span>
                {order.vendor && (
                  <span className={`w-1.5 h-1.5 rounded-full ${order.vendor.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${order.status === 'completed' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                }`}>
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-center py-20 text-sm text-slate-400 italic">No orders in this category.</p>
      )}
    </div>
  );
};

export default AllOrders;
