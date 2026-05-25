"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Link as LinkIcon, CheckCircle, RefreshCw, MonitorPlay, Sparkles, FileText, ChevronRight, X, ArrowLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function LMSDashboard() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/lms/assignments`);
      setAssignments(res.data);
    } catch (err) {} finally { setLoading(false); }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const loadSubmissions = async (a: any) => {
    setSelectedAssignment(a);
    setLoadingSubs(true);
    try {
      const res = await axios.get(`${API_BASE}/api/lms/${a._id}/submissions`);
      setSubmissions(res.data);
      setShowModal(false);
    } catch (err) {} finally { setLoadingSubs(false); }
  };

  const handleCopyLink = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`http://localhost:3000/test/${id}`);
    alert('Link copied to clipboard!');
  };

  const handleGradeAll = async () => {
    if (!selectedAssignment) return;
    setIsGrading(true);
    try {
      await axios.post(`${API_BASE}/api/lms/${selectedAssignment._id}/grade`);
      alert('Grading Complete!');
      await loadSubmissions(selectedAssignment);
      await fetchAssignments();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to grade submissions');
    } finally {
      setIsGrading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader2 className="animate-spin" size={48} /></div>;

  return (
    <div style={{ padding: '0', height: '100%', overflowY: 'auto' }}>
      {/* Top Header */}
      <div className="page-header-pill" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB', width: '100%', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#A9A9A9', fontWeight: 600 }}>
          <ArrowLeft size={20} color="#303030" style={{ cursor: 'pointer' }} onClick={() => window.history.back()} />
          <LayoutGrid size={18} color="#A9A9A9" /> 
          <span>Digital LMS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={20} color="#111827" />
            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=c4b5fd" alt="User" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>John Doe</span>
            <ChevronDown size={16} color="#111827" />
          </div>
        </div>
      </div>

      <div style={{ padding: '0', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#8B5CF6', border: '4px solid #EDE9FE' }}></div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#111827' }}>LMS Dashboard</h1>
          </div>
          <p style={{ color: '#6B7280', margin: 0, fontSize: '14px', paddingLeft: '28px' }}>Manage digital test links and auto-grade submissions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary" 
          style={{ padding: '12px 24px' }}
        >
          Select Assignment
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {selectedAssignment ? (
          <div className="form-card" style={{ maxWidth: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E5E7EB' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Submissions</h2>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)', marginTop: '4px' }}>For: {selectedAssignment.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={(e) => handleCopyLink(e, selectedAssignment._id)}
                  style={{ background: '#fff', border: '1px solid #E5E7EB', padding: '12px 24px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', transition: 'all 0.2s', borderRadius: '12px', color: '#111827' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#F9FAFB'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                >
                  <LinkIcon size={16} strokeWidth={2} /> Copy Test Link
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleGradeAll} 
                  disabled={isGrading || submissions.filter(s => s.status === 'PENDING').length === 0} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                >
                  {isGrading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  Auto-Grade ({submissions.filter(s => s.status === 'PENDING').length})
                </button>
              </div>
            </div>

            {loadingSubs ? (
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader2 className="animate-spin" size={48} /></div>
            ) : submissions.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '64px' }}>
                <div style={{ background: '#f3f4f6', padding: '32px', borderRadius: '50%', marginBottom: '24px' }}>
                  <MonitorPlay size={64} strokeWidth={1.5} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>No Submissions Yet</h3>
                <p style={{ fontSize: '14px', fontWeight: 400, maxWidth: '400px' }}>Copy the test link and share it with your students. Their submissions will appear here instantly.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E5E7EB', background: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'left', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>Student Name</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'left', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>Roll No.</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>Status</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>Score</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>Percentage</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>Percentile</th>
                      <th style={{ padding: '16px', borderBottom: '1px solid #E5E7EB', textAlign: 'left', fontWeight: 600, color: '#6B7280', fontSize: '13px' }}>AI Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const totalMarks = selectedAssignment?.questionTypes?.reduce((acc: number, qt: any) => acc + (qt.numberOfQuestions * qt.marksPerQuestion), 0) || 100;
                      const gradedScores = submissions.filter(s => s.status === 'GRADED' && s.score !== undefined).map(s => s.score as number);
                      
                      const calculatePercentile = (score: number) => {
                        if (gradedScores.length === 0) return 0;
                        const equalOrBelow = gradedScores.filter(s => s <= score).length;
                        return Math.round((equalOrBelow / gradedScores.length) * 100);
                      };

                      return submissions.map((sub, i) => {
                        const percentage = sub.score !== undefined ? Math.round((sub.score / totalMarks) * 100) : null;
                        const percentile = sub.score !== undefined && sub.status === 'GRADED' ? calculatePercentile(sub.score) : null;

                        return (
                          <tr key={sub._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '16px', fontWeight: 600, fontSize: '14px', color: '#111827' }}>{sub.studentName}</td>
                            <td style={{ padding: '16px', fontWeight: 500, color: 'var(--text-muted)', fontSize: '14px' }}>{sub.studentRoll}</td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              {sub.status === 'GRADED' ? (
                                <span style={{ background: '#F0FDF4', color: '#166534', padding: '6px 12px', fontWeight: 600, fontSize: '12px', borderRadius: '8px' }}>Graded</span>
                              ) : (
                                <span style={{ background: '#FFFBEB', color: '#B45309', padding: '6px 12px', fontWeight: 600, fontSize: '12px', borderRadius: '8px' }}>Pending</span>
                              )}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {sub.score !== undefined ? sub.score : '-'}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '15px', color: percentage !== null && percentage >= 80 ? '#047857' : percentage !== null && percentage < 40 ? '#b91c1c' : '#111827' }}>
                              {percentage !== null ? `${percentage}%` : '-'}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center', fontWeight: 600, fontSize: '15px', color: '#111827' }}>
                              {percentile !== null ? `${percentile}%ile` : '-'}
                            </td>
                            <td style={{ padding: '16px', fontSize: '14px', lineHeight: 1.6, fontWeight: 400, color: '#111827' }}>
                              {sub.feedback ? (
                                <span>{sub.feedback}</span>
                              ) : (
                                <span style={{ color: '#9ca3af', fontStyle: 'italic', fontWeight: 400 }}>Waiting for AI Grader...</span>
                              )}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="form-card" style={{ maxWidth: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px' }}>
            <div style={{ background: '#F9FAFB', padding: '32px', borderRadius: '50%', marginBottom: '32px', border: '1px solid #E5E7EB' }}>
              <MonitorPlay size={64} color="#6B7280" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Ready to Grade</h2>
            <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '32px' }}>
              Click "Select Assignment" above to choose a test and view its submissions.
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary" 
              style={{ padding: '14px 28px', fontSize: '16px' }}
            >
              Select Assignment
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 32px 64px rgba(0,0,0,0.1)', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '80vh', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E5E7EB' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>Select Assignment</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280' }}>
                <X size={24} />
              </button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {assignments.filter(a => a.status === 'COMPLETED').map(a => (
                  <div 
                  key={a._id} 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '20px', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '16px',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#D6D6D6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  onClick={() => loadSubmissions(a)}
                >
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FileText size={18} color="#111827" />
                      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#111827' }}>{a.title}</h3>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)' }}>
                      {a.subject} • {a.topic}
                    </div>
                  </div>
                  <div style={{ background: a.submissionsCount > 0 ? '#F0FDF4' : '#F6F6F6', color: a.submissionsCount > 0 ? '#166534' : '#111827', padding: '6px 12px', fontWeight: 600, fontSize: '12px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                    {a.submissionsCount} {a.submissionsCount === 1 ? 'Submission' : 'Submissions'}
                  </div>
                </div>
              ))}
              {assignments.filter(a => a.status === 'COMPLETED').length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600, padding: '32px' }}>
                  No completed assignments found. Create one first!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
