import api from "./api";

 const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

 const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

 const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};


export { registerUser, loginUser, logoutUser };