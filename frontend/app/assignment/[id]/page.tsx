"use client";
import { useEffect, use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../../store/useAssignmentStore';
import { Download, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const formatMath = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$$')
    .replace(/\\\]/g, '$$$');
};

const MathText = ({ content }: { content: string }) => (
  <span className="math-markdown">
    <ReactMarkdown 
      remarkPlugins={[remarkMath]} 
      rehypePlugins={[rehypeKatex]}
    >
      {formatMath(content)}
    </ReactMarkdown>
  </span>
);

export default function AssignmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { currentAssignment, currentPaper, fetchAssignmentDetails, regenerateAssignment } = useAssignmentStore();
  const { id } = use(params);

  const [isPrintingAnswerKey, setIsPrintingAnswerKey] = useState(false);

  useEffect(() => {
    fetchAssignmentDetails(id);
  }, [id, fetchAssignmentDetails]);

  useEffect(() => {
    const handleAfterPrint = () => {
      setIsPrintingAnswerKey(false);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerate = async () => {
    await regenerateAssignment(id);
  };

  const handleDownloadAnswerKey = () => {
    if (!currentAssignment || !currentPaper) return;
    setIsPrintingAnswerKey(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (!currentAssignment) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader2 className="animate-spin" /></div>;
  }

  const isGenerating = currentAssignment.status === 'GENERATING' || currentAssignment.status === 'PENDING';

  return (
    <div>
      <div className="top-header no-print">
        <div className="breadcrumb" style={{ cursor: 'pointer' }} onClick={() => router.push('/assignments')}>
          <ArrowLeft size={20} strokeWidth={3} /> BACK TO DASHBOARD
        </div>
        <div className="header-actions">
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleDownloadAnswerKey} disabled={isGenerating}>
            <Download size={18} strokeWidth={3} /> ANSWER KEY
          </button>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleRegenerate} disabled={isGenerating}>
            <RefreshCw size={18} strokeWidth={3} /> REGENERATE
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handlePrint} disabled={isGenerating}>
            <Download size={18} strokeWidth={3} /> DOWNLOAD PDF
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Loader2 size={48} color="var(--accent-color)" className="animate-spin" style={{ margin: '0 auto 24px', animation: 'spin 2s linear infinite' }} />
          <h2>Generating Assignment...</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Our AI is crafting the question paper. This may take a few seconds.</p>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin { 100% { transform: rotate(360deg); } }
            .animate-spin { animation: spin 1s linear infinite; }
          `}} />
        </div>
      ) : currentAssignment.status === 'FAILED' ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#991b1b' }}>
          <h2>Generation Failed</h2>
          <p>Something went wrong. Please try regenerating.</p>
        </div>
      ) : (
        <div className="paper-container">
          <div className="paper-header" style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #111827', paddingBottom: '24px' }}>
            {currentAssignment.instituteName && (
              <h1 style={{ fontSize: '28px', textTransform: 'uppercase', margin: '0 0 8px 0', color: '#111827', fontWeight: 900, letterSpacing: '1px' }}>
                {currentAssignment.instituteName}
              </h1>
            )}
            <h2 style={{ fontSize: '22px', textTransform: 'uppercase', margin: '0 0 16px 0', color: '#374151', fontWeight: 800 }}>
              {currentAssignment.title} {isPrintingAnswerKey && "- ANSWER KEY"}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {currentAssignment.subject && <div>SUBJECT: {currentAssignment.subject.toUpperCase()}</div>}
                {currentAssignment.topic && <div>TOPIC: {currentAssignment.topic.toUpperCase()}</div>}
                {currentAssignment.tutorName && <div>TUTOR: {currentAssignment.tutorName.toUpperCase()}</div>}
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>TIME: {currentAssignment.timeDuration ? currentAssignment.timeDuration.toUpperCase() : 'N/A'}</div>
                <div>MARKS: {currentAssignment.questionTypes?.reduce((acc: number, curr: any) => acc + (Number(curr.numberOfQuestions) * Number(curr.marksPerQuestion)), 0) || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="student-info">
            <div className="student-info-item">
              <span>Name:</span>
              <div className="input-line"></div>
            </div>
            <div className="student-info-item">
              <span>Roll Number:</span>
              <div className="input-line"></div>
            </div>
            <div className="student-info-item">
              <span>Section:</span>
              <div className="input-line"></div>
            </div>
          </div>

          {currentPaper?.sections.map((section: any, sIdx: number) => (
            <div key={sIdx} className="section-block">
              <div className="section-title">{section.title.toUpperCase()}</div>
              <div className="section-instruction">({section.instruction})</div>
              
              <div style={{ marginTop: '24px' }}>
                {section.questions.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="question-item">
                    <div style={{ fontWeight: 'bold' }}>{qIdx + 1}.</div>
                    <div className="question-text">
                      {isPrintingAnswerKey ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontStyle: 'italic', color: '#4b5563' }}><MathText content={q.text} /></div>
                          <div style={{ fontWeight: 800, padding: '8px 12px', border: 'var(--border-thin)', background: 'var(--accent-primary)', display: 'inline-block', alignSelf: 'flex-start' }}>
                            ANSWER: <MathText content={q.answer || 'N/A'} />
                          </div>
                        </div>
                      ) : (
                        <>
                          <MathText content={q.text} />
                          {q.options && q.options.length > 0 && (
                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {q.options.map((opt: string, oIdx: number) => (
                                <div key={oIdx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 600 }}>{String.fromCharCode(97 + oIdx)}.</span>
                                  <span><MathText content={opt} /></span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="question-meta no-print">
                      <span className={`difficulty-badge ${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                      <span style={{ fontWeight: 600 }}>[{q.marks} Marks]</span>
                    </div>
                    {/* For print, show marks cleanly on the right */}
                    <div className="print-only" style={{ display: 'none', fontWeight: 600 }}>
                      [{q.marks}]
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              .no-print { display: none !important; }
              .print-only { display: block !important; }
            }
            .math-markdown p {
              margin: 0;
              display: inline;
            }
          `}} />
        </div>
      )}
    </div>
  );
}
