// src/pages/admin/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { listenServices, listenExams, listenNotifications } from '../../firebase/services';
import {
  FaConciergeBell, FaCalendarAlt, FaBell, FaArrowRight,
  FaCheckCircle, FaClock, FaTimesCircle,
} from 'react-icons/fa';

const fmt = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [exams,    setExams]    = useState([]);
  const [notifs,   setNotifs]   = useState([]);

  useEffect(() => {
    const u1 = listenServices(setServices);
    const u2 = listenExams(setExams);
    const u3 = listenNotifications(setNotifs);
    return () => { u1(); u2(); u3(); };
  }, []);

  const examCounts = exams.reduce((a, e) => {
    a[e.status] = (a[e.status] || 0) + 1; return a;
  }, {});

  const STAT_CARDS = [
    { label: t('totalServices'), value: services.length, Icon: FaConciergeBell, color: 'bg-primary-50 text-primary-600', link: '/admin/services' },
    { label: t('totalExams'),    value: exams.length,    Icon: FaCalendarAlt,   color: 'bg-blue-50 text-blue-600',    link: '/admin/exams' },
    { label: t('totalNotifs'),   value: notifs.length,   Icon: FaBell,          color: 'bg-amber-50 text-amber-600',  link: '/admin/notifications' },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-2xl p-6 text-white">
        <h1 className="font-display font-extrabold text-xl">Welcome back! 👋</h1>
        <p className="text-primary-200 text-sm mt-1">Royal Computers Admin Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map((s, i) => (
          <Link key={i} to={s.link}
            className="card p-5 flex items-center gap-4 hover:border-primary-200 border-2 border-transparent transition-all"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
              <s.Icon className="text-xl" />
            </div>
            <div>
              <p className="text-2xl font-display font-extrabold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Exam Status Breakdown */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { key:'ongoing',  Icon:FaClock,      color:'text-green-600 bg-green-50',  label:'Ongoing Exams' },
          { key:'upcoming', Icon:FaCheckCircle,color:'text-blue-600 bg-blue-50',    label:'Upcoming Exams' },
          { key:'closed',   Icon:FaTimesCircle,color:'text-red-500 bg-red-50',      label:'Closed Exams' },
        ].map(s => (
          <div key={s.key} className={`rounded-2xl p-4 flex items-center gap-3 ${s.color.split(' ')[1]}`}>
            <s.Icon className={`text-2xl ${s.color.split(' ')[0]}`} />
            <div>
              <p className={`text-xl font-display font-extrabold ${s.color.split(' ')[0]}`}>
                {examCounts[s.key] || 0}
              </p>
              <p className="text-xs font-medium text-gray-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card p-5">
        <h2 className="font-display font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to:'/admin/services',      icon:'🛠️',  label:'Add Service' },
            { to:'/admin/exams',         icon:'📅',  label:'Add Exam' },
            { to:'/admin/notifications', icon:'🔔',  label:'Send Notification' },
            { to:'/admin/contact-settings', icon:'📞', label:'Update Contact' },
          ].map((a, i) => (
            <Link key={i} to={a.to}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-primary-50 rounded-2xl transition-all group border border-gray-100 hover:border-primary-200"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-primary-700 text-center">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Notifications */}
      {notifs.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-800">{t('recentActivity')}</h2>
            <Link to="/admin/notifications" className="text-xs text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1">
              View all <FaArrowRight />
            </Link>
          </div>
          <div className="space-y-2">
            {notifs.slice(0, 5).map(n => (
              <div key={n.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">{n.icon || '📢'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{n.title}</p>
                  <p className="text-xs text-gray-500 truncate">{n.body}</p>
                </div>
                <p className="text-xs text-gray-400 flex-shrink-0">{fmt(n.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
