import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { COMPANY_NAV } from '../utils/dashboardNav';

export default function CompanyLayout() {
  return <DashboardLayout brand="Company Portal" navItems={COMPANY_NAV} />;
}
