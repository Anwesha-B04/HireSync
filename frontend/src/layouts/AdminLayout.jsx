import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { ADMIN_NAV } from '../utils/dashboardNav';

export default function AdminLayout() {
  return <DashboardLayout brand="Admin Portal" navItems={ADMIN_NAV} />;
}
