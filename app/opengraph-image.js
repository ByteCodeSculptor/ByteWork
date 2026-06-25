import { ImageResponse } from 'next/og';
import { contact, services } from '@/config/site';

export const alt = `${contact.brand.name}${contact.brand.suffix} — Freelance Application Architecture`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 68, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {contact.brand.name}
          <span style={{ color: '#a5b4fc' }}>{contact.brand.suffix}</span>
        </div>
        <div style={{ display: 'flex', marginTop: 24, fontSize: 34, color: '#e0e7ff', maxWidth: 920 }}>
          Freelance Application Architecture — Quantum, MERN, Java and Python
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 56, flexWrap: 'wrap' }}>
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 9999,
                padding: '12px 28px',
                fontSize: 26,
              }}
            >
              {service.name}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
