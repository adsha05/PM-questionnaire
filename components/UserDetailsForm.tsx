
import React, { useState } from 'react';
import { UserInfo } from '../types';

interface UserDetailsFormProps {
  onSubmit: (info: UserInfo) => void;
  onBack: () => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    email: '',
    company: '',
    website: ''
  });

  const isValid = formData.name.trim().length > 0 && 
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
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

        <button
          type="submit"
          disabled={!isValid}
          className={`w-full py-5 rounded-2xl text-lg font-bold transition-all shadow-lg 
            ${isValid 
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
