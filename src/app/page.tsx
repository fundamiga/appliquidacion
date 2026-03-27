'use client';
import Image from 'next/image';
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { LiquidacionPersonal } from '@/components/LiquidacionPersonal';
import { BotonAccesoAdmin } from '@/components/BotonAccesoAdmin';

export default function SistemaControlDonaciones() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">

      {/* Luces de fondo */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-100/30 blur-[120px] rounded-full -z-10 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-100/20 blur-[100px] rounded-full -z-10 translate-x-1/4 -translate-y-1/4"></div>

      {/* Navbar */}
      <nav className="bg-white/60 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 p-1 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Image src="/LOGO.png" alt="Fundamiga Logo" fill className="object-contain p-1" priority />
            </div>
            <div>
              <span className="text-xl font-black text-slate-800 tracking-tight block leading-none">
                Fundamiga
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  Liquidación de Personal
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
            <CheckCircle size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-tighter">
              Sistema Operativo
            </span>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-6 py-12 relative">

        {/* Título */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
            Liquidación de <span className="text-emerald-600">Personal</span>
          </h1>
          <p className="text-slate-500 font-medium mt-4 text-lg max-w-2xl border-l-4 border-yellow-400 pl-6">
            Gestión de pagos, cálculos y control del personal de la fundación.
          </p>
        </div>

        {/* SOLO LIQUIDACIÓN */}
        <div className="flex justify-center items-start min-h-[70vh]">
          <div className="w-full max-w-5xl">
            <LiquidacionPersonal />
          </div>
        </div>

      </main>

      {/* Acceso admin */}
      <BotonAccesoAdmin />
    </div>
  );
}