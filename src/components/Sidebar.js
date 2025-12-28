import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  // Menu navigasi disesuaikan dengan routing di Dashboard
  const menuItems = [
    { id: 'home', icon: '🏠', label: 'Beranda' },
    { id: 'stats', icon: '📊', label: 'Statistik' },
    { id: 'settings', icon: '⚙️', label: 'Setelan' },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Kiri) --- */}
      <aside className="hidden md:flex w-24 bg-white border-r border-slate-100 flex-col items-center py-8 gap-10 sticky top-0 h-screen shadow-sm z-50">
        {/* Logo Warung */}
       <div className="w-12 h-12 bg-[#2D8B73] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 transition-transform hover:rotate-6 select-none">
  <span className="text-white text-2xl">🍲</span>
</div>

        {/* Navigasi Menu Desktop */}
        <nav className="flex flex-col gap-6 w-full px-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex flex-col items-center justify-center py-3 w-full rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? "bg-emerald-50 text-[#2D8B73]" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-[#2D8B73]"
                }`}
              >
                <span className={`text-2xl mb-1 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  {item.label}
                </span>
                {/* Indikator Aktif Samping */}
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-8 bg-[#2D8B73] rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* --- MOBILE BOTTOM NAVIGATION (Bawah) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-4 py-2 flex justify-around items-center z-[100] pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-300 flex-1 ${
                isActive ? "text-[#2D8B73] scale-110" : "text-slate-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`text-[8px] font-black uppercase mt-1 ${isActive ? "opacity-100" : "opacity-50"}`}>
                {item.label}
              </span>
              {/* Indikator Aktif Titik */}
              {isActive && (
                <div className="w-1 h-1 bg-[#2D8B73] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default Sidebar;