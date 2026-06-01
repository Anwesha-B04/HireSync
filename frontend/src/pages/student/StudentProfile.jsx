import React, { useEffect, useState } from 'react';
import {
  Badge,
  EmptyState,
  ErrorPanel,
  LoadingPanel,
  PageHeader,
  SectionCard,
} from '../../components/dashboard/DashboardUI';
import { getProfile } from '../../services/studentService';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
                    <Badge key={skill} className="bg-indigo-50 text-indigo-700">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No skills added yet.</p>
                )}
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500">Latest Resume</p>
                <p className="mt-1 text-sm text-slate-700">
                  {latestResume ? latestResume.resume_path : 'No resume uploaded yet.'}
                </p>
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
