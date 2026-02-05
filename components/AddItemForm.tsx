
import React, { useState } from 'react';

interface AddItemFormProps {
  onAdd: (name: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <input 
        type="text"
        className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-4 pr-16 shadow-sm focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-700 font-medium text-lg"
        placeholder="¿Qué necesitas comprar?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button 
        type="submit"
        disabled={!name.trim()}
        className={`
          absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center transition-all
          ${name.trim() ? 'bg-indigo-600 text-white shadow-md active:scale-90' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}
        `}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </form>
  );
};

export default AddItemForm;
