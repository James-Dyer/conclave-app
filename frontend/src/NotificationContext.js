import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {}
});

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((n) => n.filter((note) => note.id !== id));
  }, []);

  const addNotification = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, ...options }]);
    const duration = options.duration === undefined ? 5000 : options.duration;
    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration);
    }
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}
