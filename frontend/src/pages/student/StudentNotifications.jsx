import { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { formatDate } from '../../utils/dashboardUtils';
import { getNotifications, markNotificationRead } from '../../services/studentService';

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');



  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        setLoading(true);
        setError('');
        const data = await getNotifications();
        if (active) {
          setNotifications(data.notifications || []);
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load notifications');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.is_read);
      await Promise.all(unread.map((n) => markNotificationRead(n.notification_id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingPanel message="Loading notifications..." />;
  if (error) return <ErrorPanel message={error} />;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <PageHeader
          eyebrow="Notifications"
          title="Notifications"
          description={unreadCount > 0 ? `You have ${unreadCount} unread updates.` : 'You are all caught up.'}
        />
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="rounded-xl border border-indigo-200 bg-indigo-50/50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 self-start sm:self-auto shadow-sm"
          >
            Mark All as Read
          </button>
        )}
      </div>

      <SectionCard title="Recent Updates">
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const isUnread = !notification.is_read;
              return (
                <div
                  key={notification.notification_id}
                  onClick={() => isUnread && handleMarkRead(notification.notification_id)}
                  className={`group rounded-2xl border p-5 transition-all duration-300 flex items-start justify-between gap-4 border-l-4 ${
                    isUnread
                      ? 'border-slate-300 bg-indigo-50/20 border-l-indigo-600 font-semibold cursor-pointer hover:bg-indigo-50/40'
                      : 'border-slate-200/80 bg-white border-l-slate-400 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnread ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm leading-normal ${isUnread ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">{formatDate(notification.created_at || notification.time)}</p>
                    </div>
                  </div>

                  {isUnread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkRead(notification.notification_id);
                      }}
                      className="text-xs font-bold text-indigo-500 hover:text-indigo-700 transition-colors shrink-0"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No notifications" description="You are all caught up." />
        )}
      </SectionCard>
    </div>
  );
}
