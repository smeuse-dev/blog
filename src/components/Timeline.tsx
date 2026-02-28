'use client';

import React from 'react';

interface TimelineEvent {
  time: string;
  title: string;
  description?: string;
  type?: 'attack' | 'response' | 'diplomacy' | 'escalation' | 'info' | 'warning';
}

interface TimelineProps {
  events: TimelineEvent[];
  title?: string;
}

const typeConfig: Record<string, { color: string; bg: string; icon: string; border: string }> = {
  attack:     { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '💥', border: '#ef4444' },
  response:   { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  icon: '🔄', border: '#f97316' },
  diplomacy:  { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  icon: '🤝', border: '#3b82f6' },
  escalation: { color: '#dc2626', bg: 'rgba(220,38,38,0.1)',   icon: '⚠️', border: '#dc2626' },
  info:       { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '📌', border: '#6b7280' },
  warning:    { color: '#eab308', bg: 'rgba(234,179,8,0.1)',   icon: '🚨', border: '#eab308' },
};

export default function Timeline({ events, title }: TimelineProps) {
  return (
    <div style={{ margin: '2rem 0' }}>
      {title && (
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--text-primary, #e5e7eb)',
        }}>
          {title}
        </h3>
      )}
      <div style={{ position: 'relative', paddingLeft: '2rem' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute',
          left: '0.55rem',
          top: 0,
          bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, var(--border-color, #374151), transparent)',
        }} />

        {events.map((event, i) => {
          const config = typeConfig[event.type || 'info'];
          return (
            <div key={i} style={{
              position: 'relative',
              marginBottom: i === events.length - 1 ? 0 : '1.25rem',
            }}>
              {/* Dot */}
              <div style={{
                position: 'absolute',
                left: '-1.65rem',
                top: '0.35rem',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: config.color,
                border: `2px solid ${config.border}`,
                boxShadow: `0 0 8px ${config.color}40`,
                zIndex: 1,
              }} />

              {/* Card */}
              <div style={{
                background: config.bg,
                border: `1px solid ${config.border}30`,
                borderRadius: '0.75rem',
                padding: '0.875rem 1rem',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${config.color}20`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: event.description ? '0.375rem' : 0,
                  flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: '0.95rem' }}>{config.icon}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: config.color,
                    fontFamily: 'monospace',
                    whiteSpace: 'nowrap',
                    background: `${config.color}15`,
                    padding: '0.125rem 0.5rem',
                    borderRadius: '0.25rem',
                  }}>
                    {event.time}
                  </span>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: 'var(--text-primary, #e5e7eb)',
                    lineHeight: 1.3,
                  }}>
                    {event.title}
                  </span>
                </div>
                {event.description && (
                  <p style={{
                    margin: 0,
                    fontSize: '0.825rem',
                    color: 'var(--text-secondary, #9ca3af)',
                    lineHeight: 1.5,
                    paddingLeft: '1.5rem',
                  }}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
