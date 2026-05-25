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
  const [showAnswerKeyOptions, setShowAnswerKeyOptions] = useState(false);

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

  const handleDownloadAnswerKeyPDF = () => {
    setShowAnswerKeyOptions(false);
    if (!currentAssignment || !currentPaper) return;
    setIsPrintingAnswerKey(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownloadAnswerKeyCSV = () => {
    setShowAnswerKeyOptions(false);
    if (!currentAssignment || !currentPaper) return;
    
    const headers = ['Question No.', 'Question', 'Options', 'Answer', 'Marks', 'Difficulty'];
    let csvRows = [headers.join(',')];
    
    let qNum = 1;
    currentPaper.sections.forEach((sec: any) => {
      sec.questions.forEach((q: any) => {
        const qText = q.text ? `"${q.text.replace(/"/g, '""')}"` : '""';
        const options = q.options && q.options.length > 0 ? `"${q.options.map((o: string, i: number) => `${String.fromCharCode(97+i)}. ${o}`).join(' | ').replace(/"/g, '""')}"` : '""';
        const answer = q.answer ? `"${q.answer.replace(/"/g, '""')}"` : '""';
        const marks = q.marks || '';
        const difficulty = q.difficulty || '';
        
        csvRows.push([qNum, qText, options, answer, marks, difficulty].join(','));
        qNum++;
      });
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentAssignment.title.replace(/\s+/g, '_')}_Answer_Key.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentAssignment) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader2 className="animate-spin" /></div>;
  }

  const isGenerating = currentAssignment.status === 'GENERATING' || currentAssignment.status === 'PENDING';

  return (
    <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#111827', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push('/assignments')}>
          <ArrowLeft size={18} color="#111827" /> BACK TO DASHBOARD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '12px', fontWeight: 700, borderRadius: '9999px' }} onClick={() => setShowAnswerKeyOptions(!showAnswerKeyOptions)} disabled={isGenerating}>
              <Download size={16} /> ANSWER KEY
            </button>
            {showAnswerKeyOptions && !isGenerating && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', boxShadow: '0 16px 48px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column', zIndex: 10, minWidth: '150px', overflow: 'hidden' }}>
                <button onClick={handleDownloadAnswerKeyPDF} style={{ padding: '12px 16px', borderBottom: '1px solid #E5E7EB', background: 'none', textAlign: 'left', fontWeight: 600, cursor: 'pointer', border: 'none', width: '100%', color: '#111827' }} onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background='none'}>Download as PDF</button>
                <button onClick={handleDownloadAnswerKeyCSV} style={{ padding: '12px 16px', background: 'none', textAlign: 'left', fontWeight: 600, cursor: 'pointer', border: 'none', width: '100%', color: '#111827' }} onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'} onMouseLeave={e => e.currentTarget.style.background='none'}>Download as CSV</button>
              </div>
            )}
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '12px', fontWeight: 700, borderRadius: '9999px' }} onClick={handleRegenerate} disabled={isGenerating}>
            <RefreshCw size={16} /> REGENERATE
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', fontSize: '12px', fontWeight: 700, borderRadius: '9999px', background: '#6B7280', color: '#FFFFFF', border: 'none' }} onClick={handlePrint} disabled={isGenerating}>
            <Download size={16} /> DOWNLOAD PDF
          </button>
        </div>
      </div>

      {isGenerating ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', marginBottom: '10vh' }}>
          <Loader2 size={40} color="#111827" style={{ marginBottom: '24px', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '12px', marginTop: 0 }}>Generating Assignment...</h2>
          <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: 500, margin: 0 }}>Our AI is crafting the question paper. This may take a few seconds.</p>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}} />
        </div>
      ) : currentAssignment.status === 'FAILED' ? (
        <div style={{ textAlign: 'center', marginTop: '100px', color: '#991b1b' }}>
          <h2>Generation Failed</h2>
          <p>Something went wrong. Please try regenerating.</p>
        </div>
      ) : (
        <div className="paper-container">
          <div className="paper-header" style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '1px solid #E6E6E6', paddingBottom: '24px' }}>
            {currentAssignment.instituteName && (
              <h1 style={{ fontSize: '28px', margin: '0 0 8px 0', color: '#303030', fontWeight: 700 }}>
                {currentAssignment.instituteName}
              </h1>
            )}
            <h2 style={{ fontSize: '20px', margin: '0 0 16px 0', color: '#303030', fontWeight: 600 }}>
              {currentAssignment.title} {isPrintingAnswerKey && "- Answer Key"}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '14px', fontWeight: 500, color: 'var(--text-muted)' }}>
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {currentAssignment.subject && <div>Subject: {currentAssignment.subject}</div>}
                {currentAssignment.topic && <div>Topic: {currentAssignment.topic}</div>}
                {currentAssignment.tutorName && <div>Tutor: {currentAssignment.tutorName}</div>}
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Duration: {currentAssignment.timeDuration ? currentAssignment.timeDuration : 'N/A'}</div>
                <div>Total Marks: {currentAssignment.questionTypes?.reduce((acc: number, curr: any) => acc + (Number(curr.numberOfQuestions) * Number(curr.marksPerQuestion)), 0) || 'N/A'}</div>
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
                          <div style={{ fontWeight: 600, padding: '8px 12px', border: '1px solid #E6E6E6', borderRadius: '8px', background: '#FAFAFA', display: 'inline-block', alignSelf: 'flex-start' }}>
                            Answer: <MathText content={q.answer || 'N/A'} />
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
