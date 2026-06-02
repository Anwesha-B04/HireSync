import DashboardLayout from '../components/dashboard/DashboardLayout';
import { STUDENT_NAV } from '../utils/dashboardNav';

export default function StudentLayout() {
  return <DashboardLayout brand="Student Portal" navItems={STUDENT_NAV} />;
}
