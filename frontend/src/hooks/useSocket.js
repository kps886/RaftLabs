import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (orderId, onStatusUpdate) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!orderId) return;

    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('joinOrderRoom', orderId);
    });

    socketRef.current.on('orderStatusUpdated', (data) => {
      if (data.orderId === orderId) {
        onStatusUpdate(data.status);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [orderId]);
};