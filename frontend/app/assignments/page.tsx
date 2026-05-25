"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssignmentStore } from '../../store/useAssignmentStore';
import { format } from 'date-fns';
import { Search, Filter, MoreVertical, ArrowLeft, Bell, ChevronDown, Plus, FileText, LayoutGrid } from 'lucide-react';

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
      <div className="page-header-pill" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB' }}>
        
        {/* Left: Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#A9A9A9', fontWeight: 600 }}>
          <ArrowLeft size={20} color="#303030" style={{ cursor: 'pointer' }} />
          <LayoutGrid size={18} color="#A9A9A9" /> 
          <span>Assignment</span>
        </div>

        {/* Right: Notifications & Profile */}
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

      <div style={{ padding: '0', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#4ADE80', border: '4px solid #DCFCE7' }}></div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#111827' }}>Assignments</h1>
        </div>
        <p style={{ color: '#6B7280', margin: 0, fontSize: '14px', paddingLeft: '28px' }}>Manage and create assignments for your classes.</p>
      </div>

      {assignments.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '12px 24px', borderRadius: '9999px', border: '1px solid #E5E7EB', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A9A9A9', fontSize: '14px', fontWeight: 600 }}>
             <Filter size={18} color="#A9A9A9" /> Filter By
          </div>
          <div style={{ position: 'relative', width: '400px' }}>
             <Search size={18} color="#A9A9A9" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
             <input 
                type="text" 
                placeholder="Search Assignment" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ background: '#FFFFFF', borderRadius: '9999px', border: '1px solid #E5E7EB', width: '100%', padding: '12px 16px 12px 44px', fontSize: '14px', outline: 'none', color: '#111827' }} 
             />
          </div>
        </div>
      )}

      {/* Empty State vs Grid */}
      {assignments.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: '40px' }}>
          <div style={{ background: '#FFFFFF', width: 120, height: 120, borderRadius: '24px', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
            <FileText size={48} color="#6B7280" />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>No assignments yet</h3>
          <p style={{ color: '#6B7280', maxWidth: '350px', fontSize: '14px', lineHeight: '1.6', marginBottom: '32px' }}>
            Create your first assignment to start collecting and grading student submissions. Let AI assist you.
          </p>
          <button 
            onClick={() => router.push('/create')}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Create Assignment
          </button>
        </div>
      ) : (
        <div className="assignments-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingBottom: '120px' }}>
          {filteredAssignments.map((assignment: any) => {
            const assignedDate = assignment.createdAt ? format(new Date(assignment.createdAt), 'dd-MM-yyyy') : format(new Date(), 'dd-MM-yyyy');
            const dueDateStr = assignment.dueDate ? format(new Date(assignment.dueDate), 'dd-MM-yyyy') : 'N/A';

            return (
              <div 
                key={assignment._id}
                onClick={() => router.push(`/assignment/${assignment._id}`)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '24px',
                  padding: '32px',
                  cursor: 'pointer',
                  border: '1px solid #E5E7EB',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '64px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>
                    {assignment.title}
                  </h3>
                  
                  <div style={{ position: 'relative' }}>
                    <div 
                      style={{ cursor: 'pointer', padding: '8px', borderRadius: '8px', transition: 'background 0.2s', zIndex: 10 }}
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === assignment._id ? null : assignment._id); }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F6F6F6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <MoreVertical size={20} color="#6B7280" />
                    </div>

                    {/* Menu Popover */}
                    {menuOpenId === assignment._id && (
                      <div style={{ position: 'absolute', top: '100%', right: '0', background: 'white', borderRadius: '16px', boxShadow: '0 16px 48px rgba(0,0,0,0.12)', zIndex: 20, padding: '12px', width: '180px', border: '1px solid #E5E7EB', marginTop: '4px' }}>
                        <div 
                          style={{ padding: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', borderRadius: '12px', color: '#111827' }} 
                          onMouseEnter={e => e.currentTarget.style.background='#F9FAFB'} 
                          onMouseLeave={e => e.currentTarget.style.background='transparent'} 
                          onClick={(e) => { e.stopPropagation(); router.push(`/assignment/${assignment._id}`); }}
                        >
                          View Assignment
                        </div>
                        <div 
                          style={{ padding: '12px', fontSize: '14px', fontWeight: 600, color: '#EF4444', cursor: 'pointer', borderRadius: '12px' }} 
                          onMouseEnter={e => e.currentTarget.style.background='#FEF2F2'} 
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
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                  <span><span style={{ color: '#111827', fontWeight: 800 }}>Assigned on :</span> {assignedDate}</span>
                  <span><span style={{ color: '#111827', fontWeight: 800 }}>Due :</span> {dueDateStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Action Button — hidden on mobile (replaced by Sidebar FAB) */}
      {assignments.length > 0 && (
        <>
          <div className="mobile-hide-fab" style={{ position: 'fixed', bottom: 0, left: '304px', right: 0, height: '160px', background: 'linear-gradient(to top, rgba(244,244,245,1) 0%, rgba(244,244,245,0) 100%)', pointerEvents: 'none', zIndex: 40 }} />
          <div className="mobile-hide-fab" style={{ position: 'fixed', bottom: '40px', left: 'calc(50% + 152px)', transform: 'translateX(-50%)', zIndex: 50 }}>
            <button 
              onClick={() => router.push('/create')}
              style={{ background: '#111827', color: '#fff', border: 'none', padding: '16px 32px', borderRadius: '9999px', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 16px 32px rgba(0,0,0,0.2)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Plus size={20} /> Create Assignment
            </button>
          </div>
        </>
      )}

    </div>
  );
}
