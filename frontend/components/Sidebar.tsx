"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, FileText, Settings, Users, BookOpen, Clock, Sparkles, MonitorPlay, Menu, X, Bell, ChevronDown, Plus } from 'lucide-react';
import { useAssignmentStore } from '../store/useAssignmentStore';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { assignments, fetchAssignments } = useAssignmentStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith('/test')) return null;

  const bottomTabs = [
    { href: '/', label: 'Home', icon: <Home size={20} /> },
    { href: '/assignments', label: 'Assignments', icon: <FileText size={20} />, badge: assignments.length },
    { href: '/library', label: 'Library', icon: <Clock size={20} /> },
    { href: '/toolkit', label: 'AI Toolkit', icon: <BookOpen size={20} /> },
  ];

  const isTabActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/assignments') return pathname === '/assignments' || pathname.startsWith('/assignment/');
    return pathname === href;
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
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
            <div className="nav-link-inner"><Home size={18} /> Home</div>
          </Link>
          <Link href="/groups" className={`nav-link ${pathname === '/groups' ? 'active' : ''}`}>
            <div className="nav-link-inner"><Users size={18} /> My Groups</div>
          </Link>
          <Link href="/assignments" className={`nav-link ${pathname === '/assignments' || pathname.startsWith('/assignment/') ? 'active' : ''}`}>
            <div className="nav-link-inner"><FileText size={18} /> Assignments</div>
            {assignments.length > 0 && <span className="nav-badge">{assignments.length}</span>}
          </Link>
          <Link href="/toolkit" className={`nav-link ${pathname === '/toolkit' ? 'active' : ''}`}>
            <div className="nav-link-inner"><BookOpen size={18} /> AI Teacher's Toolkit</div>
          </Link>
          <Link href="/lms" className={`nav-link ${pathname === '/lms' ? 'active' : ''}`}>
            <div className="nav-link-inner"><MonitorPlay size={18} /> Digital LMS</div>
          </Link>
          <Link href="/library" className={`nav-link ${pathname === '/library' ? 'active' : ''}`}>
            <div className="nav-link-inner"><Clock size={18} /> My Library</div>
          </Link>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link href="/settings" className={`nav-link ${pathname === '/settings' ? 'active' : ''}`} style={{ padding: '10px 12px' }}>
            <div className="nav-link-inner"><Settings size={18} /> Settings</div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffedd5', flexShrink: 0, overflow: 'hidden' }}>
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffedd5" alt="Avatar" width="36" height="36" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#111827' }}>Delhi Public School</div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>Bokaro Steel City</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ──────────────────────────────── */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.svg" alt="VedaAI Logo" width={28} height={28} style={{ borderRadius: '6px' }} />
          <span style={{ fontWeight: 700, fontSize: '17px', color: '#09090B', letterSpacing: '-0.4px' }}>VedaAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <Bell size={20} color="#111827" />
            <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%' }} />
          </div>
          {/* Avatar */}
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=c4b5fd" alt="User" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} color="#111827" /> : <Menu size={22} color="#111827" />}
          </button>
        </div>
      </div>

      {/* Mobile full-menu overlay (hamburger) */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 150 }}
          />
          <div style={{
            position: 'fixed', top: 0, right: 0, width: '260px', height: '100vh',
            background: '#fff', zIndex: 200, padding: '24px 20px',
            display: 'flex', flexDirection: 'column', gap: '8px',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.1)',
            overflowY: 'auto'
          }}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '16px', color: '#111827' }}>Menu</div>
            {[
              { href: '/', label: 'Home', icon: <Home size={16} /> },
              { href: '/groups', label: 'My Groups', icon: <Users size={16} /> },
              { href: '/assignments', label: 'Assignments', icon: <FileText size={16} /> },
              { href: '/toolkit', label: 'AI Teacher\'s Toolkit', icon: <BookOpen size={16} /> },
              { href: '/lms', label: 'Digital LMS', icon: <MonitorPlay size={16} /> },
              { href: '/library', label: 'My Library', icon: <Clock size={16} /> },
              { href: '/settings', label: 'Settings', icon: <Settings size={16} /> },
            ].map(item => (
              <Link key={item.href} href={item.href} className={`nav-link ${isTabActive(item.href) ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
                <div className="nav-link-inner">{item.icon} {item.label}</div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ── MOBILE BOTTOM TAB BAR ───────────────────────── */}
      <nav className="mobile-bottom-nav">
        {bottomTabs.map(tab => {
          const active = isTabActive(tab.href);
          return (
            <Link key={tab.href} href={tab.href} style={{ textDecoration: 'none' }}>
              <div className={`bottom-tab ${active ? 'bottom-tab-active' : ''}`}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tab.icon}
                  {tab.badge && tab.badge > 0 && (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-8px',
                      background: '#EF4444', color: 'white',
                      fontSize: '10px', fontWeight: 700,
                      padding: '1px 5px', borderRadius: '100px',
                      lineHeight: '14px'
                    }}>{tab.badge}</span>
                  )}
                </div>
                <span>{tab.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* ── MOBILE FAB ─────────────────────────────────── */}
      <button
        className="mobile-fab"
        onClick={() => router.push('/create')}
        aria-label="Create Assignment"
      >
        <Plus size={22} color="white" />
      </button>
    </>
  );
}
