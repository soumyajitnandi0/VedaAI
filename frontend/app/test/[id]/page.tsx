"use client";
import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const formatMath = (text: string) => {
  if (!text) return '';
  return text.replace(/\\\(/g, '$').replace(/\\\)/g, '$').replace(/\\\[/g, '$$$').replace(/\\\]/g, '$$$');
};

const MathText = ({ content }: { content: string }) => (
  <span className="math-markdown"><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{formatMath(content)}</ReactMarkdown></span>
);

export default function StudentTestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [data, setData] = useState<{ assignment: any, paper: any } | null>(null);
  const [error, setError] = useState('');
  
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [answers, setAnswers] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Proctoring States
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [violationReason, setViolationReason] = useState<string | null>(null);
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/test/${id}`)
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        setError('Failed to load test. Invalid link.');
      });
  }, [id]);

  const handleAnswerChange = (sIdx: number, qIdx: number, value: string) => {
    const existing = answers.find(a => a.sectionIndex === sIdx && a.questionIndex === qIdx);
    if (existing) {
      setAnswers(answers.map(a => a === existing ? { ...a, studentAnswer: value } : a));
    } else {
      setAnswers([...answers, { sectionIndex: sIdx, questionIndex: qIdx, studentAnswer: value }]);
    }
  };

  const getAnswer = (sIdx: number, qIdx: number) => {
    return answers.find(a => a.sectionIndex === sIdx && a.questionIndex === qIdx)?.studentAnswer || '';
  };

  const handleSubmit = async (e?: React.FormEvent, isViolation: boolean = false) => {
    if (e) e.preventDefault();
    if (!isViolation) {
      if (!studentName || !studentRoll) {
        alert("Please enter your Name and Roll Number.");
        return;
      }
      if (answers.length === 0) {
        alert("You have not answered any questions.");
        return;
      }
      if (!window.confirm("Are you sure you want to submit your test?")) return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:5000/api/test/${id}/submit`, {
        studentName: studentName || 'Unknown', 
        studentRoll: studentRoll || 'Unknown', 
        answers
      });
      setSubmitted(true);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    } catch (err) {
      if (!isViolation) alert("Failed to submit test.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isTestStarted || submitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolationReason('Tab switched or window minimized.');
        handleSubmit(undefined, true);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowFullscreenWarning(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isTestStarted, submitted, studentName, studentRoll, answers]);

  const handleStartTest = async () => {
    if (!studentName || !studentRoll) {
      alert("Please enter your Name and Roll Number to start.");
      return;
    }
    try {
      await document.documentElement.requestFullscreen();
      setIsTestStarted(true);
    } catch (err) {
      alert("Failed to enter full screen. Please allow full screen permissions.");
    }
  };

  if (error) return <div style={{ padding: '48px', textAlign: 'center', color: '#b91c1c', fontWeight: 800 }}>{error}</div>;
  if (!data) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Loader2 className="animate-spin" size={48} /></div>;

  if (submitted) {
    return (
      <div style={{ padding: '64px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: violationReason ? '#FEF2F2' : '#F0FDF4', padding: '48px', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-sm)' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: violationReason ? '#EF4444' : '#10B981', marginBottom: '16px' }}>
            {violationReason ? 'Test Auto-Submitted' : 'Test Submitted!'}
          </h1>
          <p style={{ fontSize: '18px', fontWeight: 500, color: '#6B7280' }}>
            {violationReason ? `Your test was automatically submitted due to a proctoring violation: ${violationReason}` : 'Your answers have been securely recorded. You may now close this window.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', color: '#111827' }}>{data.assignment.instituteName || 'VedaAI Test'}</h1>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#6B7280' }}>{data.assignment.title}</h2>
      </div>

      {!isTestStarted ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '48px', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>⚠️</span> STRICT PROCTORING ENABLED
          </h2>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#111827', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
            This exam must be taken in Full Screen mode. If you attempt to switch tabs, open another window, or exit Full Screen, your test will be <strong>AUTOMATICALLY SUBMITTED</strong> with your current answers.
          </p>
          
          <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px', margin: '0 auto 32px auto', textAlign: 'left' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>STUDENT NAME</label>
              <input type="text" required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Full Name" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ROLL NUMBER</label>
              <input type="text" required value={studentRoll} onChange={e => setStudentRoll(e.target.value)} placeholder="Roll/ID Number" />
            </div>
          </div>

          <button onClick={handleStartTest} className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
            Enter Full Screen & Start Exam
          </button>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>

        {data.paper.sections.map((section: any, sIdx: number) => (
          <div key={sIdx} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '16px', color: '#111827' }}>{section.title.toUpperCase()}</h3>
            <p style={{ fontStyle: 'italic', color: '#6B7280', marginBottom: '24px', fontWeight: 500 }}>{section.instruction}</p>
            
            {section.questions.map((q: any, qIdx: number) => (
              <div key={qIdx} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px dashed #E5E7EB' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', color: '#111827' }}>{qIdx + 1}.</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: 500, marginBottom: '16px', color: '#111827', lineHeight: 1.6 }}><MathText content={q.text} /></div>
                    
                    {q.options && q.options.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {q.options.map((opt: string, oIdx: number) => {
                          const optionLetter = String.fromCharCode(97+oIdx);
                          const isSelected = getAnswer(sIdx, qIdx) === optionLetter;
                          return (
                            <label key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px', borderRadius: '12px', border: isSelected ? '1px solid #111827' : '1px solid #E5E7EB', background: isSelected ? '#F9FAFB' : '#fff', fontWeight: isSelected ? 600 : 500, color: '#111827', transition: 'all 0.2s' }}>
                              <input 
                                type="radio" 
                                name={`q_${sIdx}_${qIdx}`} 
                                value={optionLetter}
                                checked={isSelected}
                                onChange={(e) => handleAnswerChange(sIdx, qIdx, e.target.value)}
                                style={{ transform: 'scale(1.2)', accentColor: '#111827' }}
                              />
                              <span style={{ fontWeight: 700 }}>{optionLetter}.</span> <MathText content={opt} />
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <textarea 
                        rows={4} 
                        style={{ width: '100%', padding: '16px', border: '1px solid #E5E7EB', borderRadius: '12px', background: '#F9FAFB', fontSize: '14px', resize: 'vertical', outline: 'none' }} 
                        placeholder="Type your answer here..."
                        value={getAnswer(sIdx, qIdx)}
                        onChange={(e) => handleAnswerChange(sIdx, qIdx, e.target.value)}
                        onFocus={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#111827'; }}
                        onBlur={(e) => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                      />
                    )}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#EF4444', background: '#FEF2F2', padding: '4px 8px', borderRadius: '8px', height: 'fit-content' }}>[{q.marks}]</div>
                </div>
              </div>
            ))}
          </div>
        ))}

        <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ width: '100%', padding: '16px 24px', fontSize: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginBottom: '64px' }}>
          {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <><Send size={20} /> Submit Test</>}
        </button>
      </form>
      )}

      {showFullscreenWarning && !submitted && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '48px', boxShadow: 'var(--shadow-lg)', maxWidth: '500px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px' }}>⚠️</span> WARNING
            </h2>
            <p style={{ fontSize: '16px', fontWeight: 500, marginBottom: '32px', color: '#111827', lineHeight: 1.6 }}>
              You have exited Full Screen mode. To maintain exam integrity, you must return to Full Screen immediately, or submit your exam right now.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={async () => {
                  try {
                    await document.documentElement.requestFullscreen();
                    setShowFullscreenWarning(false);
                  } catch (e) {
                    alert('Failed to enter full screen. Please check browser permissions.');
                  }
                }} 
                className="btn-primary" style={{ padding: '16px', fontSize: '16px' }}>
                Return to Full Screen
              </button>
              <button 
                onClick={() => {
                  setShowFullscreenWarning(false);
                  handleSubmit(undefined, false);
                }} 
                disabled={isSubmitting}
                className="btn-secondary" style={{ padding: '16px', fontSize: '16px', borderColor: '#EF4444', color: '#EF4444' }}
                onMouseEnter={e => e.currentTarget.style.background = '#FEF2F2'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Submit Exam Now'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .math-markdown p { margin: 0; display: inline; }
      `}} />
    </div>
  );
}
