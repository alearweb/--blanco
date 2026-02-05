
import React from 'react';

interface HeaderProps {
  total: number;
  totalItems: number;
  boughtCount: number;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ total, totalItems, boughtCount, searchTerm, setSearchTerm }) => {
  const percentage = totalItems > 0 ? Math.round((boughtCount / totalItems) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-indigo-600 text-white p-5 shadow-xl rounded-b-[2.5rem]">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-xl font-black tracking-tighter leading-none mb-1">SUPERLIST</h1>
          <p className="text-indigo-200 text-[11px] font-bold uppercase tracking-wider">
            {boughtCount} / {totalItems} LISTO
          </p>
        </div>
        <div className="text-right">
          <p className="text-indigo-200 text-[10px] font-bold uppercase opacity-80 mb-0">Total</p>
          <p className="text-2xl font-black text-white leading-none">
            ₡{total.toLocaleString('es-CR', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Buscador integrado en el área azul */}
      <div className="relative mb-4">
        <input 
          type="text"
          className="w-full bg-white/10 border border-white/20 rounded-2xl pl-11 pr-10 py-3 text-sm placeholder-indigo-200 text-white focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all shadow-inner"
          placeholder="Buscar artículo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-200 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="w-full bg-indigo-900/40 rounded-full h-2.5 overflow-hidden border border-white/10">
        <div 
          className="bg-emerald-400 h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(52,211,153,0.6)]" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </header>
  );
};

export default Header;
