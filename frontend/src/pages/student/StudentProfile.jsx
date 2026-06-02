import React, { useEffect, useState } from 'react';
import {
  Badge,
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
            <div className="lg:col-span-2">
              <p className="text-sm font-medium text-slate-500">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      className="flex items-center gap-2"
                    >
                      <Badge className="bg-indigo-50 text-indigo-700">
                        {skill.skill_name}
                      </Badge>

                      <button
                        onClick={() =>
                          handleRemoveSkill(skill.skill_id)
                        }
                        className="text-red-500 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">
                    No skills added yet.
                  </p>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <input
                  value={newSkill}
                  onChange={(e) =>
                    setNewSkill(e.target.value)
                  }
                  placeholder="Add Skill"
                  className="rounded border px-3 py-2"
                />

                <button
                  onClick={handleAddSkill}
                  className="rounded bg-indigo-600 px-4 py-2 text-white"
                >
                  Add Skill
                </button>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Latest Resume</p>
                <div className="mt-3 space-y-3">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                      setResumeFile(e.target.files[0])
                    }
                  />

                  <button
                    onClick={handleResumeUpload}
                    disabled={uploading}
                    className="rounded bg-indigo-600 px-4 py-2 text-white"
                  >
                    {uploading
                      ? 'Uploading...'
                      : 'Upload Resume'}
                  </button>

                  {latestResume && (
                    <a
                      href={`http://localhost:5001/${latestResume.resume_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  )}
                </div>
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
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value || '-'}</span>
    </div>
  );
}
