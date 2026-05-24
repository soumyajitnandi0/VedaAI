"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import { format } from 'date-fns';
import { Search, Filter, MoreVertical, ArrowLeft, Grid, Bell, ChevronDown, Plus, FileText, Calendar } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const { assignments, fetchAssignments, deleteAssignment } = useAssignmentStore();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAssignments = assignments.filter((a: any) => 
    a.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', position: 'relative' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--accent-alt)', padding: '16px 24px', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', marginBottom: '32px' }}>
        
        {/* Left: Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: 800, minWidth: '150px', textTransform: 'uppercase' }}>
          <ArrowLeft size={20} color="#000" style={{ cursor: 'pointer' }} />
          Assignments
        </div>

        {/* Center: Search & Filter */}
        {assignments.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} color="#000" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="SEARCH ASSIGNMENTS..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '12px 16px 12px 48px', border: 'var(--border-thick)', outline: 'none', fontSize: '14px', width: '350px', background: '#fff', transition: 'all 0.1s', boxShadow: '2px 2px 0px 0px #000', fontWeight: 700 }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', border: 'var(--border-thick)', background: '#fff', padding: '10px 16px', color: '#000', cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.1s', boxShadow: '2px 2px 0px 0px #000', textTransform: 'uppercase' }} onMouseEnter={e => { e.currentTarget.style.transform='translate(1px,1px)'; e.currentTarget.style.boxShadow='1px 1px 0px #000'; }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='2px 2px 0px #000'; }}>
              <Filter size={18} />
              Filter
            </button>
          </div>
        )}
        
        {/* Right: Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '150px', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', cursor: 'pointer', padding: '8px', border: 'var(--border-thin)', background: '#fff', boxShadow: '2px 2px 0px #000', transition: 'all 0.1s' }} onMouseEnter={e => { e.currentTarget.style.transform='translate(1px,1px)'; e.currentTarget.style.boxShadow='1px 1px 0px #000'; }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='2px 2px 0px #000'; }}>
            <Bell size={20} color="#000" />
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', background: 'var(--accent-danger)', border: '2px solid #000' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', border: 'var(--border-thin)', background: '#fff', boxShadow: '2px 2px 0px #000', transition: 'all 0.1s' }} onMouseEnter={e => { e.currentTarget.style.transform='translate(1px,1px)'; e.currentTarget.style.boxShadow='1px 1px 0px #000'; }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='2px 2px 0px #000'; }}>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=c4b5fd" alt="User" style={{ width: '32px', height: '32px', border: '2px solid #000', borderRadius: '0' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase' }}>John Doe</span>
            <ChevronDown size={16} color="#000" />
          </div>
        </div>
      </div>

      {/* Empty State vs Grid */}
      {assignments.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '40px' }}>
          <div style={{ background: 'var(--accent-primary)', width: 160, height: 160, border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', position: 'relative' }}>
            <FileText size={64} color="#000" />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', textTransform: 'uppercase' }}>No assignments yet</h3>
          <p style={{ color: '#000', maxWidth: '400px', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px', fontWeight: 500 }}>
            Create your first assignment to start collecting and grading student submissions. Let AI assist you.
          </p>
          <button 
            onClick={() => router.push('/create')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
          >
            <Plus size={20} /> CREATE YOUR FIRST ASSIGNMENT
          </button>
        </div>
      ) : (
        <div className="assignments-grid">
          {filteredAssignments.map((assignment: any, index: number) => {
            const colors = ['var(--accent-color)', 'var(--accent-alt)', 'var(--accent-danger)', 'var(--accent-primary)'];
            const grad = colors[index % colors.length];
            const qCount = assignment.questions?.length || 0;

            return (
              <div 
                key={assignment._id} 
                className="assignment-card"
                onClick={() => router.push(`/assignment/${assignment._id}`)}
              >
                {/* Accent Line */}
                <div className="card-accent" style={{ background: grad }} />

                <div className="card-body">
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#fff', border: 'var(--border-thin)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 0px #000' }}>
                        <FileText size={24} color="#000" />
                      </div>
                      {qCount > 0 && (
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#fff', background: '#000', padding: '4px 10px', textTransform: 'uppercase' }}>
                          {qCount} Q{qCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div 
                      style={{ cursor: 'pointer', padding: '8px', border: 'var(--border-thin)', background: '#fff', boxShadow: '2px 2px 0px #000', transition: 'all 0.1s', position: 'relative', zIndex: 10 }}
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === assignment._id ? null : assignment._id); }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translate(1px,1px)'; e.currentTarget.style.boxShadow='1px 1px 0px #000'; }} 
                      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='2px 2px 0px #000'; }}
                    >
                      <MoreVertical size={20} color="#000" />
                    </div>
                  </div>

                  {/* Menu Popover */}
                  {menuOpenId === assignment._id && (
                    <div style={{ position: 'absolute', top: '80px', right: '16px', background: 'white', border: 'var(--border-thick)', boxShadow: 'var(--shadow-brutal)', zIndex: 20, padding: '8px', width: '180px' }}>
                      <div 
                        style={{ padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', transition: 'background 0.1s', display: 'flex', alignItems: 'center', gap: '10px', color: '#000', textTransform: 'uppercase', borderBottom: '2px solid #000' }} 
                        onMouseEnter={e => e.currentTarget.style.background='var(--accent-primary)'} 
                        onMouseLeave={e => e.currentTarget.style.background='transparent'} 
                        onClick={() => router.push(`/assignment/${assignment._id}`)}
                      >
                        <FileText size={16} color="#000" /> View Details
                      </div>
                      <div 
                        style={{ padding: '12px', fontSize: '14px', fontWeight: 700, color: '#000', cursor: 'pointer', transition: 'background 0.1s', display: 'flex', alignItems: 'center', gap: '10px', textTransform: 'uppercase' }} 
                        onMouseEnter={e => e.currentTarget.style.background='var(--accent-danger)'} 
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this assignment?')) {
                            try {
                              await deleteAssignment(assignment._id);
                            } catch (err) {
                              alert('Failed to delete assignment.');
                            }
                          }
                        }}
                      >
                        <Filter size={16} color="#000" /> Delete
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#000', margin: '0 0 8px 0', lineHeight: 1.4, textTransform: 'uppercase' }}>
                    {assignment.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#000', margin: '0 0 0 0', fontWeight: 600, background: 'var(--accent-alt)', display: 'inline-block', padding: '2px 8px', border: '1px solid #000' }}>
                    AI GENERATED
                  </p>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px', borderTop: 'var(--border-thin)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#000" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#000', textTransform: 'uppercase' }}>
                        {format(new Date(assignment.createdAt || assignment.dueDate), 'MMM dd')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-primary)', padding: '4px 8px', border: '1px solid #000' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#000', textTransform: 'uppercase' }}>
                        DUE {format(new Date(assignment.dueDate), 'MMM dd')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Create Button for populated state */}
      {assignments.length > 0 && (
        <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}>
          <button 
            onClick={() => router.push('/create')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}
          >
            <Plus size={20} /> CREATE ASSIGNMENT
          </button>
        </div>
      )}
    </div>
  );
}
