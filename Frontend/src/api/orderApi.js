// import axios from "axios";

// const API_URL = "http://localhost:5000/api/orders";

// const createOrder = async (orderData) => {
//     const res = await axios.post(API_URL, orderData, { withCredentials: true });
//     return res.data;
// };

// const fetchCustomerOrders = async () => {
//     const res = await axios.get(API_URL, { withCredentials: true });
//     return res.data;
// };

// const fetchVendorOrders = async () => {
//     const res = await axios.get(`${API_URL}/vendor`, { withCredentials: true });
//     return res.data;
// };

// const updateOrderStatus = async (orderId, status) => {
//     const res = await axios.put(`${API_URL}/${orderId}`, { status }, { withCredentials: true });
//     return res.data;
// };

// const fetchAllOrders = async () => {
//     const res = await axios.get(API_URL, { withCredentials: true });
//     return res.data;
// };


// export { createOrder, fetchCustomerOrders, fetchVendorOrders, updateOrderStatus, fetchAllOrders };


import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create order
export const createOrder = async (data) => {
  const res = await axios.post(`${API_URL}/orders`, data, { withCredentials: true });
  return res.data;
};

// Fetch customer orders
// export const fetchCustomerOrders = async () => {
//   const res = await axios.get(`${API_URL}/orders/customer`, { withCredentials: true });
//   return res.data;
// };

export const fetchCustomerOrders = async () => {
  const res = await axios.get(`${API_URL}/orders/customer`, { withCredentials: true });
  return res.data;
};

// Fetch vendor orders
export const fetchVendorOrders = async () => {
  const res = await axios.get(`${API_URL}/orders/vendor`, { withCredentials: true });
  return res.data;
};

// Fetch all orders (admin)
export const fetchAllOrders = async () => {
  const res = await axios.get(`${API_URL}/orders`, { withCredentials: true });
  return res.data;
};

// Update order (vendor)
export const updateOrderStatus = async (orderId, status) => {
  const res = await axios.put(`${API_URL}/orders/${orderId}`, { status }, { withCredentials: true });
  return res.data;
};
