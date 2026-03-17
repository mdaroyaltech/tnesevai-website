// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Public
import PublicLayout   from './components/public/PublicLayout';
import HomePage       from './pages/public/HomePage';
import ServicesPage   from './pages/public/ServicesPage';
import ExamDatesPage  from './pages/public/ExamDatesPage';
import AboutPage      from './pages/public/AboutPage';
import ContactPage    from './pages/public/ContactPage';

// Admin
import LoginPage             from './pages/admin/LoginPage';
import AdminLayout           from './components/admin/AdminLayout';
import DashboardPage         from './pages/admin/DashboardPage';
import ManageServicesPage    from './pages/admin/ManageServicesPage';
import ManageExamsPage       from './pages/admin/ManageExamsPage';
import SendNotificationPage  from './pages/admin/SendNotificationPage';
import ContactSettingsPage   from './pages/admin/ContactSettingsPage';
import BulkImportPage        from './pages/admin/BulkImportPage';
import LogoSettingsPage      from './pages/admin/LogoSettingsPage';

const Guard = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            {/* ── Public ── */}
            <Route path="/" element={<PublicLayout />}>
              <Route index        element={<HomePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="exams"    element={<ExamDatesPage />} />
              <Route path="about"    element={<AboutPage />} />
              <Route path="contact"  element={<ContactPage />} />
            </Route>

            {/* ── Admin ── */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<Guard><AdminLayout /></Guard>}>
              <Route index                    element={<DashboardPage />} />
              <Route path="services"          element={<ManageServicesPage />} />
              <Route path="exams"             element={<ManageExamsPage />} />
              <Route path="notifications"     element={<SendNotificationPage />} />
              <Route path="contact-settings"  element={<ContactSettingsPage />} />
              <Route path="bulk-import"       element={<BulkImportPage />} />
              <Route path="logo-settings"     element={<LogoSettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
