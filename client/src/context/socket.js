import { io } from "socket.io-client";

const PORT = process.env.PORT || "http://localhost:8080";
const socket = io(PORT, { autoConnect: false });

export default socket;
