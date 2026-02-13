// import { createContext, useReducer, useContext } from "react";
// import { createOrder, fetchCustomerOrders, fetchVendorOrders, updateOrderStatus, fetchAllOrders } from "../api/orderApi";
// import { useWebSocket } from "./WebSocketContext";
// import { useEffect } from "react";

// const OrderContext = createContext();

// const initialState = {
//     orders: [],
//     loading: false,
//     error: null,
// };

// const orderReducer = (state, action) => {
//     switch (action.type) {
//         case "SET_ORDERS":
//             return { ...state, orders: action.payload };
//         case "ADD_ORDER":
//             return { ...state, orders: [action.payload, ...state.orders] };
//         case "UPDATE_ORDER":
//             return {
//                 ...state,
//                 orders: state.orders.map(o => o._id === action.payload._id ? action.payload : o),
//             };
//         case "ORDER_ERROR":
//             return { ...state, error: action.payload };
//         default:
//             return state;
//     }
// };

// export const OrderProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(orderReducer, initialState);

//     const loadCustomerOrders = async () => {
//         try {
//             const orders = await fetchCustomerOrders();
//             dispatch({ type: "SET_ORDERS", payload: orders });
//         } catch (err) {
//             dispatch({ type: "ORDER_ERROR", payload: err.response?.data?.message || err.message });
//         }
//     };

//     const loadVendorOrders = async () => {
//         try {
//             const orders = await fetchVendorOrders();
//             dispatch({ type: "SET_ORDERS", payload: orders });
//         } catch (err) {
//             dispatch({ type: "ORDER_ERROR", payload: err.response?.data?.message || err.message });
//         }
//     };

//     const loadAllOrders = async () => {
//         try {
//             const orders = await fetchAllOrders();
//             dispatch({ type: "SET_ORDERS", payload: orders });
//         } catch (err) {
//             dispatch({ type: "ORDER_ERROR", payload: err.response?.data?.message || err.message });
//         }
//     };

//     const addOrder = (order) => dispatch({ type: "ADD_ORDER", payload: order });
//     const updateOrder = (order) => dispatch({ type: "UPDATE_ORDER", payload: order });

//     return (
//         <OrderContext.Provider value={{ ...state, loadCustomerOrders, loadVendorOrders, loadAllOrders, addOrder, updateOrder }}>
//             {children}
//         </OrderContext.Provider>
//     );
// };

// export const useOrders = () => useContext(OrderContext);





import { createContext, useReducer, useContext, useEffect } from "react";
import { createOrder, fetchCustomerOrders, fetchVendorOrders, updateOrderStatus, fetchAllOrders } from "../api/orderApi";
import { useWebSocket } from "./WebSocketContext";

const OrderContext = createContext();

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderReducer = (state, action) => {
  switch (action.type) {
    case "SET_ORDERS":
      return { ...state, orders: action.payload };
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "UPDATE_ORDER":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        ),
      };
    case "ORDER_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { ws } = useWebSocket();

  // Load customer orders
  const loadCustomerOrders = async () => {
    try {
      const orders = await fetchCustomerOrders();
      dispatch({ type: "SET_ORDERS", payload: orders });
    } catch (err) {
      dispatch({
        type: "ORDER_ERROR",
        payload: err.response?.data?.message || err.message,
      });
    }
  };

  // Load vendor orders
  const loadVendorOrders = async () => {
    try {
      const orders = await fetchVendorOrders();
      dispatch({ type: "SET_ORDERS", payload: orders });
    } catch (err) {
      dispatch({
        type: "ORDER_ERROR",
        payload: err.response?.data?.message || err.message,
      });
    }
  };

  // Load all orders (Admin)
  const loadAllOrders = async () => {
    try {
      const orders = await fetchAllOrders();
      dispatch({ type: "SET_ORDERS", payload: orders });
    } catch (err) {
      dispatch({
        type: "ORDER_ERROR",
        payload: err.response?.data?.message || err.message,
      });
    }
  };

  // Add new order locally
  const addOrder = (order) => dispatch({ type: "ADD_ORDER", payload: order });

  // Update order locally
  const updateOrder = (order) =>
    dispatch({ type: "UPDATE_ORDER", payload: order });

  // Listen for real-time updates via WebSocket
  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      try {
        const { topic, data } = JSON.parse(event.data);

        if (topic === "orders/new") {
          dispatch({ type: "ADD_ORDER", payload: data });
        }
        if (topic === "orders/update") {
          dispatch({ type: "UPDATE_ORDER", payload: data });
        }
        if (topic === "vendor/status") {
          // Optional: handle vendor online/offline
          console.log("Vendor status:", data);
        }
      } catch (err) {
        console.error("WebSocket parse error:", err);
      }
    };

    return () => {
      ws.onmessage = null; // cleanup
    };
  }, [ws]);

  return (
    <OrderContext.Provider
      value={{
        ...state,
        loadCustomerOrders,
        loadVendorOrders,
        loadAllOrders,
        addOrder,
        updateOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
