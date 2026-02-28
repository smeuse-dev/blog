'use client';

import { useState } from 'react';

const categories = [
  { value: 'bug', label: '🐛 버그', labelEn: '🐛 Bug' },
  { value: 'inconvenience', label: '😤 불편사항', labelEn: '😤 Inconvenience' },
  { value: 'suggestion', label: '💡 제안', labelEn: '💡 Suggestion' },
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('bug');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const isKo = typeof window !== 'undefined' && window.location.pathname.startsWith('/ko');

  const submit = async () => {
    if (message.trim().length < 5) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message,
          pageUrl: window.location.href,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setTimeout(() => { setOpen(false); setStatus('idle'); setMessage(''); }, 2000);
      } else {
        const data = await res.json();
        alert(data.error || 'Error');
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#FF6B35] text-white shadow-lg hover:bg-[#e55a2b] transition-all flex items-center justify-center text-xl"
        aria-label="Feedback"
        title={isKo ? '피드백 보내기' : 'Send Feedback'}
      >
        {open ? '✕' : '🐛'}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] bg-[#161B22] border border-[#30363D] rounded-lg shadow-2xl p-4">
          <h3 className="text-sm font-bold text-[#FF6B35] mb-3">
            {isKo ? '📝 피드백' : '📝 Feedback'}
          </h3>

          {/* Category */}
          <div className="flex gap-1 mb-3">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`flex-1 text-xs py-1.5 px-2 rounded transition-colors ${
                  category === c.value
                    ? 'bg-[#FF6B35] text-white'
                    : 'bg-[#21262D] text-[#8B949E] hover:bg-[#30363D]'
                }`}
              >
                {isKo ? c.label : c.labelEn}
              </button>
            ))}
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isKo ? '어떤 점이 불편하셨나요? (5자 이상)' : 'What went wrong? (min 5 chars)'}
            className="w-full h-24 bg-[#0D1117] border border-[#30363D] rounded p-2 text-sm text-[#C9D1D9] placeholder-[#484F58] resize-none focus:border-[#FF6B35] focus:outline-none"
            maxLength={2000}
          />

          {/* Current URL */}
          <div className="text-[10px] text-[#484F58] mt-1 mb-3 truncate">
            📍 {typeof window !== 'undefined' ? window.location.pathname : ''}
          </div>

          {/* Submit */}
          <button
            onClick={submit}
            disabled={status === 'sending' || status === 'sent' || message.trim().length < 5}
            className="w-full py-2 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#FF6B35] text-white hover:bg-[#e55a2b]"
          >
            {status === 'sending' ? (isKo ? '전송 중...' : 'Sending...') :
             status === 'sent' ? (isKo ? '✅ 감사합니다!' : '✅ Thank you!') :
             (isKo ? '보내기' : 'Send')}
          </button>
        </div>
      )}
    </>
  );
}
