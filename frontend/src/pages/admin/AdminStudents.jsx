import { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { getStudents } from '../../services/adminService';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getStudents();
        if (!mounted) return;
        setStudents(data.students || []);
        setTotal(data.total ?? data.students?.length ?? 0);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load students');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingPanel message="Loading students..." />;
  if (error) return <ErrorPanel message={error} />;

  return (
    <div>
      <PageHeader
        eyebrow="Students"
        title="Student Management"
        description={`${total} registered students in the placement system.`}
      />

      <SectionCard title="Student List">
        {students.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 bg-white">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/70 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Full name</th>
                  <th className="px-6 py-4">Email address</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Passing year</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-50/30 transition-colors duration-200">
                    <td className="px-6 py-4.5 font-bold text-slate-800">{student.roll_no}</td>
                    <td className="px-6 py-4.5 font-semibold text-slate-700">{student.name}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{student.email}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-500 font-bold">{student.department}</td>
                    <td className="px-6 py-4.5 text-sm font-extrabold text-indigo-600">{student.cgpa}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">{student.passing_year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No students found" description="Student accounts will appear here after registration." />
        )}
      </SectionCard>
    </div>
  );
}
