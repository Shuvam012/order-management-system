// src/pages/Customer/CreateOrder.jsx
import React, { useState, useEffect } from "react";
import { useOrders } from "../../context/OrderContext";
import { createOrder as createOrderApi, fetchCustomerOrders } from "../../api/orderApi";

const CreateOrder = () => {
    const { orders, addOrder, loadCustomerOrders } = useOrders();

    const [formData, setFormData] = useState({
        items: "",
        totalAmount: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load existing customer orders on mount
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
            const newOrder = await createOrderApi(formData);
            // addOrder(newOrder); // Add locally
            setFormData({ items: "", totalAmount: "" });
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Create New Order</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="items"
                    placeholder="Items (comma separated)"
                    value={formData.items}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="number"
                    name="totalAmount"
                    placeholder="Total Amount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Creating..." : "Create Order"}
                </button>
            </form>

            {/* Customer Order List */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-2">Your Orders</h3>
                {orders.length === 0 && <p>No orders yet.</p>}
                <ul className="space-y-2">
                    {orders
                    .filter(order => order && (order._id || order.id))
                    .map((order,index) => (
                        <li
                            key={order._id || order.id || index}
                            className="border p-3 rounded flex justify-between items-center"
                        >
                            <div>
                                <p><strong>Items:</strong> {order.items}</p>
                                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CreateOrder;
