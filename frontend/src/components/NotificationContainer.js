import React from 'react';
import { useNotifications } from '../NotificationContext';
import '../styles/Notifications.css';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications();
  return (
    <div className="notification-container">
      {notifications.map((note) => (
        <div key={note.id} className="notification">
          <span className="notification-message">{note.message}</span>
          <button
            type="button"
            className="notification-close"
            aria-label="Close notification"
            onClick={() => removeNotification(note.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
