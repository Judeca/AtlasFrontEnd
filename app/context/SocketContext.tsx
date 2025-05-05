'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { getCookie } from '@/lib/cookies';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  const hasInitialized = useRef(false); // prevent unnecessary polling

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasInitialized.current) return;

      const storedUserId = localStorage.getItem("userId");
      const storedToken = getCookie('token');

      console.log("Fetching userId and token...");

      if (storedUserId && !userId) {
        setUserId(storedUserId);
      }

      if (storedToken && !token) {
        setToken(storedToken);
      }

      if (storedUserId && storedToken) {
        hasInitialized.current = true;
        clearInterval(interval);
        console.log("Both values found. Stopping polling.");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [userId, token]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!userId || !token) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { userId, token },
      autoConnect: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      socketInstance.emit('join_user_room', userId);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('ping', () => {
      socketInstance.emit('pong');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.disconnect();
    };
  }, [userId, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
