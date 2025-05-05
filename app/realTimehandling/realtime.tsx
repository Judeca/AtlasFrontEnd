'use client'

import { useEffect } from "react";
import { useSocket } from '@/app/context/SocketContext';
import { handleLogout } from "@/lib/auth";

const RealTimeImplementations = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const logoutHandler = () => {
      console.log("Received role change event, logging out...");
      handleLogout();
    };

    socket.on('user_role_changed', logoutHandler);

    return () => {
      socket.off('user_role_changed', logoutHandler);
    };
  }, [socket]);

  return null; // nothing to render
};

export default RealTimeImplementations;
