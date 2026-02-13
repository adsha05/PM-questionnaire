
import React, { useEffect, useRef, useState } from 'react';
import { UserInfo } from '../types';

interface UserDetailsFormProps {
  onSubmit: (info: UserInfo) => void;
  onBack: () => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onSubmit, onBack }) => {
  const turnstileSiteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY || '').trim();
  const requiresTurnstile = turnstileSiteKey.length > 0;
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    website: '',
    turnstileToken: ''
  });
  const [turnstileError, setTurnstileError] = useState<string | null>(null);

  const isValid = formData.name.trim().length > 0 &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const canSubmit = isValid && (!requiresTurnstile || Boolean(formData.turnstileToken));

  useEffect(() => {
    if (!requiresTurnstile || !turnstileContainerRef.current) return;

    let cancelled = false;
    const scriptId = 'turnstile-script';

    const renderWidget = () => {
      if (cancelled || !turnstileContainerRef.current || !window.turnstile) return;
      if (widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: (token: string) => {
          setTurnstileError(null);
          setFormData((prev) => ({ ...prev, turnstileToken: token }));
        },
        'expired-callback': () => {
          setFormData((prev) => ({ ...prev, turnstileToken: '' }));
        },
        'error-callback': () => {
          setFormData((prev) => ({ ...prev, turnstileToken: '' }));
          setTurnstileError('Security check failed. Please refresh and retry.');
        }
      });
    };

    if (window.turnstile) {
      renderWidget();
      return () => {
        cancelled = true;
        if (window.turnstile && widgetIdRef.current !== null) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }

    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    const onLoad = () => {
      if (script) script.dataset.loaded = 'true';
      renderWidget();
    };

    const onError = () => {
      setTurnstileError('Could not load security verification. Please refresh and try again.');
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
      document.head.appendChild(script);
    } else if (script.dataset.loaded === 'true') {
      renderWidget();
    } else {
      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);
    }

    return () => {
      cancelled = true;
      if (script) {
        script.removeEventListener('load', onLoad);
        script.removeEventListener('error', onError);
      }
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [requiresTurnstile, turnstileSiteKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-8 sm:p-12 animate-fadeIn">
      <button 
        onClick={onBack}
        className="text-slate-400 hover:text-indigo-600 font-semibold text-sm transition-colors mb-6 flex items-center gap-1"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-slate-900 mb-2">First, a bit about you</h2>
      <p className="text-slate-500 mb-8">We'll use this to benchmark your results against PMs from similar companies.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
          <input
            autoFocus
            type="text"
            id="name"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            placeholder="Jane Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Work Email *</label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            placeholder="jane@startup.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-bold text-slate-700 mb-2">Company (Optional)</label>
          <input
            type="text"
            id="company"
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
            placeholder="Acme Corp"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>

        {requiresTurnstile && (
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Security Check *</label>
            <div ref={turnstileContainerRef} />
            {turnstileError && (
              <p className="mt-2 text-sm text-rose-600 font-semibold">{turnstileError}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-5 rounded-2xl text-lg font-bold transition-all shadow-lg 
            ${canSubmit 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 transform hover:scale-[1.01] active:scale-95' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
        >
          Enter the Challenge →
        </button>
      </form>
    </div>
  );
};

export default UserDetailsForm;
