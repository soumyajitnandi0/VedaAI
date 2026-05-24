"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Link as LinkIcon, CheckCircle, RefreshCw, MonitorPlay, Sparkles, FileText, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';

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
      const res = await axios.get('http://localhost:5000/api/lms/assignments');
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
      const res = await axios.get(`http://localhost:5000/api/lms/${a._id}/submissions`);
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
      await axios.post(`http://localhost:5000/api/lms/${selectedAssignment._id}/grade`);
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
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>LMS Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '18px', margin: '8px 0 0 0' }}>Manage digital test links and auto-grade submissions.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary" 
          style={{ padding: '12px 24px', background: '#000', color: '#fff' }}
        >
          SELECT ASSIGNMENT
        </button>
      </div>

      <div style={{ flex: 1 }}>
        {selectedAssignment ? (
          <div className="form-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '24px', borderBottom: '4px solid #000' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 900, textTransform: 'uppercase', margin: 0, letterSpacing: '-1px' }}>Submissions</h2>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '4px' }}>For: {selectedAssignment.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button 
                  onClick={(e) => handleCopyLink(e, selectedAssignment._id)}
                  style={{ background: '#fff', border: '2px solid #000', padding: '12px 24px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', transition: 'all 0.2s', boxShadow: '2px 2px 0px #000' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '4px 4px 0px #000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '2px 2px 0px #000'; }}
                >
                  <LinkIcon size={16} strokeWidth={3} /> COPY TEST LINK
                </button>
                <button 
                  className="btn-primary" 
                  onClick={handleGradeAll} 
                  disabled={isGrading || submissions.filter(s => s.status === 'PENDING').length === 0} 
                  style={{ background: '#000', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}
                >
                  {isGrading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} fill="#fbbf24" stroke="#fbbf24" />}
                  AUTO-GRADE ({submissions.filter(s => s.status === 'PENDING').length})
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
                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#000', marginBottom: '8px' }}>NO SUBMISSIONS YET</h3>
                <p style={{ fontSize: '16px', fontWeight: 600, maxWidth: '400px' }}>Copy the test link and share it with your students. Their submissions will appear here instantly.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', flex: 1 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: 'var(--border-thick)', background: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#000', color: '#fff' }}>
                      <th style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'left', fontWeight: 900, textTransform: 'uppercase' }}>Student Name</th>
                      <th style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'left', fontWeight: 900, textTransform: 'uppercase' }}>Roll No.</th>
                      <th style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'center', fontWeight: 900, textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'center', fontWeight: 900, textTransform: 'uppercase' }}>Score</th>
                      <th style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'left', fontWeight: 900, textTransform: 'uppercase' }}>AI Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub, i) => (
                      <tr key={sub._id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
                        <td style={{ padding: '16px', border: 'var(--border-thick)', fontWeight: 800, fontSize: '16px' }}>{sub.studentName}</td>
                        <td style={{ padding: '16px', border: 'var(--border-thick)', fontWeight: 700, color: '#4b5563' }}>{sub.studentRoll}</td>
                        <td style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'center' }}>
                          {sub.status === 'GRADED' ? (
                            <span style={{ background: '#bbf7d0', color: '#166534', padding: '6px 12px', fontWeight: 900, fontSize: '12px', border: '2px solid #166534', display: 'inline-block' }}>GRADED</span>
                          ) : (
                            <span style={{ background: '#fef08a', color: '#854d0e', padding: '6px 12px', fontWeight: 900, fontSize: '12px', border: '2px solid #854d0e', display: 'inline-block' }}>PENDING</span>
                          )}
                        </td>
                        <td style={{ padding: '16px', border: 'var(--border-thick)', textAlign: 'center', fontWeight: 900, fontSize: '24px', color: sub.score && sub.score >= 80 ? '#047857' : sub.score && sub.score < 40 ? '#b91c1c' : '#000' }}>
                          {sub.score !== undefined ? sub.score : '-'}
                        </td>
                        <td style={{ padding: '16px', border: 'var(--border-thick)', fontSize: '14px', lineHeight: 1.6, fontWeight: 500 }}>
                          {sub.feedback ? (
                            <span>{sub.feedback}</span>
                          ) : (
                            <span style={{ color: '#9ca3af', fontStyle: 'italic', fontWeight: 600 }}>Waiting for AI Grader...</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="form-card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '64px' }}>
            <div style={{ background: '#fef08a', padding: '32px', borderRadius: '50%', marginBottom: '32px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)' }}>
              <MonitorPlay size={80} strokeWidth={2} color="#000" />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '-1px' }}>Ready to Grade</h2>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '32px' }}>
              Click "Select Assignment" above to choose a test and view its submissions.
            </p>
            <button 
              onClick={() => setShowModal(true)}
              className="btn-primary" 
              style={{ padding: '16px 32px', background: '#000', color: '#fff', fontSize: '18px' }}
            >
              SELECT ASSIGNMENT
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: 'var(--border-thick)' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 900, textTransform: 'uppercase', margin: 0 }}>Select Assignment</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {assignments.filter(a => a.status === 'COMPLETED').map(a => (
                <div 
                  key={a._id} 
                  style={{ 
                    cursor: 'pointer', 
                    padding: '20px', 
                    border: 'var(--border-thick)', 
                    boxShadow: 'var(--shadow-brutal)',
                    background: '#fff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '4px 4px 0px #000'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = 'var(--shadow-brutal)'; }}
                  onClick={() => loadSubmissions(a)}
                >
                  <div style={{ flex: 1, paddingRight: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FileText size={18} strokeWidth={3} color="#000" />
                      <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>{a.title}</h3>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {a.subject} • {a.topic}
                    </div>
                  </div>
                  <div style={{ background: a.submissionsCount > 0 ? '#bbf7d0' : '#f3f4f6', border: '2px solid #000', padding: '4px 12px', fontWeight: 900, fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {a.submissionsCount} SUBS
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
