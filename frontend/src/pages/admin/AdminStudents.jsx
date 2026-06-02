import { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { getStudents, updateStudent, deleteStudent } from '../../services/adminService';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing student states
  const [editingStudent, setEditingStudent] = useState(null); // student object
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await getStudents();
      setStudents(data.students || []);
      setTotal(data.total ?? data.students?.length ?? 0);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load students');
    }
  };

  useEffect(() => {
    let mounted = true;
    const initialLoad = async () => {
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
    initialLoad();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setName(student.name || '');
    setPhone(student.phone || '');
    setDepartment(student.department || '');
    setCourse(student.course || '');
    setCgpa(student.cgpa || '');
    setPassingYear(student.passing_year || '');
    setSaveError('');
  };

  const handleSaveSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');
    if (!name || !department || !course || !cgpa || !passingYear) {
      setSaveError('All standard fields are required');
      return;
    }
    setSaving(true);
    try {
      await updateStudent(editingStudent.student_id, {
        name,
        phone,
        department,
        course,
        cgpa: Number(cgpa),
        passing_year: Number(passingYear)
      });
      alert('Student profile updated successfully!');
      setEditingStudent(null);
      await load();
    } catch (err) {
      setSaveError(err?.response?.data?.message || 'Failed to update student profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (studentId) => {
    const confirmed = window.confirm('Are you sure you want to permanently delete this student account? This cannot be undone.');
    if (!confirmed) return;

    try {
      await deleteStudent(studentId);
      alert('Student account deleted successfully');
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete student account');
    }
  };

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
                  <th className="px-6 py-4">Department & Course</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4">Passing year</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-slate-50/30 transition-colors duration-200">
                    <td className="px-6 py-4.5 font-bold text-slate-800">{student.roll_no}</td>
                    <td className="px-6 py-4.5 font-semibold text-slate-700">{student.name}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-500 font-semibold">{student.email}</td>
                    <td className="px-6 py-4.5">
                      <div className="text-xs text-slate-650 font-bold">{student.department}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{student.course}</div>
                    </td>
                    <td className="px-6 py-4.5 text-sm font-extrabold text-indigo-600">{student.cgpa}</td>
                    <td className="px-6 py-4.5 text-xs text-slate-400 font-medium">{student.passing_year}</td>
                    <td className="px-6 py-4.5 text-right text-xs">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(student)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-bold text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student.student_id)}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No students found" description="Student accounts will appear here after registration." />
        )}
      </SectionCard>

      {/* Edit Student Modal Overlay */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setEditingStudent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-extrabold text-slate-800">Edit Student Profile</h3>
            <p className="text-xs text-slate-500 mt-1">
              Editing record for <strong>{editingStudent.roll_no}</strong> ({editingStudent.email})
            </p>

            {saveError && (
              <div className="mt-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 px-3 py-2">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSaveSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Course</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={cgpa}
                    onChange={(e) => setCgpa(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Passing Year</label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={passingYear}
                    onChange={(e) => setPassingYear(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/10 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
