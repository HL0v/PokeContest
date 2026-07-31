import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { apiService } from '../services/api';

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = apiService.getCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    
    const loadNotifications = async () => {
      try {
        const notifs = await apiService.getNotifications(currentUser.id);
        const count = await apiService.getUnreadCount(currentUser.id);
        setNotifications(notifs);
        setUnreadCount(count);
      } catch (e) {
        console.error('Failed to load notifications', e);
      }
    };
    
    loadNotifications();

    // Close when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [currentUser]);

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await apiService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {}
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    try {
      await apiService.markAllAsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button className="icon-btn" onClick={toggleDropdown}>
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span>Notificações</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllAsRead}>Marcar todas como lidas</button>
            )}
          </div>
          
          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">Nenhuma notificação encontrada.</div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(notif.id, notif.read)}
                >
                  <div className="notification-message">{notif.message || notif.text}</div>
                  <div className="notification-time">
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Recente'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
