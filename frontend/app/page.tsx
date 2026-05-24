"use client";
import { useRouter } from 'next/navigation';
import { Plus, FileText, BookOpen } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ padding: '32px', height: '100%', overflowY: 'auto' }}>
      <div style={{ background: 'var(--accent-color)', padding: '48px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', marginBottom: '48px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, textTransform: 'uppercase', color: '#000', margin: '0 0 16px 0', letterSpacing: '-1px' }}>
          Welcome to VedaAI
        </h1>
        <p style={{ fontSize: '18px', fontWeight: 600, color: '#000', margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
          Your AI-powered assistant for generating highly-structured question papers and assignments in seconds.
        </p>
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 800, textTransform: 'uppercase', color: '#000', marginBottom: '24px' }}>
        Quick Actions
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        <div 
          onClick={() => router.push('/create')}
          style={{ background: '#fff', border: 'var(--border-thick)', padding: '32px', cursor: 'pointer', boxShadow: 'var(--shadow-brutal)', transition: 'all 0.1s', display: 'flex', flexDirection: 'column', gap: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translate(4px,4px)'; e.currentTarget.style.boxShadow='0px 0px 0px 0px #000'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-brutal)'; }}
        >
          <div style={{ width: '48px', height: '48px', background: 'var(--accent-primary)', border: 'var(--border-thin)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #000' }}>
            <Plus size={24} color="#000" strokeWidth={3} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Create Assignment</h3>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#333' }}>Generate a new assignment using AI.</p>
        </div>

        <div 
          onClick={() => router.push('/assignments')}
          style={{ background: '#fff', border: 'var(--border-thick)', padding: '32px', cursor: 'pointer', boxShadow: 'var(--shadow-brutal)', transition: 'all 0.1s', display: 'flex', flexDirection: 'column', gap: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translate(4px,4px)'; e.currentTarget.style.boxShadow='0px 0px 0px 0px #000'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-brutal)'; }}
        >
          <div style={{ width: '48px', height: '48px', background: 'var(--accent-alt)', border: 'var(--border-thin)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #000' }}>
            <FileText size={24} color="#000" strokeWidth={3} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>View Assignments</h3>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#333' }}>Browse your previously generated papers.</p>
        </div>

        <div 
          onClick={() => router.push('/toolkit')}
          style={{ background: '#fff', border: 'var(--border-thick)', padding: '32px', cursor: 'pointer', boxShadow: 'var(--shadow-brutal)', transition: 'all 0.1s', display: 'flex', flexDirection: 'column', gap: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translate(4px,4px)'; e.currentTarget.style.boxShadow='0px 0px 0px 0px #000'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='var(--shadow-brutal)'; }}
        >
          <div style={{ width: '48px', height: '48px', background: 'var(--accent-danger)', border: 'var(--border-thin)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #000' }}>
            <BookOpen size={24} color="#000" strokeWidth={3} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>AI Teacher's Toolkit</h3>
          <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#333' }}>Explore advanced teaching tools.</p>
        </div>
      </div>
    </div>
  );
}
