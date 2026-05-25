"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Home, FileText, Plus, HelpCircle, Settings, Users, BookOpen, Clock, Sparkles, MonitorPlay } from 'lucide-react';
import { useAssignmentStore } from '../store/useAssignmentStore';

export default function Sidebar() {
  const pathname = usePathname();
  const { assignments, fetchAssignments } = useAssignmentStore();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  if (pathname.startsWith('/test')) return null;

  return (
    <aside className="sidebar">
      <div className="brand" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.svg" alt="VedaAI Logo" width={36} height={36} style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
        <span style={{ color: '#09090B', fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>VedaAI</span>
      </div>
      
      <Link href="/create" style={{ textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
        <button className="sidebar-btn" style={{ width: '100%' }}>
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
          {assignments.length > 0 && (
            <span className="nav-badge">{assignments.length}</span>
          )}
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
      
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`} style={{ padding: '10px 12px' }}>
          <div className="nav-link-inner">
            <Settings size={18} /> Settings
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffedd5" alt="Avatar" width="36" height="36" />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827' }}>Delhi Public School</div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
