'use client';

import { createContext, useContext, useEffect, useState } from 'react';
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

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const userId = localStorage.getItem('userId');
    const token = getCookie('token');

    if (!userId || !token) return;

    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: {
        userId: userId,
        token: token
      },
      autoConnect: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Socket connected');
      socketInstance.emit('join_user_room', userId);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    // Heartbeat
    socketInstance.on('ping', () => {
      socketInstance.emit('pong');
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};