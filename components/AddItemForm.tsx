
import React, { useState, useEffect, useRef } from 'react';

interface AddItemFormProps {
  onAdd: (name: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAdd, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom-10 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">NUEVO ARTÍCULO</h2>
          <button onClick={onClose} className="p-2 text-slate-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            ref={inputRef}
            type="text"
            className="w-full bg-slate-100 border-none rounded-2xl px-6 py-5 text-lg font-bold text-slate-700 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400"
            placeholder="Ej: Leche deslactosada"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <button 
            type="submit"
            disabled={!name.trim()}
            className={`
              w-full font-black py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 text-lg
              ${name.trim() ? 'bg-indigo-600 text-white shadow-indigo-200 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
            `}
          >
            AÑADIR A LA LISTA
          </button>
        </form>
      </div>
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
};

export default AddItemForm;
