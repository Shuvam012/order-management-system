
import React, { useState, useEffect } from "react";
import { useOrders } from "../../context/OrderContext";
import { createOrder as createOrderApi } from "../../api/orderApi";

const CreateOrder = () => {
  const { orders, loadCustomerOrders } = useOrders();
  const [formData, setFormData] = useState({ items: "", totalAmount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCustomerOrders();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createOrderApi(formData);
      setFormData({ items: "", totalAmount: "" });
      loadCustomerOrders(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 antialiased text-slate-800">
      {/* Header */}
      <header className="mb-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Checkout</h2>
        <p className="text-slate-400 text-sm mt-1">Place your order details below</p>
      </header>

      {/* Simplified Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4 mb-12">
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        
        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Items</label>
          <input
            type="text"
            name="items"
            placeholder="Coffee, Croissant..."
            value={formData.items}
            onChange={handleChange}
            className="w-full bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 px-4 py-2.5 rounded-xl transition-all outline-none"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Amount (₹)</label>
          <input
            type="number"
            name="totalAmount"
            placeholder="0.00"
            value={formData.totalAmount}
            onChange={handleChange}
            className="w-full bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 px-4 py-2.5 rounded-xl transition-all outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-black transition-colors shadow-sm disabled:bg-slate-300"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>
      </form>

      {/* History Section */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b pb-2">Recent Orders</h3>
        {orders.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-10 italic">No order history found.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders
              .filter(order => order && (order._id || order.id))
              .map((order, index) => (
                <div key={order._id || index} className="py-4 flex justify-between items-center group">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{order.items}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">
                      ID: {String(order._id || order.id).slice(-6)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{order.totalAmount}</p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      order.status === 'completed' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreateOrder;
