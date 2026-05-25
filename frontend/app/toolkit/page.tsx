"use client";
import { useState } from 'react';
import axios from 'axios';
import { BookOpen, MessageSquare, Loader2, Play, CheckCircle, Download, Plus, Trash2, ArrowLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ToolkitPage() {
  const [activeTool, setActiveTool] = useState<'LESSON_PLAN' | 'FEEDBACK' | 'BATCH_GRADER'>('LESSON_PLAN');

  // Lesson Plan State
  const [lpTopic, setLpTopic] = useState('');
  const [lpDuration, setLpDuration] = useState('');
  const [lpGrade, setLpGrade] = useState('');
  const [lpResult, setLpResult] = useState('');

  // Feedback State
  const [fbName, setFbName] = useState('');
  const [fbStrengths, setFbStrengths] = useState('');
  const [fbImprovements, setFbImprovements] = useState('');
  const [fbResult, setFbResult] = useState('');

  // Batch Grader State
  const [masterKey, setMasterKey] = useState('');
  const [submissions, setSubmissions] = useState([{ id: Date.now(), name: '', answers: '' }]);
  const [batchResults, setBatchResults] = useState<{ name: string, score: number, feedback: string }[] | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLpResult('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/toolkit/lesson-plan`, {
        topic: lpTopic,
        duration: lpDuration,
        gradeLevel: lpGrade
      });
      setLpResult(res.data.content);
    } catch (err) {
      alert("Failed to generate lesson plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFbResult('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/toolkit/feedback`, {
        studentName: fbName,
        strengths: fbStrengths,
        improvements: fbImprovements
      });
      setFbResult(res.data.content);
    } catch (err) {
      alert("Failed to generate feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmission = () => {
    setSubmissions([...submissions, { id: Date.now(), name: '', answers: '' }]);
  };

  const handleRemoveSubmission = (id: number) => {
    if (submissions.length === 1) return;
    setSubmissions(submissions.filter(s => s.id !== id));
  };

  const handleSubmissionChange = (id: number, field: 'name' | 'answers', value: string) => {
    setSubmissions(submissions.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleGradeBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterKey.trim() || submissions.some(s => !s.name.trim() || !s.answers.trim())) {
      alert("Please fill in all fields before grading.");
      return;
    }
    setIsLoading(true);
    setBatchResults(null);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/toolkit/grade-batch`, {
        masterKey,
        submissions: submissions.map(({ name, answers }) => ({ name, answers }))
      });
      setBatchResults(res.data.results);
    } catch (err) {
      alert("Failed to grade batch. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadLeaderboard = () => {
    if (!batchResults) return;
    
    // Sort descending by score
    const sorted = [...batchResults].sort((a, b) => b.score - a.score);
    
    const headers = ['Rank', 'Name', 'Score (%)', 'Feedback'];
    const csvContent = [
      headers.join(','),
      ...sorted.map((r, i) => `"${i + 1}","${r.name.replace(/"/g, '""')}","${r.score}","${r.feedback.replace(/"/g, '""')}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Batch_Leaderboard_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '0', height: '100%', overflowY: 'auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#A9A9A9', fontWeight: 600 }}>
          <ArrowLeft size={20} color="#303030" style={{ cursor: 'pointer' }} onClick={() => window.history.back()} />
          <LayoutGrid size={18} color="#A9A9A9" /> 
          <span>AI Teacher's Toolkit</span>
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



      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTool('LESSON_PLAN')}
          style={{ flex: 1, background: activeTool === 'LESSON_PLAN' ? 'var(--accent-primary)' : '#fff', color: activeTool === 'LESSON_PLAN' ? '#fff' : 'var(--text-main)', border: '1px solid #E5E7EB', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}
        >
          <BookOpen size={20} strokeWidth={2.5} style={{ marginRight: '8px' }} /> LESSON PLAN GENERATOR
        </button>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTool('FEEDBACK')}
          style={{ flex: 1, background: activeTool === 'FEEDBACK' ? 'var(--accent-primary)' : '#fff', color: activeTool === 'FEEDBACK' ? '#fff' : 'var(--text-main)', border: '1px solid #E5E7EB', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}
        >
          <MessageSquare size={20} strokeWidth={2.5} style={{ marginRight: '8px' }} /> PARENT-TEACHER FEEDBACK
        </button>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTool('BATCH_GRADER')}
          style={{ flex: 1, background: activeTool === 'BATCH_GRADER' ? 'var(--accent-primary)' : '#fff', color: activeTool === 'BATCH_GRADER' ? '#fff' : 'var(--text-main)', border: '1px solid #E5E7EB', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 16px' }}
        >
          <CheckCircle size={20} strokeWidth={2.5} style={{ marginRight: '8px' }} /> BATCH GRADER
        </button>
      </div>

      {activeTool === 'LESSON_PLAN' && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div className="form-card" style={{ flex: 1, position: 'sticky', top: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px', color: '#111827' }}>Lesson Details</h2>
            <form onSubmit={handleGenerateLessonPlan}>
              <div className="form-group">
                <label>TOPIC</label>
                <input type="text" value={lpTopic} onChange={e => setLpTopic(e.target.value)} placeholder="E.g. Photosynthesis" required />
              </div>
              <div className="form-group">
                <label>DURATION</label>
                <input type="text" value={lpDuration} onChange={e => setLpDuration(e.target.value)} placeholder="E.g. 45 minutes" required />
              </div>
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>GRADE LEVEL</label>
                <input type="text" value={lpGrade} onChange={e => setLpGrade(e.target.value)} placeholder="E.g. 8th Grade" required />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', background: '#000', color: '#fff' }} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Play size={20} style={{ marginRight: '8px' }} /> GENERATE LESSON PLAN</>}
              </button>
            </form>
          </div>
          <div className="form-card" style={{ flex: 2, minHeight: '400px', background: '#F9FAFB' }}>
            {lpResult ? (
              <div className="prose" style={{ fontFamily: 'var(--font-space)' }}>
                <ReactMarkdown>{lpResult}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontWeight: 600, fontSize: '18px' }}>
                Fill out the details and click generate to see the lesson plan here.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTool === 'FEEDBACK' && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div className="form-card" style={{ flex: 1, position: 'sticky', top: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px', color: '#111827' }}>Student Details</h2>
            <form onSubmit={handleGenerateFeedback}>
              <div className="form-group">
                <label>STUDENT NAME</label>
                <input type="text" value={fbName} onChange={e => setFbName(e.target.value)} placeholder="E.g. John Doe" required />
              </div>
              <div className="form-group">
                <label>STRENGTHS</label>
                <textarea rows={3} value={fbStrengths} onChange={e => setFbStrengths(e.target.value)} placeholder="E.g. Great at math, very polite" required style={{ resize: 'none' }} />
              </div>
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>AREAS FOR IMPROVEMENT</label>
                <textarea rows={3} value={fbImprovements} onChange={e => setFbImprovements(e.target.value)} placeholder="E.g. Needs to focus more during lectures" required style={{ resize: 'none' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', background: '#000', color: '#fff' }} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Play size={20} style={{ marginRight: '8px' }} /> GENERATE FEEDBACK</>}
              </button>
            </form>
          </div>
          <div className="form-card" style={{ flex: 2, minHeight: '400px', background: '#F9FAFB' }}>
            {fbResult ? (
              <div style={{ fontSize: '18px', lineHeight: 1.6, fontWeight: 500 }}>
                {fbResult}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontWeight: 600, fontSize: '18px' }}>
                Fill out the details and click generate to see the feedback paragraph here.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTool === 'BATCH_GRADER' && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div className="form-card" style={{ flex: 1, height: '800px', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '24px', color: '#111827' }}>Input Submissions</h2>
            <form onSubmit={handleGradeBatch}>
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>MASTER ANSWER KEY</label>
                <textarea 
                  rows={4} 
                  value={masterKey} 
                  onChange={e => setMasterKey(e.target.value)} 
                  placeholder="Paste the official questions and answers here..." 
                  required 
                />
              </div>

              <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px' }}>Student Answers</h3>
                {submissions.map((sub, index) => (
                  <div key={sub.id} style={{ background: '#F9FAFB', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '16px', position: 'relative' }}>
                    {submissions.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSubmission(sub.id)}
                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <Trash2 size={20} strokeWidth={3} />
                      </button>
                    )}
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label>STUDENT NAME</label>
                      <input 
                        type="text" 
                        value={sub.name} 
                        onChange={e => handleSubmissionChange(sub.id, 'name', e.target.value)} 
                        placeholder="E.g. Student 1" 
                        required 
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>ANSWERS</label>
                      <textarea 
                        rows={3} 
                        value={sub.answers} 
                        onChange={e => handleSubmissionChange(sub.id, 'answers', e.target.value)} 
                        placeholder="Paste the student's answers..." 
                        required 
                      />
                    </div>
                  </div>
                ))}

                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleAddSubmission} 
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Plus size={18} strokeWidth={3} /> ADD ANOTHER STUDENT
                </button>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', background: '#000', color: '#fff' }} disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle size={20} style={{ marginRight: '8px' }} /> GRADE BATCH</>}
              </button>
            </form>
          </div>
          <div className="form-card" style={{ flex: 2, minHeight: '800px', background: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
            {batchResults ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', margin: 0, color: '#303030' }}>Grading Results</h2>
                  <button onClick={handleDownloadLeaderboard} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} strokeWidth={3} /> DOWNLOAD LEADERBOARD
                  </button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: '16px', overflow: 'hidden', background: '#fff', border: '1px solid #E6E6E6' }}>
                    <thead>
                      <tr style={{ background: '#FAFAFA' }}>
                        <th style={{ padding: '16px', borderBottom: '1px solid #E6E6E6', textAlign: 'left', fontWeight: 600, color: '#A9A9A9', fontSize: '13px' }}>Rank</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #E6E6E6', textAlign: 'left', fontWeight: 600, color: '#A9A9A9', fontSize: '13px' }}>Name</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #E6E6E6', textAlign: 'center', fontWeight: 600, color: '#A9A9A9', fontSize: '13px' }}>Score</th>
                        <th style={{ padding: '16px', borderBottom: '1px solid #E6E6E6', textAlign: 'left', fontWeight: 600, color: '#A9A9A9', fontSize: '13px' }}>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...batchResults].sort((a, b) => b.score - a.score).map((res, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #E6E6E6' }}>
                          <td style={{ padding: '16px', fontWeight: 600, textAlign: 'center', color: '#303030' }}>#{i + 1}</td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#303030' }}>{res.name}</td>
                          <td style={{ padding: '16px', textAlign: 'center', fontWeight: 700, color: res.score >= 80 ? '#047857' : res.score >= 50 ? '#b45309' : '#b91c1c' }}>
                            {res.score}%
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', lineHeight: 1.5, color: '#303030' }}>{res.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontWeight: 600, fontSize: '18px' }}>
                Paste the key and submissions, then click Grade Batch to see the leaderboard.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
