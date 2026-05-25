"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';

export default function LibraryPage() {
  const router = useRouter();

  return (
    <div style={{ padding: '0', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '16px 24px', borderRadius: '9999px', marginBottom: '32px', border: '1px solid #E5E7EB', width: '100%', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#111827', fontWeight: 600, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <ArrowLeft size={18} color="#111827" /> BACK TO DASHBOARD
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#6B7280', fontWeight: 600 }}>
          <BookOpen size={18} /> 
          <span>My Library</span>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px', marginBottom: '10vh' }}>
        <div style={{ width: '80px', height: '80px', background: '#F9FAFB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E5E7EB', marginBottom: '24px' }}>
          <Clock size={40} color="#6B7280" />
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#111827', marginBottom: '16px', letterSpacing: '-0.5px' }}>Coming Soon</h2>
        <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: 400, maxWidth: '400px', lineHeight: 1.6, marginBottom: '32px' }}>
          Your personal resource library is under construction. Soon you'll be able to save, organize, and share all your generated content in one place.
        </p>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 32px' }} onClick={() => router.push('/')}>
          <ArrowLeft size={18} /> Return Home
        </button>
      </div>
    </div>
  );
}
