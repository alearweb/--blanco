
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { ShoppingItem } from './types';
import Header from './components/Header';
import ItemRow from './components/ItemRow';
import AddItemForm from './components/AddItemForm';

const STORAGE_KEY = 'superlist_offline_data_v3';

const App: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar datos
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar datos locales", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar datos
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((name: string) => {
    if ("vibrate" in navigator) navigator.vibrate([10, 30]);
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name,
      bought: false,
      quantity: 1,
      unitPrice: 0,
    };
    setItems(prev => [newItem, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<ShoppingItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearBought = () => {
    if (window.confirm('¿Eliminar comprados?')) {
      setItems(prev => prev.filter(item => !item.bought));
      if ("vibrate" in navigator) navigator.vibrate(50);
    }
  };

  const uncheckAll = () => {
    if (window.confirm('¿Reiniciar toda la lista?')) {
      setItems(prev => prev.map(item => ({ ...item, bought: false, quantity: 1, unitPrice: 0 })));
      if ("vibrate" in navigator) navigator.vibrate([30, 30, 30]);
    }
  };

  // BACKUP & RESTORE
  const exportData = () => {
    const data = JSON.stringify(items, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SuperList_Respaldo_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setItems(json);
          alert('¡Respaldo restaurado con éxito!');
        }
      } catch (err) {
        alert('Error: Archivo no válido.');
      }
    };
    reader.readAsText(file);
  };

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => item.name.toLowerCase().includes(term));
    }
    return result.sort((a, b) => (a.bought === b.bought ? 0 : a.bought ? 1 : -1));
  }, [items, searchTerm]);

  const boughtItems = useMemo(() => items.filter(i => i.bought), [items]);
  const totalCost = useMemo(() => boughtItems.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0), [boughtItems]);

  const handleShare = async () => {
    if (boughtItems.length === 0) return;
    let content = `🛒 *MI COMPRA*\n━━━━━━━━━━━━\n`;
    boughtItems.forEach(i => content += `✅ *${i.name}* (₡${(i.quantity * i.unitPrice).toLocaleString()})\n`);
    content += `━━━━━━━━━━━━\n💰 *TOTAL: ₡${totalCost.toLocaleString()}*`;
    if (navigator.share) await navigator.share({ text: content });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-2xl mx-auto pb-48">
      <Header 
        total={totalCost} 
        totalItems={items.length} 
        boughtCount={boughtItems.length} 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <main className="flex-1 p-4 space-y-6 mt-2">
        {/* Gestión de Datos */}
        <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <button onClick={uncheckAll} className="flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 active:bg-slate-100 transition-all">Nueva Lista</button>
          <button onClick={clearBought} className="flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 active:bg-rose-100 transition-all">Limpiar</button>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <button onClick={exportData} className="flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 active:bg-indigo-100 transition-all">Backup</button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 active:bg-emerald-100 transition-all">Restore</button>
          <input type="file" ref={fileInputRef} onChange={importData} accept=".json" className="hidden" />
        </div>

        <div className="space-y-4">
          {filteredItems.map((item, idx) => (
            <ItemRow 
              key={item.id} 
              item={item} 
              index={idx}
              onUpdate={upd => updateItem(item.id, upd)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => {
          setIsAddModalOpen(true);
          if ("vibrate" in navigator) navigator.vibrate(15);
        }}
        className="fixed bottom-32 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-[0_15px_35px_-5px_rgba(79,70,229,0.5)] flex items-center justify-center active:scale-90 transition-all z-40 border-4 border-white"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Footer Fijo con Compartir */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-2xl border-t border-slate-100 shadow-[0_-15px_40px_-10px_rgba(0,0,0,0.08)] z-30 rounded-t-[3rem]">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleShare}
            disabled={boughtItems.length === 0}
            className={`w-full font-black py-5 rounded-3xl shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 text-lg ${boughtItems.length > 0 ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            ENVIAR RESUMEN
          </button>
        </div>
      </div>

      <AddItemForm 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addItem} 
      />
    </div>
  );
};

export default App;
