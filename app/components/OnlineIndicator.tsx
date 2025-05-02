'use client';

import { useSocket } from '../context/SocketContext';

export const OnlineIndicator = () => {
  const { isConnected } = useSocket();

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${
        isConnected ? 'bg-green-500' : 'bg-gray-400'
      }`} />
      <span>{isConnected ? 'Online' : 'Offline'}</span>
    </div>
  );
};