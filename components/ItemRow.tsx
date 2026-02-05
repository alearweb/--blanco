
import React from 'react';
import { ShoppingItem } from '../types';

interface ItemRowProps {
  item: ShoppingItem;
  index: number;
  onUpdate: (updates: Partial<ShoppingItem>) => void;
  onRemove: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, index, onUpdate, onRemove }) => {
  const subtotal = item.quantity * item.unitPrice;
  const isIntercalated = index % 2 === 0;

  const handleNumericChange = (field: 'quantity' | 'unitPrice', value: string) => {
    const numValue = parseFloat(value);
    onUpdate({ [field]: isNaN(numValue) ? 0 : numValue });
  };

  const handleToggleBought = (checked: boolean) => {
    // Retroalimentación táctil nativa de Android
    if ("vibrate" in navigator) {
      navigator.vibrate(10);
    }
    onUpdate({ bought: checked });
  };

  const handleDelete = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([20, 30, 20]);
    }
    onRemove();
  };

  return (
    <div className={`
      rounded-3xl shadow-sm border p-4 transition-all duration-300
      ${item.bought 
        ? 'bg-slate-50 border-slate-200 opacity-60 scale-[0.97]' 
        : `border-slate-100 ${isIntercalated ? 'bg-indigo-50/40' : 'bg-white shadow-md shadow-slate-200/50'}`}
    `}>
      <div className="flex items-center gap-4 mb-4">
        <label className="relative flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            className="sr-only peer"
            checked={item.bought}
            onChange={(e) => handleToggleBought(e.target.checked)}
          />
          <div className="w-8 h-8 bg-white border-2 border-slate-300 rounded-xl peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center transition-all shadow-sm">
            <svg 
              className={`w-6 h-6 text-white transform transition-transform duration-200 ${item.bought ? 'scale-110' : 'scale-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </label>

        <input 
          type="text"
          className={`flex-1 font-bold text-lg bg-transparent border-none focus:ring-0 p-0 ${item.bought ? 'line-through text-slate-400' : 'text-slate-800'}`}
          value={item.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Artículo"
        />

        <button 
          onClick={handleDelete}
          className="text-slate-300 active:text-rose-500 transition-colors p-2"
          aria-label="Eliminar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cant.</label>
          <input 
            type="number"
            inputMode="decimal"
            className="w-full bg-slate-100/50 border-none rounded-2xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
            value={item.quantity === 0 ? '' : item.quantity}
            onChange={(e) => handleNumericChange('quantity', e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₡</span>
            <input 
              type="number"
              inputMode="decimal"
              className="w-full bg-slate-100/50 border-none rounded-2xl pl-6 pr-2 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
              value={item.unitPrice === 0 ? '' : item.unitPrice}
              onChange={(e) => handleNumericChange('unitPrice', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subtotal</label>
          <div className="bg-indigo-600 rounded-2xl px-2 py-2.5 text-[13px] font-black text-white flex items-center justify-center h-[42px] shadow-sm shadow-indigo-200">
            ₡{subtotal.toLocaleString('es-CR', { minimumFractionDigits: 0 })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRow;
