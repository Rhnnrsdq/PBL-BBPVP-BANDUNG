import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    const notification = { id, type, message };
    
    setNotifications(prev => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification
  };
}