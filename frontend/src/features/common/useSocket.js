import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8080';

let socketInstance = null;

function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

/**
 * Hook to connect/disconnect from Socket.io
 */
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return { socket: getSocket(), isConnected };
}

/**
 * Hook to track live viewer count on a product page
 */
export function useViewerCount(productId) {
  const [viewerCount, setViewerCount] = useState(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!productId || !socket) return;

    socket.emit('view-product', productId);

    const handleViewerCount = (data) => {
      if (data.productId === productId) {
        setViewerCount(data.count);
      }
    };

    socket.on('viewer-count', handleViewerCount);

    return () => {
      socket.emit('leave-product');
      socket.off('viewer-count', handleViewerCount);
    };
  }, [productId, socket]);

  return viewerCount;
}

/**
 * Hook for purchase notifications (social proof toasts)
 */
export function usePurchaseNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handlePurchase = (notification) => {
      setNotifications((prev) => [...prev.slice(-4), notification]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    };

    const handleRecentPurchases = (purchases) => {
      if (purchases && purchases.length > 0) {
        // Show the most recent one as a toast
        const latest = purchases[purchases.length - 1];
        handlePurchase(latest);
      }
    };

    socket.on('purchase-notification', handlePurchase);
    socket.on('recent-purchases', handleRecentPurchases);

    return () => {
      socket.off('purchase-notification', handlePurchase);
      socket.off('recent-purchases', handleRecentPurchases);
    };
  }, [socket]);

  return notifications;
}
