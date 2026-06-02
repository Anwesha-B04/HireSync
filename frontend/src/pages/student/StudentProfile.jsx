import { useEffect, useState } from 'react';
import {
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import {
  getProfile,
  uploadResume,
  addSkill,
  removeSkill
} from '../../services/studentService';
import { API_URL } from '../../services/api';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProfile();
        if (!mounted) return;
        setProfile(data.student || null);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.message || 'Unable to load profile');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <LoadingPanel message="Loading profile..." />;
  if (error) return <ErrorPanel message={error} />;

  const skills = profile?.skills || [];
  const latestResume = profile?.resumes?.[0];

  const refreshProfile = async () => {
    const data = await getProfile();
    setProfile(data.student);
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('resume', resumeFile);

      await uploadResume(formData);

      await refreshProfile();

      alert('Resume uploaded successfully');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    await addSkill(newSkill);

    setNewSkill('');

    await refreshProfile();
  };

  const handleRemoveSkill = async (skillId) => {
    await removeSkill(skillId);

    await refreshProfile();
  };

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Student Profile"
        description="Your academic details, skills, and resume information."
      />

      <SectionCard title="Profile Summary">
        {profile ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Row label="Name" value={profile.name} />
              <Row label="Roll Number" value={profile.roll_no} />
              <Row label="Email" value={profile.email || 'Not available'} />
              <Row label="Phone" value={profile.phone || 'Not provided'} />
            </div>
            <div className="space-y-3">
              <Row label="Department" value={profile.department} />
              <Row label="Course" value={profile.course} />
              <Row label="CGPA" value={profile.cgpa} />
              <Row label="Passing Year" value={profile.passing_year} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Professional Skills</p>
                <div className="flex flex-wrap gap-2.5">
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <div
                        key={skill.skill_id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
                      >
                        <span>{skill.skill_name}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill.skill_id)}
                          className="text-indigo-400 hover:text-indigo-700 transition-colors font-bold text-xs"
                          aria-label="Remove skill"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No skills added yet.</p>
                  )}
                </div>

                <div className="mt-4 flex gap-3 max-w-sm">
                  <input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. React"
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all duration-200 shrink-0"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-6 space-y-4">
                <div>
                  <p className="text-sm font-bold text-slate-800">Academic Resume PDF</p>
                  <p className="text-xs text-slate-500">Upload your latest PDF resume to share with recruiting companies.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />

                  <button
                    onClick={handleResumeUpload}
                    disabled={uploading}
                    className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 transition-all duration-200 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                  </button>
                </div>

                {latestResume && (
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Active Resume (Uploaded {new Date(latestResume.upload_date).toLocaleDateString()})</span>
                    </div>
                    <a
                      href={`${API_URL}/${latestResume.resume_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                    >
                      View Current Resume
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}

                {profile?.resumes && profile.resumes.length > 0 && (
                  <div className="pt-4 border-t border-slate-200/60 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Resume Upload History</p>
                    <div className="divide-y divide-slate-100 border border-slate-200/60 rounded-2xl bg-white overflow-hidden">
                      {profile.resumes.map((res, index) => (
                        <div key={res.resume_id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition-colors">
                          <span className="text-xs text-slate-500 font-semibold">
                            Resume Version {profile.resumes.length - index} (Uploaded: {new Date(res.upload_date).toLocaleString()})
                          </span>
                          <a
                            href={`${API_URL}/${res.resume_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline transition-colors"
                          >
                            View / Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <EmptyState title="No profile data found" description="Complete your student profile to see details here." />
        )}
      </SectionCard>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/40 px-5 py-3.5 hover:bg-slate-50 transition-colors">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value || '-'}</span>
    </div>
  );
}
