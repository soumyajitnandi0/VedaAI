"use client";
import { useState } from 'react';
import axios from 'axios';
import { BookOpen, MessageSquare, Loader2, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ToolkitPage() {
  const [activeTool, setActiveTool] = useState<'LESSON_PLAN' | 'FEEDBACK'>('LESSON_PLAN');

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

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLpResult('');
    try {
      const res = await axios.post('http://localhost:5000/api/toolkit/lesson-plan', {
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
      const res = await axios.post('http://localhost:5000/api/toolkit/feedback', {
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

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ background: 'var(--accent-danger)', padding: '48px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ background: '#000', padding: '16px', border: 'var(--border-thin)' }}>
          <BookOpen size={48} color="#fff" strokeWidth={3} />
        </div>
        <div>
          <h1 style={{ fontSize: '40px', fontWeight: 900, textTransform: 'uppercase', color: '#000', margin: '0 0 8px 0', letterSpacing: '-1px' }}>
            AI Teacher's Toolkit
          </h1>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0 }}>
            Supercharge your teaching workflow with AI micro-tools.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTool('LESSON_PLAN')}
          style={{ flex: 1, background: activeTool === 'LESSON_PLAN' ? 'var(--accent-primary)' : '#fff', color: '#000', border: 'var(--border-thick)' }}
        >
          <BookOpen size={20} strokeWidth={3} style={{ marginRight: '8px' }} /> LESSON PLAN GENERATOR
        </button>
        <button 
          className="btn-primary" 
          onClick={() => setActiveTool('FEEDBACK')}
          style={{ flex: 1, background: activeTool === 'FEEDBACK' ? 'var(--accent-alt)' : '#fff', color: '#000', border: 'var(--border-thick)' }}
        >
          <MessageSquare size={20} strokeWidth={3} style={{ marginRight: '8px' }} /> PARENT-TEACHER FEEDBACK
        </button>
      </div>

      {activeTool === 'LESSON_PLAN' && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          <div className="form-card" style={{ flex: 1, position: 'sticky', top: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>Lesson Details</h2>
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
          <div className="form-card" style={{ flex: 2, minHeight: '400px', background: '#f9fafb' }}>
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
            <h2 style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '24px' }}>Student Details</h2>
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
          <div className="form-card" style={{ flex: 2, minHeight: '400px', background: '#f9fafb' }}>
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
    </div>
  );
}
