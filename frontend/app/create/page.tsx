"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore, QuestionTypeConfig } from '../../store/useAssignmentStore';
import { Loader2, Upload, Play, CheckCircle, FileText, ChevronRight, ListPlus, Minus, Plus, X, ArrowLeft, LayoutGrid, Bell, ChevronDown, CloudUpload, Calendar, Mic, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CreateAssignment() {
  const router = useRouter();
  const createAssignment = useAssignmentStore(state => state.createAssignment);

  const [step, setStep] = useState(1);

  // Step 1 State
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [targetExam, setTargetExam] = useState('');
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
        targetExam,
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
    <div style={{ display: 'flex', alignItems: 'center', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '8px 12px', borderRadius: '12px', gap: '12px' }}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 0 }}>
        <Minus size={16} strokeWidth={2.5} />
      </button>
      <span style={{ fontWeight: 600, fontSize: '14px', width: '24px', textAlign: 'center', color: '#111827' }}>{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#6B7280', display: 'flex', alignItems: 'center', padding: 0 }}>
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#A9A9A9', fontWeight: 600 }}>
          <ArrowLeft size={20} color="#303030" style={{ cursor: 'pointer' }} onClick={() => router.back()} />
          <LayoutGrid size={18} color="#A9A9A9" /> 
          <span>Create Assignment</span>
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

      {/* Top Progress Bar */}
      <div style={{ width: '100%', maxWidth: '850px', display: 'flex', gap: '12px', marginBottom: '32px' }}>
        <div style={{ height: '6px', background: '#111827', flex: 1, borderRadius: '4px' }} />
        <div style={{ height: '6px', background: step === 2 ? '#111827' : '#E5E7EB', flex: 1, borderRadius: '4px', transition: 'background 0.3s' }} />
      </div>

      {step === 1 && (
        <div className="form-card" style={{ width: '100%' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>Assignment Details</h2>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>Upload material or specify parameters to generate an assignment.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            
            {/* Assignment Name */}
            <div className="form-group">
              <label>Assignment Name</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Midterm Examination 2024"
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
                  <FileText size={40} color="#111827" style={{ marginBottom: '16px' }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>{file.name}</span>
                  <span className="brutal-badge">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </>
              ) : (
                <>
                  <CloudUpload size={40} color="#6B7280" style={{ marginBottom: '16px' }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>Upload PDF File</span>
                  <span style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>Max file size 10MB</span>
                  <button type="button" className="btn-secondary" style={{ pointerEvents: 'none' }}>Browse Files</button>
                </>
              )}
            </div>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginBottom: '32px' }}>* AI will extract text from this document to generate questions.</p>

            {/* Subject, Topic, Due Date */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '32px' }}>
              <div style={{ flex: 1 }} className="form-group">
                <label>Subject {file ? '(Optional)' : ''}</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)} 
                  placeholder="e.g. Physics"
                  required={!file}
                />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label>Topic {file ? '(Optional)' : ''}</label>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  placeholder="e.g. Thermodynamics"
                  required={!file}
                />
              </div>
              <div style={{ flex: 1 }} className="form-group">
                <label>Due Date</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={e => setDueDate(e.target.value)} 
                    required
                  />
                  <Calendar size={18} color="#6B7280" style={{ position: 'absolute', right: '16px', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Target Exam */}
            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label>Target Exam (Optional)</label>
              <input 
                type="text" 
                value={targetExam} 
                onChange={e => setTargetExam(e.target.value)} 
                placeholder="e.g. JEE Advanced, NEET, GATE (Enables toughness matching)"
              />
            </div>

            <div style={{ height: '1px', background: '#E5E7EB', marginBottom: '32px', width: '100%' }} />

            {/* Question Type Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', padding: '0 16px' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>Question Type</span>
              </div>
              <div style={{ width: '120px', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>Count</span>
              </div>
              <div style={{ width: '120px', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6B7280' }}>Marks</span>
              </div>
            </div>

            {/* Question Types List */}
            {questionTypes.map((qt, index) => (
              <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <select 
                    value={qt.type} 
                    onChange={e => handleChangeQuestionType(index, 'type', e.target.value)} 
                    required
                    style={{ width: '100%', appearance: 'none', cursor: 'pointer', paddingRight: '40px' }}
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                    <option value="Short Questions">Short Questions</option>
                    <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                    <option value="Numerical Problems">Numerical Problems</option>
                  </select>
                  <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <ChevronDown size={16} color="#6B7280" />
                  </div>
                </div>
                
                <button type="button" onClick={() => handleRemoveQuestionType(index)} style={{ background: '#FFF', border: '1px solid #E5E7EB', cursor: 'pointer', padding: '12px', color: '#C53535', display: 'flex', alignItems: 'center', borderRadius: '12px', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background='#FEF2F2'} onMouseLeave={e => e.currentTarget.style.background='#FFF'}>
                  <X size={18} strokeWidth={2} />
                </button>
                
                <div style={{ width: '120px', display: 'flex', justifyContent: 'center' }}>
                  <NumberInput 
                    value={Number(qt.numberOfQuestions)} 
                    onChange={(val) => handleChangeQuestionType(index, 'numberOfQuestions', val)} 
                  />
                </div>
                <div style={{ width: '120px', display: 'flex', justifyContent: 'center' }}>
                  <NumberInput 
                    value={Number(qt.marksPerQuestion)} 
                    onChange={(val) => handleChangeQuestionType(index, 'marksPerQuestion', val)} 
                  />
                </div>
              </div>
            ))}

            {/* Add Question Type Button */}
            <div style={{ marginTop: '16px', display: 'flex' }}>
              <button type="button" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }} onClick={handleAddQuestionType}>
                <Plus size={16} strokeWidth={2} /> Add Question Type
              </button>
            </div>

            {/* Totals */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', marginBottom: '40px' }}>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '12px 24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Total Questions</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{totalQuestions}</span>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '12px 24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Total Marks</span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{totalMarks}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Additional Instructions</label>
              <div style={{ position: 'relative' }}>
                <textarea 
                  rows={4} 
                  value={additionalInstructions} 
                  onChange={e => setAdditionalInstructions(e.target.value)} 
                  placeholder="e.g. Focus on chapter 3, include tricky questions..."
                  style={{ resize: 'none' }}
                />
                <Mic size={20} color="#6B7280" style={{ position: 'absolute', bottom: '16px', right: '16px', cursor: 'pointer' }} />
              </div>
            </div>
            <button type="submit" style={{ display: 'none' }} id="submitStep1"></button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="form-card" style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px', background: '#F9FAFB', padding: '24px', borderRadius: '16px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '48px', height: '48px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
              <CheckCircle2 size={24} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0', color: '#111827' }}>Final Details</h2>
              <p style={{ fontSize: '14px', color: '#6B7280', margin: '0' }}>Provide metadata to complete the assignment generation.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Assignment Duration / Time</label>
              <input 
                type="text" 
                value={timeDuration} 
                onChange={e => setTimeDuration(e.target.value)} 
                placeholder="e.g. 3 Hours"
                required
              />
            </div>
            <div className="form-group">
              <label>Tutor's Name</label>
              <input 
                type="text" 
                value={tutorName} 
                onChange={e => setTutorName(e.target.value)} 
                placeholder="e.g. Prof. Alan"
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '40px' }}>
              <label>Institute's Name (Optional)</label>
              <input 
                type="text" 
                value={instituteName} 
                onChange={e => setInstituteName(e.target.value)} 
                placeholder="e.g. Tech Institute"
              />
            </div>
            <button type="submit" style={{ display: 'none' }} id="submitStep2"></button>
          </form>
        </div>
      )}

      {/* Footer Buttons */}
      <div style={{ width: '100%', maxWidth: '850px', display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
        {step === 1 ? (
          <button type="button" className="btn-secondary" onClick={() => router.push('/assignments')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
            <ArrowLeft size={18} /> Cancel
          </button>
        ) : (
          <button type="button" className="btn-secondary" onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px' }}>
            <ArrowLeft size={18} /> Back
          </button>
        )}

        {step === 1 ? (
          <button type="button" className="btn-primary" onClick={() => document.getElementById('submitStep1')?.click()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            Next Step <ArrowRight size={18} />
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={() => document.getElementById('submitStep2')?.click()} disabled={isSubmitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            {isSubmitting ? 'Generating...' : 'Generate Assignment'} <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
