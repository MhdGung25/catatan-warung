import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiPhone } from 'react-icons/fi';

export default function PartnersPage() {
  const partners = [
    { id: 1, name: 'PT Sembako Jaya', category: 'Supplier Utama', location: 'Jakarta', phone: '021-998877' },
    { id: 2, name: 'Sayur Segar Barokah', category: 'Sayuran', location: 'Bandung', phone: '022-554433' },
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-10 pb-10 px-4 md:px-10 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
            Mitra <span className="text-emerald-500">Strategis</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">Data penyuplai dan rekanan bisnis Warung Rakyat</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={partner.id}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-50 dark:border-slate-800 hover:border-emerald-200 transition-all"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <FiBriefcase size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-1">{partner.name}</h3>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-6">{partner.category}</p>
              
              <div className="space-y-3 border-t dark:border-slate-800 pt-6">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                  <FiMapPin size={16} /> <span>{partner.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                  <FiPhone size={16} /> <span>{partner.phone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}