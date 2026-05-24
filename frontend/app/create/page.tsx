"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore, QuestionTypeConfig } from '../../store/useAssignmentStore';
import { Plus, Minus, CloudUpload, Calendar, ArrowLeft, ArrowRight, X, Mic, FileText, CheckCircle2 } from 'lucide-react';

export default function CreateAssignment() {
  const router = useRouter();
  const createAssignment = useAssignmentStore(state => state.createAssignment);

  const [step, setStep] = useState(1);

  // Step 1 State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questionTypes, setQuestionTypes] = useState<QuestionTypeConfig[]>([
    { type: 'Multiple Choice Questions', numberOfQuestions: 4, marksPerQuestion: 1 },
    { type: 'Short Questions', numberOfQuestions: 3, marksPerQuestion: 2 },
    { type: 'Diagram/Graph-Based Questions', numberOfQuestions: 5, marksPerQuestion: 5 },
    { type: 'Numerical Problems', numberOfQuestions: 5, marksPerQuestion: 5 }
  ]);

  // Step 2 State
  const [timeDuration, setTimeDuration] = useState('');
  const [tutorName, setTutorName] = useState('');
  const [instituteName, setInstituteName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddQuestionType = () => {
    setQuestionTypes([
      ...questionTypes,
      { type: '', numberOfQuestions: 1, marksPerQuestion: 1 }
    ]);
  };

  const handleRemoveQuestionType = (index: number) => {
    setQuestionTypes(questionTypes.filter((_, i) => i !== index));
  };

  const handleChangeQuestionType = (index: number, field: keyof QuestionTypeConfig, value: string | number) => {
    const updated = [...questionTypes];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionTypes(updated);
  };

  const handleNext = () => {
    if (!title) {
      alert("Please provide an Assignment Name.");
      return;
    }
    if (!file && (!subject || !topic)) {
      alert("Subject and Topic are required if no file is uploaded.");
      return;
    }
    if (!dueDate || questionTypes.length === 0) {
      alert("Please fill in the Due Date and configure at least one Question Type.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeDuration || !tutorName) {
      alert("Please fill in the Assignment Time Duration and Tutor's Name.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const id = await createAssignment({
        title,
        subject,
        topic,
        dueDate,
        timeDuration,
        tutorName,
        instituteName,
        questionTypes,
        additionalInstructions,
        file
      });
      router.push(`/assignment/${id}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const totalQuestions = questionTypes.reduce((acc, curr) => acc + Number(curr.numberOfQuestions), 0);
  const totalMarks = questionTypes.reduce((acc, curr) => acc + (Number(curr.numberOfQuestions) * Number(curr.marksPerQuestion)), 0);

  const NumberInput = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: 'var(--border-thick)', padding: '8px', gap: '16px', boxShadow: '2px 2px 0px #000' }}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', padding: 0 }}>
        <Minus size={18} strokeWidth={3} />
      </button>
      <span style={{ fontWeight: 800, fontSize: '15px', width: '24px', textAlign: 'center', color: '#000' }}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', padding: 0 }}>
        <Plus size={18} strokeWidth={3} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Progress Bar */}
      <div style={{ width: '100%', maxWidth: '850px', display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{ height: '16px', background: '#000', flex: 1, border: 'var(--border-thin)', boxShadow: '2px 2px 0px #000' }} />
        <div style={{ height: '16px', background: step === 2 ? '#000' : '#fff', flex: 1, border: 'var(--border-thin)', boxShadow: '2px 2px 0px #000', transition: 'background 0.1s' }} />
      </div>

      {step === 1 && (
        <div className="form-card" style={{ width: '100%' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0', textTransform: 'uppercase' }}>Assignment Details</h2>
          <p style={{ fontSize: '15px', color: '#000', margin: '0 0 32px 0', fontWeight: 600, background: 'var(--accent-primary)', display: 'inline-block', padding: '4px 12px', border: 'var(--border-thin)' }}>STEP 1 OF 2</p>

          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            
            {/* Assignment Name */}
            <div className="form-group">
              <label>ASSIGNMENT NAME</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="E.G. MIDTERM EXAMINATION 2024"
                required
              />
            </div>

            {/* Upload Box */}
            <div 
              className="brutal-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".pdf, image/jpeg, image/png" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }} 
              />
              {file ? (
                <>
                  <FileText size={48} color="#000" style={{ marginBottom: '16px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#000', marginBottom: '8px', textTransform: 'uppercase' }}>{file.name}</span>
                  <span className="brutal-badge">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : (
                <>
                  <CloudUpload size={48} color="#000" style={{ marginBottom: '24px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#000', marginBottom: '8px', textTransform: 'uppercase' }}>UPLOAD PDF FILE</span>
                  <span style={{ fontSize: '14px', color: '#000', marginBottom: '24px', fontWeight: 600 }}>MAX 10MB</span>
                  <button type="button" className="btn-secondary" style={{ pointerEvents: 'none' }}>BROWSE FILES</button>
                </>
              )}
            </div>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#000', marginBottom: '48px', fontWeight: 700, textTransform: 'uppercase' }}>* AI will extract text from this document</p>

            {/* Subject, Topic, Due Date */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '48px' }}>
              <div style={{ flex: 1 }} className="form-group">
                <label>SUBJECT {file ? '(OPTIONAL)' : ''}</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  placeholder="E.G. PHYSICS"
                  required={!file}
                />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label>TOPIC {file ? '(OPTIONAL)' : ''}</label>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  placeholder="E.G. THERMODYNAMICS"
                  required={!file}
                />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label>DUE DATE</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    required
                  />
                  <Calendar size={20} color="#000" style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Question Type Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', background: '#000', color: '#fff', padding: '12px 24px', border: 'var(--border-thick)' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase' }}>Question Type</span>
              </div>
              <div style={{ width: '150px', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase' }}>Count</span>
              </div>
              <div style={{ width: '150px', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, textTransform: 'uppercase' }}>Marks</span>
              </div>
            </div>

            {/* Question Types List */}
            {questionTypes.map((qt, index) => (
              <div key={index} className="question-row">
                <div style={{ flex: 1, position: 'relative' }}>
                  <select 
                    value={qt.type} 
                    onChange={e => handleChangeQuestionType(index, 'type', e.target.value)} 
                    required
                    style={{ width: '100%', appearance: 'none', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase' }}
                  >
                    <option value="" disabled>SELECT TYPE</option>
                    <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                    <option value="Short Questions">Short Questions</option>
                    <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                    <option value="Numerical Problems">Numerical Problems</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2L7 7L12 2" stroke="#000" strokeWidth="3" strokeLinecap="square"/>
                    </svg>
                  </div>
                </div>
                
                <button type="button" onClick={() => handleRemoveQuestionType(index)} style={{ background: 'var(--accent-danger)', border: 'var(--border-thick)', cursor: 'pointer', padding: '12px', color: '#000', display: 'flex', alignItems: 'center', boxShadow: '2px 2px 0px #000', transition: 'all 0.1s' }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='2px 2px 0px #000'; }} onMouseEnter={e => { e.currentTarget.style.transform='translate(2px,2px)'; e.currentTarget.style.boxShadow='0px 0px 0px #000'; }}>
                  <X size={20} strokeWidth={3} />
                </button>
                
                <div style={{ width: '130px', display: 'flex', justifyContent: 'center' }}>
                  <NumberInput 
                    value={Number(qt.numberOfQuestions)} 
                    onChange={(val) => handleChangeQuestionType(index, 'numberOfQuestions', val)} 
                  />
                </div>
                <div style={{ width: '130px', display: 'flex', justifyContent: 'center' }}>
                  <NumberInput 
                    value={Number(qt.marksPerQuestion)} 
                    onChange={(val) => handleChangeQuestionType(index, 'marksPerQuestion', val)} 
                  />
                </div>
              </div>
            ))}

            {/* Add Question Type Button */}
            <div style={{ marginTop: '24px', display: 'flex' }}>
              <button type="button" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleAddQuestionType}>
                <Plus size={20} strokeWidth={3} /> ADD QUESTION TYPE
              </button>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', marginTop: '32px', marginBottom: '48px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#000', background: 'var(--accent-alt)', padding: '8px 16px', border: 'var(--border-thick)', boxShadow: '2px 2px 0px #000' }}>TOTAL QUESTIONS : {totalQuestions}</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#000', background: 'var(--accent-primary)', padding: '8px 16px', border: 'var(--border-thick)', boxShadow: '2px 2px 0px #000' }}>TOTAL MARKS : {totalMarks}</span>
            </div>

            {/* Additional Info */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>ADDITIONAL INSTRUCTIONS</label>
              <div style={{ position: 'relative' }}>
                <textarea 
                  rows={4} 
                  value={additionalInstructions} 
                  onChange={e => setAdditionalInstructions(e.target.value)} 
                  placeholder="E.G. FOCUS ON CHAPTER 3..."
                  style={{ resize: 'none' }}
                />
                <Mic size={24} color="#000" style={{ position: 'absolute', bottom: '20px', right: '20px', cursor: 'pointer' }} />
              </div>
            </div>
            <button type="submit" style={{ display: 'none' }} id="submitStep1"></button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="form-card" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', background: 'var(--accent-primary)', padding: '24px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)' }}>
            <div style={{ width: '48px', height: '48px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={32} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px 0', textTransform: 'uppercase' }}>FINAL DETAILS</h2>
              <p style={{ fontSize: '15px', color: '#000', margin: '0', fontWeight: 600 }}>PROVIDE METADATA FOR THE PDF.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>ASSIGNMENT DURATION / TIME</label>
              <input 
                type="text" 
                value={timeDuration} 
                onChange={e => setTimeDuration(e.target.value)} 
                placeholder="E.G. 3 HOURS"
                required
              />
            </div>
            <div className="form-group">
              <label>TUTOR'S NAME</label>
              <input 
                type="text" 
                value={tutorName} 
                onChange={e => setTutorName(e.target.value)} 
                placeholder="E.G. PROF. ALAN"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label>INSTITUTE'S NAME (OPTIONAL)</label>
              <input 
                type="text" 
                value={instituteName} 
                onChange={e => setInstituteName(e.target.value)} 
                placeholder="E.G. TECH INSTITUTE"
              />
            </div>
            <button type="submit" style={{ display: 'none' }} id="submitStep2"></button>
          </form>
        </div>
      )}

      {/* Footer Buttons */}
      <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        {step === 1 ? (
          <button type="button" className="btn-secondary" onClick={() => router.push('/assignments')} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ArrowLeft size={20} strokeWidth={3} /> CANCEL
          </button>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ArrowLeft size={20} strokeWidth={3} /> BACK
          </button>
        )}

        {step === 1 ? (
          <button type="button" className="btn-primary" onClick={() => document.getElementById('submitStep1')?.click()} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--accent-color)' }}>
            NEXT STEP <ArrowRight size={20} strokeWidth={3} />
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={() => document.getElementById('submitStep2')?.click()} disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--accent-color)' }}>
            {isSubmitting ? 'GENERATING...' : 'GENERATE ASSIGNMENT'} <ArrowRight size={20} strokeWidth={3} />
          </button>
        )}
      </div>
    </div>
  );
}
