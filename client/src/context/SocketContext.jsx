import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import API_BASE from "../config/api.js";

const SocketContext = createContext();

// Define backend address dynamically
const SOCKET_URL = API_BASE;

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect if the user is authenticated
    if (!user) {
      if (socket) socket.disconnect();
      return;
    }

    const newSocket = io(SOCKET_URL);

    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO backend:", newSocket.id);
      
      // Join a room for the user's specific ID (for direct notifications)
      newSocket.emit("join", user._id);
      
      // Join a role-based room (e.g. 'shelter', 'store', 'volunteer', 'admin')
      if (user.role) {
        newSocket.emit("join_role", user.role);
      }
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
