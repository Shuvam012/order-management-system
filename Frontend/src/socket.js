const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
  console.log("WebSocket connected");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Real-time update:", data);
};

export default socket;