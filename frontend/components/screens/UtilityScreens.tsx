import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, CheckCircle2, Clock, Trash2, ArrowRight } from 'lucide-react';
import { apiGetNotifications, apiMarkNotificationRead } from '../../services/api';
import { NotificationItem } from '../../types';

// SCREEN 31: Notification Center Screen
export const NotificationCenterScreen: React.FC = () => {
  const { user, navigate } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    apiGetNotifications(user?.id).then(setNotifications);
  }, [user]);

  const handleMarkRead = async (id: string) => {
    await apiMarkNotificationRead(id);
    const updated = await apiGetNotifications(user?.id);
    setNotifications(updated);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 my-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Notification Center</h1>
          <p className="text-xs text-slate-500">System alerts, scan complete events & appointment updates</p>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between text-xs ${
              !n.isRead
                ? 'bg-teal-50/50 dark:bg-slate-800 border-teal-200 dark:border-slate-700 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
            }`}
          >
            <div className="space-y-1 flex-1 pr-4">
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  n.type === 'scan_complete' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                }`}>
                  {n.type.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white">{n.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
            </div>

            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n.id)}
                className="text-xs text-teal-600 font-bold hover:underline shrink-0"
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
