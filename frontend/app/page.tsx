"use client";
import { useRouter } from 'next/navigation';
import { Plus, FileText, BookOpen, ArrowLeft, LayoutGrid, Bell, ChevronDown } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container" style={{ padding: '0', height: '100%', overflowY: 'auto' }}>
      {/* Top Header */}
      <div className="page-header-pill" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#A9A9A9', fontWeight: 600 }}>
          <ArrowLeft size={20} color="#303030" style={{ cursor: 'pointer' }} onClick={() => router.back()} />
          <LayoutGrid size={18} color="#A9A9A9" /> 
          <span>Home</span>
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

      <div className="home-hero" style={{ background: '#FFFFFF', padding: '48px', borderRadius: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '40px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="home-hero-text" style={{ flex: 1, paddingRight: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#111827', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
            Welcome to VedaAI
          </h1>
          <p style={{ fontSize: '16px', fontWeight: 400, color: '#6B7280', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
            Your AI-powered assistant for generating highly-structured question papers and assignments in seconds.
          </p>
        </div>
        <div className="home-hero-image" style={{ flexShrink: 0 }}>
          <img src="/images/hero_illustration.png" alt="AI Education Illustration" style={{ width: '240px', height: '240px', objectFit: 'contain', animation: 'float 6s ease-in-out infinite' }} />
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      `}} />

      <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '24px' }}>
        Quick Actions
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        <div 
          onClick={() => router.push('/create')}
          style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ width: '48px', height: '48px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={24} color="#111827" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0', color: '#111827' }}>Create Assignment</h3>
            <p style={{ fontSize: '14px', fontWeight: 400, margin: 0, color: '#6B7280' }}>Generate a new assignment using AI.</p>
          </div>
        </div>

        <div 
          onClick={() => router.push('/assignments')}
          style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ width: '48px', height: '48px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#111827" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0', color: '#111827' }}>View Assignments</h3>
            <p style={{ fontSize: '14px', fontWeight: 400, margin: 0, color: '#6B7280' }}>Browse your previously generated papers.</p>
          </div>
        </div>

        <div 
          onClick={() => router.push('/toolkit')}
          style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '24px', padding: '32px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: '16px' }}
          onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 6px rgba(0,0,0,0.02)'; }}
        >
          <div style={{ width: '48px', height: '48px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="#111827" />
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0', color: '#111827' }}>AI Teacher's Toolkit</h3>
            <p style={{ fontSize: '14px', fontWeight: 400, margin: 0, color: '#6B7280' }}>Explore advanced teaching tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
