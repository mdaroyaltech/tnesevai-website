// src/components/admin/AdminLayout.js
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaTachometerAlt, FaConciergeBell, FaCalendarAlt,
  FaBell, FaPhoneAlt, FaSignOutAlt, FaBars, FaTimes,
  FaShieldAlt, FaExternalLinkAlt, FaLayerGroup, FaImage,
} from 'react-icons/fa';

const NAV = [
  { to: '/admin',                  label: 'dashboard',       Icon: FaTachometerAlt, exact: true },
  { to: '/admin/bulk-import',      label: 'Bulk Import',     Icon: FaLayerGroup },
  { to: '/admin/services',         label: 'manageServices',  Icon: FaConciergeBell },
  { to: '/admin/exams',            label: 'manageExams',     Icon: FaCalendarAlt },
  { to: '/admin/notifications',    label: 'sendNotif',       Icon: FaBell },
  { to: '/admin/logo-settings',    label: 'Logo & Icon',     Icon: FaImage },
  { to: '/admin/contact-settings', label: 'contactSettings', Icon: FaPhoneAlt },
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login');
  };

  const isActive = (to, exact) =>
    exact ? pathname === to : pathname.startsWith(to) && to !== '/admin';

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-primary-700 text-sm">RC</div>
          <div>
            <p className="text-white font-display font-bold text-sm leading-tight">Royal Computers</p>
            <p className="text-primary-300 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ to, label, Icon, exact }) => (
          <Link key={to} to={to}
            onClick={() => setSideOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${(exact ? pathname === to : pathname === to || (pathname.startsWith(to) && to !== '/admin'))
                ? 'bg-white text-primary-700 shadow-md'
                : 'text-primary-100 hover:bg-primary-600'
              }`}
          >
            <Icon className="text-sm flex-shrink-0" />
            {label === 'Bulk Import' ? (
              <span className="flex items-center gap-1.5">Bulk Import <span className="bg-gold-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span></span>
            ) : label === 'Logo & Icon' ? 'Logo & Icon'
            : t(label)}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-primary-700 space-y-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-200 hover:bg-primary-600 hover:text-white transition-all"
        >
          <FaExternalLinkAlt className="text-xs" /> View Public Site
        </a>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all"
        >
          <FaSignOutAlt className="text-sm" /> {t('logout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 bg-primary-800 flex-col flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sideOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSideOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-56 bg-primary-800 z-50 flex flex-col lg:hidden animate-slide-in">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <FaBars className="text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-primary-600 text-sm" />
              <span className="font-display font-bold text-gray-800 text-sm">{t('adminPanel')}</span>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
          >
            <FaSignOutAlt /> {t('logout')}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
