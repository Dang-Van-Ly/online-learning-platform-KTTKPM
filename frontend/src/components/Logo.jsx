import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Logo() {
  const navigate = useNavigate();

  return (
    <div 
      style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} 
      onClick={() => navigate('/')}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <div style={{ width: '22px', height: '22px', backgroundColor: '#3ea2ff' }}></div>
        <div style={{ width: '22px', height: '22px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={18} color="#f97316" />
        </div>
        <div style={{ width: '22px', height: '22px', backgroundColor: '#ff8a00' }}></div>
        <div style={{ width: '22px', height: '22px', backgroundColor: '#3ea2ff' }}></div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#1665b5', lineHeight: '1', letterSpacing: '0.5px' }}>KHOKHOAHOC</div>
        <div style={{ fontSize: '18px', fontWeight: '900', color: '#ff8a00', lineHeight: '1', marginTop: '3px' }}>.ORG</div>
      </div>
    </div>
  );
}
