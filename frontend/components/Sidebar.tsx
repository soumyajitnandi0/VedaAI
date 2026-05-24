"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Plus, HelpCircle, Settings, Users, BookOpen, Clock, Sparkles, MonitorPlay } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname.startsWith('/test')) return null;

  return (
    <aside className="sidebar">
      <div className="brand" style={{ marginBottom: '8px' }}>
        <div style={{ background: 'linear-gradient(135deg, #ea580c, #c2410c)', padding: '6px 10px', borderRadius: '8px', color: 'white', fontSize: '18px', fontWeight: 800 }}>
          V
        </div>
        <span style={{ color: '#111827' }}>VedaAI</span>
      </div>
      
      <Link href="/create" style={{ textDecoration: 'none' }}>
        <button className="sidebar-btn">
          <Sparkles size={16} fill="white" /> Create Assignment
        </button>
      </Link>

      <div className="nav-links">
        <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
          <div className="nav-link-inner">
            <Home size={18} /> Home
          </div>
        </Link>
        <Link href="/groups" className={`nav-link ${pathname === '/groups' ? 'active' : ''}`}>
          <div className="nav-link-inner">
            <Users size={18} /> My Groups
          </div>
        </Link>
        <Link href="/assignments" className={`nav-link ${pathname === '/assignments' || pathname.startsWith('/assignment/') ? 'active' : ''}`}>
          <div className="nav-link-inner">
            <FileText size={18} /> Assignments
          </div>
          <span className="nav-badge">10</span>
        </Link>
        <Link href="/toolkit" className={`nav-link ${pathname === '/toolkit' ? 'active' : ''}`}>
          <div className="nav-link-inner">
            <BookOpen size={18} /> AI Teacher's Toolkit
          </div>
        </Link>
        <Link href="/lms" className={`nav-link ${pathname === '/lms' ? 'active' : ''}`}>
          <div className="nav-link-inner">
            <MonitorPlay size={18} /> Digital LMS
          </div>
        </Link>
        <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>
          <div className="nav-link-inner">
            <Clock size={18} /> My Library
          </div>
        </Link>
      </div>
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`} style={{ padding: '8px 12px' }}>
          <div className="nav-link-inner">
            <Settings size={18} /> Settings
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f3f4f6', padding: '12px', borderRadius: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffedd5" alt="Avatar" width="40" height="40" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#111827' }}>Delhi Public School</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
