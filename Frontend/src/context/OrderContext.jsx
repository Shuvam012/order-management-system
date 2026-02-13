




import { createContext, useReducer, useContext, useEffect } from "react";
import {
  fetchCustomerOrders,
  fetchVendorOrders,
  fetchAllOrders,
} from "../api/orderApi";
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

    default:
      return state;
  }
};

export const OrderProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { lastMessage } = useWebSocket(); // ✅ ONLY THIS

  // ---- API LOADERS ----
  const loadCustomerOrders = async () => {
    const orders = await fetchCustomerOrders();
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  const loadVendorOrders = async () => {
    const orders = await fetchVendorOrders();
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  const loadAllOrders = async () => {
    const orders = await fetchAllOrders();
    dispatch({ type: "SET_ORDERS", payload: orders });
  };

  // ---- REAL TIME UPDATES ----
  useEffect(() => {
    if (!lastMessage) return;

    const { topic, data } = lastMessage;

    if (topic === "orders/new") {
      dispatch({ type: "ADD_ORDER", payload: data });
    }

    if (topic === "orders/update") {
      dispatch({ type: "UPDATE_ORDER", payload: data });
    }
  }, [lastMessage]);

  return (
    <OrderContext.Provider
      value={{
        ...state,
        loadCustomerOrders,
        loadVendorOrders,
        loadAllOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
