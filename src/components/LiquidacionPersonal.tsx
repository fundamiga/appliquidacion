'use client';
import React, { useState, useEffect } from 'react';
import {
  Search, User, Calendar, MinusCircle,
  CheckCircle, Calculator, X, Shield, CreditCard, TrendingUp,
  FileText, Trash2, Download, ChevronRight,
  AlertCircle, Sparkles, BarChart3, Users, Clock
} from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';

interface Persona {
  cedula: string; nombre: string; valorTurno: number; valorHoraAdicional: number; formaPago: string;
}
interface FormLiquidacion {
  diasTurno: number; turnosAdicionales: number; horasAdicionales: number;
  tieneDescuentoSeguridad: boolean; valorDescuentoSeguridad: number;
  tieneDescuentoPrestamo: boolean; valorDescuentoPrestamo: number; observaciones: string;
}
interface Resultado {
  subtotalTurnos: number; subtotalTurnosAdicionales: number; subtotalHoras: number;
  totalBruto: number; descuentoSeguridad: number; descuentoPrestamo: number;
  totalDescuentos: number; neto: number;
}
interface LiquidacionCompleta {
  persona: Persona; form: FormLiquidacion; resultado: Resultado; fecha: string; estado: 'Pendiente' | 'Pagado';
}

const PERSONAS: Persona[] = [
  { cedula: '31483643', nombre: 'Garzon Eloisa', valorTurno: 43000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118295832', nombre: 'Llanten Fernandez Mildred A.', valorTurno: 20000, valorHoraAdicional: 2125, formaPago: 'AV Villas' },
  { cedula: '1118293542', nombre: 'Cabrera Velez Katherine', valorTurno: 23350, valorHoraAdicional: 2919, formaPago: 'Bancolombia' },
  { cedula: '1193412592', nombre: 'Zharith Nicol Polanco', valorTurno: 20000, valorHoraAdicional: 2500, formaPago: 'Nequi' },
  { cedula: '1007779358', nombre: 'Arredondo Angie Melissa', valorTurno: 30000, valorHoraAdicional: 3750, formaPago: 'Transferencia' },
  { cedula: '1118306042', nombre: 'Jhoan Granada', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16453190', nombre: 'Eidier Pabon', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1114542641', nombre: 'Alejandra Chacon', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '94253614', nombre: 'Juan Alquiber Arcilla', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1007779173', nombre: 'Diana Arias', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16461820', nombre: 'Guillermo Dominguez', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1115094396', nombre: 'Mariland Johana Agudelo', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '66998930', nombre: 'Maria Eugenia Noriega', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118309123', nombre: 'Yuri Anzola', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Efectivo' },
  { cedula: '1115088040', nombre: 'Marcos Henao', valorTurno: 23000, valorHoraAdicional: 2875, formaPago: 'Transferencia' },
  { cedula: '88270810', nombre: 'Noe Contreras', valorTurno: 40000, valorHoraAdicional: 5000, formaPago: 'Transferencia' },
  { cedula: '52406220', nombre: 'Claudia Ovalle', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1111775892', nombre: 'Jose Davinson Riascos', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16461107', nombre: 'Galarza Carlos Andres', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1006072723', nombre: 'Esteban Alejandro Arias', valorTurno: 23000, valorHoraAdicional: 2875, formaPago: 'Transferencia' },
  { cedula: '1118305208', nombre: 'Marilin Valdes', valorTurno: 23350, valorHoraAdicional: 2919, formaPago: 'Transferencia' },
  { cedula: '7510791', nombre: 'Gildardo Emilio Moscoso', valorTurno: 20000, valorHoraAdicional: 2500, formaPago: 'Transferencia' },
  { cedula: '', nombre: 'Miguel Angel Saavedra', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118288989', nombre: 'Francisco Echavarria', valorTurno: 20000, valorHoraAdicional: 2500, formaPago: 'Transferencia' },
  { cedula: '111472110', nombre: 'Emilsen Mayorga', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1093214577', nombre: 'Claudia Alvares', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118302471', nombre: 'Angela Ramirez', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118308900', nombre: 'Mariana Ceron', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16454804', nombre: 'Luis Carlos Suarez', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '', nombre: 'Consuelo Perlaza', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16445901', nombre: 'Miguel Benites', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16590651', nombre: 'Parmenides Noreña', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1006287986', nombre: 'Monica Loango', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Transferencia' },
  { cedula: '66932221', nombre: 'Loango Maria Yesenia', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Transferencia' },
  { cedula: '1098653743', nombre: 'Jhon Perez', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Nequi' },
  { cedula: '1113067117', nombre: 'Erika Johana Iter', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Transferencia' },
  { cedula: '1112390304', nombre: 'Jackeline Cazares', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Transferencia' },
  { cedula: '83250261', nombre: 'Tamayo Ipus Jolman Agusto', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Transferencia' },
  { cedula: '16269074', nombre: 'Aragon Cuartas Onney', valorTurno: 23500, valorHoraAdicional: 2938, formaPago: 'Transferencia' },
  { cedula: '6332003', nombre: 'Jose Leonel Ospina', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '18590428', nombre: 'Francisco Lopez', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '29939491', nombre: 'Garzon Donella', valorTurno: 23350, valorHoraAdicional: 2919, formaPago: 'Transferencia' },
  { cedula: '16446859', nombre: 'Marcos Alvares', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '94379974', nombre: 'Hiroshi Takata', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '10127217', nombre: 'Jhon Jairo Castañeda', valorTurno: 23000, valorHoraAdicional: 2875, formaPago: 'Transferencia' },
  { cedula: '1114121378', nombre: 'Isamar Gaurin', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '16454486', nombre: 'Antonio Murillo', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1041328013', nombre: 'Luz Mery Henao', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '94404511', nombre: 'Ospina Fredy Antonio', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118302461', nombre: 'Yulieth Ceron', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '31488255', nombre: 'Yamileth Miranda', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
  { cedula: '1118290778', nombre: 'Diana Lorena Riascos', valorTurno: 17000, valorHoraAdicional: 2125, formaPago: 'Transferencia' },
];

const DESCUENTO_SEG_SOCIAL_FULL = 76200;
const DESCUENTO_PRESTAMOS_DEFAULT = 4000;
const fmt = (n: number) => `$${Math.round(n).toLocaleString('es-CO')}`;

function calcular(p: Persona, f: FormLiquidacion): Resultado {
  const subtotalTurnos = f.diasTurno * p.valorTurno;
  const subtotalTurnosAdicionales = f.turnosAdicionales * p.valorTurno;
  const subtotalHoras = f.horasAdicionales * p.valorHoraAdicional;
  const totalBruto = subtotalTurnos + subtotalTurnosAdicionales + subtotalHoras;
  const descuentoSeguridad = f.tieneDescuentoSeguridad ? f.valorDescuentoSeguridad : 0;
  const descuentoPrestamo = f.tieneDescuentoPrestamo ? f.valorDescuentoPrestamo : 0;
  const totalDescuentos = descuentoSeguridad + descuentoPrestamo;
  const neto = Math.max(0, totalBruto - totalDescuentos);
  return { subtotalTurnos, subtotalTurnosAdicionales, subtotalHoras, totalBruto, descuentoSeguridad, descuentoPrestamo, totalDescuentos, neto };
}

const formVacio = (): FormLiquidacion => ({
  diasTurno: 0, turnosAdicionales: 0, horasAdicionales: 0,
  tieneDescuentoSeguridad: false, valorDescuentoSeguridad: DESCUENTO_SEG_SOCIAL_FULL,
  tieneDescuentoPrestamo: false, valorDescuentoPrestamo: DESCUENTO_PRESTAMOS_DEFAULT,
  observaciones: '',
});

const NumField: React.FC<{ label: string; value: number; onChange: (v: number) => void; prefix?: string; min?: number; step?: number; hint?: string; }> =
  ({ label, value, onChange, prefix = '', min = 0, step = 1, hint }) => (
  <div className="group">
    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-emerald-400 transition-colors">{label}</label>
    {hint && <p className="text-[10px] text-emerald-500 font-semibold mb-1.5 bg-emerald-950/60 border border-emerald-900/60 px-2 py-1 rounded-lg">{hint}</p>}
    <div className="relative">
      {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm pointer-events-none">{prefix}</span>}
      <input type="number" min={min} step={step} value={value || ''} onChange={e => onChange(Number(e.target.value) || 0)}
        className={`w-full ${prefix ? 'pl-8' : 'pl-4'} pr-4 py-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white font-bold text-sm focus:bg-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all`} />
    </div>
  </div>
);

const ToggleRow: React.FC<{ active: boolean; onToggle: () => void; label: string; sublabel: string; iconEl: React.ReactNode; accentClass: string; }> =
  ({ active, onToggle, label, sublabel, iconEl, accentClass }) => (
  <div onClick={onToggle} className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200 select-none ${active ? 'bg-slate-800/80 border-slate-600' : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'}`}>
    <div className={`p-2.5 rounded-xl transition-colors ${active ? accentClass : 'bg-slate-800'}`}>{iconEl}</div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm text-white">{label}</p>
      <p className="text-[10px] text-slate-500">{sublabel}</p>
    </div>
    <div className={`w-12 h-6 rounded-full relative transition-colors duration-200 shrink-0 ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </div>
  </div>
);

export const LiquidacionPersonal: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [form, setForm] = useState<FormLiquidacion>(formVacio());
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [personaEditable, setPersonaEditable] = useState<Persona | null>(null);
  const [historial, setHistorial] = useState<LiquidacionCompleta[]>([]);

  const filtradas = PERSONAS.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || p.cedula.includes(busqueda));
  const totalTurnos = historial.reduce((acc, i) => acc + i.form.diasTurno, 0);
  const totalHoras = historial.reduce((acc, i) => acc + i.form.horasAdicionales, 0);
  const totalBruto = historial.reduce((acc, i) => acc + i.resultado.totalBruto, 0);
  const totalDescuentos = historial.reduce((acc, i) => acc + i.resultado.totalDescuentos, 0);
  const totalNeto = historial.reduce((acc, i) => acc + i.resultado.neto, 0);
  const totalPagado = historial.filter(i => i.estado === 'Pagado').reduce((acc, i) => acc + i.resultado.neto, 0);
  const totalPendiente = historial.filter(i => i.estado === 'Pendiente').reduce((acc, i) => acc + i.resultado.neto, 0);

  const generarExcelDavivienda = () => {
    fetch('/plantilla.xlsx').then(res => res.arrayBuffer()).then(data => {
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
      for (let i = 1; i < json.length; i++) {
        const fila = json[i];
        const cedulaExcel = String(fila[1] || '').trim();
        if (!cedulaExcel) continue;
        const persona = historial.find(item => item.persona.cedula === cedulaExcel && item.persona.formaPago.toLowerCase() === 'davivienda');
        if (persona) fila[7] = persona.resultado.neto;
      }
      wb.Sheets[wb.SheetNames[0]] = XLSX.utils.aoa_to_sheet(json);
      XLSX.writeFile(wb, 'Davivienda_Lleno.xlsx');
    }).catch(err => console.error('Error generando Excel:', err));
  };

  useEffect(() => { const d = localStorage.getItem('liquidaciones'); if (d) setHistorial(JSON.parse(d)); }, []);
  useEffect(() => { localStorage.setItem('liquidaciones', JSON.stringify(historial)); }, [historial]);

  const seleccionar = (p: Persona) => {
    setPersonaSeleccionada(p); setPersonaEditable({ ...p });
    setBusqueda(p.nombre); setMostrarDropdown(false);
    setResultado(null); setForm(formVacio());
  };

  const borrarHistorial = () => {
    if (!confirm("¿Seguro que quieres borrar todo el informe?")) return;
    setHistorial([]); localStorage.removeItem('liquidaciones');
  };

  const obtenerPeriodo = () => {
    const f = new Date(); const dia = f.getDate();
    const mes = f.toLocaleString('es-CO', { month: 'long' }); const año = f.getFullYear();
    return `${dia <= 15 ? '1ra' : '2da'} Quincena - ${mes.charAt(0).toUpperCase() + mes.slice(1)} ${año}`;
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text("Informe General de Liquidaciones", 14, 15);
    doc.setFontSize(10); doc.text(`Periodo: ${obtenerPeriodo()}`, 14, 22);
    const rows = historial.map(item => [
  item.persona.nombre,
  item.persona.cedula || 'N/A',
  item.persona.formaPago,
  item.form.diasTurno,
  item.form.horasAdicionales,
  fmt(item.resultado.totalBruto),
  fmt(item.resultado.descuentoSeguridad),
  fmt(item.resultado.descuentoPrestamo),
  fmt(item.resultado.neto),
  item.estado,
  item.fecha
]);
    const tot = historial.reduce((a, i) => { a.t += i.form.diasTurno; a.h += i.form.horasAdicionales; a.b += i.resultado.totalBruto; a.d += i.resultado.totalDescuentos; a.n += i.resultado.neto; return a; }, { t: 0, h: 0, b: 0, d: 0, n: 0 });
    rows.push(["TOTALES", "", "", tot.t, tot.h, fmt(tot.b), fmt(tot.d), fmt(tot.n), "", ""]);
    autoTable(doc, { startY: 30, head: [["Nombre", "Cédula", "Banco", "Turnos", "Horas", "Total", "Descuentos", "Neto", "Estado", "Fecha"]], body: rows, styles: { fontSize: 8 }, headStyles: { fillColor: [16, 185, 129] } });
    doc.setFontSize(10); doc.text(`Total Pagado: ${fmt(totalPagado)}`, 14, 90); doc.text(`Total Pendiente: ${fmt(totalPendiente)}`, 14, 98);
    doc.save("liquidaciones.pdf");
  };

  const cambiarEstado = (index: number) => { const n = [...historial]; n[index].estado = 'Pagado'; setHistorial(n); };

  const limpiar = () => { setPersonaSeleccionada(null); setBusqueda(''); setResultado(null); setForm(formVacio()); };

  const set = (field: keyof FormLiquidacion, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCalcular = () => {
    if (!personaEditable) return;
    const r = calcular(personaEditable, form);
    setResultado(r);
    setHistorial(prev => [...prev, { persona: personaEditable, form, resultado: r, fecha: new Date().toLocaleString('es-CO'), estado: 'Pendiente' }]);
  };

  const res = resultado;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800/80">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative px-6 md:px-8 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-13 h-13 w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
                <Calculator size={24} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <Sparkles size={8} className="text-yellow-900" />
              </div>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight">Liquidación de Personal</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[9px] font-black px-2.5 py-1 bg-emerald-500/15 text-emerald-400 rounded-lg uppercase tracking-wider border border-emerald-500/20">Módulo Nómina</span>
                <span className="text-[10px] font-semibold text-slate-500">2da Quincena · Marzo 2026</span>
              </div>
            </div>
          </div>
          {historial.length > 0 && (
            <div className="hidden md:flex items-center gap-6">
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Registros</p>
                <p className="text-2xl font-black text-white">{historial.length}</p>
              </div>
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-right">
                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Total Neto</p>
                <p className="text-2xl font-black text-emerald-400">{fmt(totalNeto)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">

          {/* Columna formulario */}
          <div className="space-y-5">

            {/* Buscar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Users size={14} className="text-emerald-400" />
                </div>
                <h3 className="font-black text-base">Seleccionar Trabajador</h3>
              </div>
              <div className="relative">
                <div className={`flex items-center gap-3 pl-4 pr-4 py-3.5 bg-slate-800/60 border rounded-xl transition-all ${mostrarDropdown && busqueda ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-slate-700'}`}>
                  <Search size={16} className="text-slate-500 shrink-0" />
                  <input type="text" placeholder="Buscar por nombre o cédula…" value={busqueda}
                    onChange={e => { setBusqueda(e.target.value); setMostrarDropdown(true); if (personaSeleccionada?.nombre !== e.target.value) { setPersonaSeleccionada(null); setResultado(null); } }}
                    onFocus={() => setMostrarDropdown(true)}
                    className="flex-1 bg-transparent outline-none text-white font-semibold text-sm placeholder:text-slate-600" />
                  {busqueda && <button onClick={limpiar} className="text-slate-600 hover:text-red-400 transition-colors"><X size={15} /></button>}
                </div>
                {mostrarDropdown && busqueda && !personaSeleccionada && filtradas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden max-h-64 overflow-y-auto">
                    {filtradas.map((p, i) => (
                      <button key={i} onClick={() => seleccionar(p)} className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800 text-left transition-colors border-b border-slate-800 last:border-0">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <User size={14} className="text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{p.nombre}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">C.C. {p.cedula || '—'} · {fmt(p.valorTurno)}/turno · {p.formaPago}</p>
                        </div>
                        <ChevronRight size={14} className="text-slate-600 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
                {mostrarDropdown && busqueda && !personaEditable && filtradas.length === 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl p-5 text-center">
                    <AlertCircle size={20} className="text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">Sin resultados para <span className="text-white font-bold">"{busqueda}"</span></p>
                  </div>
                )}
              </div>
              {personaEditable && (
                <div className="mt-4 relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-900/40">
                      <User size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white text-base truncate">{personaEditable.nombre}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/20">C.C. {personaEditable.cedula || 'N/A'}</span>
                        <span className="text-[9px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">{fmt(personaEditable.valorTurno)}/día</span>
                        <span className="text-[9px] font-bold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">{personaEditable.formaPago}</span>
                      </div>
                    </div>
                    <button onClick={limpiar} className="text-slate-600 hover:text-red-400 transition-colors p-1.5 hover:bg-slate-800 rounded-xl"><X size={16} /></button>
                  </div>
                </div>
              )}
            </div>

            {/* Formulario condicional */}
            {personaSeleccionada && (
              <>
                {/* Días y turnos */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <Calendar size={14} className="text-yellow-400" />
                    </div>
                    <h3 className="font-black text-base">Días y Turnos</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <NumField label="Días de turno" value={form.diasTurno} onChange={v => set('diasTurno', v)} hint={`→ ${fmt(form.diasTurno * personaSeleccionada.valorTurno)}`} />
                    <NumField label="Turnos adicionales" value={form.turnosAdicionales} onChange={v => set('turnosAdicionales', v)} hint={`→ ${fmt(form.turnosAdicionales * personaSeleccionada.valorTurno)}`} />
                    <NumField label="Horas adicionales" value={form.horasAdicionales} onChange={v => set('horasAdicionales', v)} hint={`${fmt(personaSeleccionada.valorHoraAdicional)}/h → ${fmt(form.horasAdicionales * personaSeleccionada.valorHoraAdicional)}`} />
                  </div>
                </div>

                {/* Descuentos */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <MinusCircle size={14} className="text-red-400" />
                    </div>
                    <h3 className="font-black text-base">Descuentos</h3>
                  </div>
                  <div className="space-y-3">
                    <ToggleRow active={form.tieneDescuentoSeguridad} onToggle={() => set('tieneDescuentoSeguridad', !form.tieneDescuentoSeguridad)}
                      label="Seguridad Social" sublabel={`Por defecto: ${fmt(DESCUENTO_SEG_SOCIAL_FULL)}`}
                      iconEl={<Shield size={15} className={form.tieneDescuentoSeguridad ? 'text-blue-300' : 'text-slate-500'} />}
                      accentClass="bg-blue-500/20 border border-blue-500/20" />
                    {form.tieneDescuentoSeguridad && (
                      <div className="pl-2 pt-1"><NumField label="Monto seguridad social" value={form.valorDescuentoSeguridad} onChange={v => set('valorDescuentoSeguridad', v)} prefix="$" /></div>
                    )}
                    <ToggleRow active={form.tieneDescuentoPrestamo} onToggle={() => set('tieneDescuentoPrestamo', !form.tieneDescuentoPrestamo)}
                      label="Préstamos y Aportes" sublabel={`Por defecto: ${fmt(DESCUENTO_PRESTAMOS_DEFAULT)}`}
                      iconEl={<CreditCard size={15} className={form.tieneDescuentoPrestamo ? 'text-orange-300' : 'text-slate-500'} />}
                      accentClass="bg-orange-500/20 border border-orange-500/20" />
                    {form.tieneDescuentoPrestamo && (
                      <div className="pl-2 pt-1"><NumField label="Monto préstamos" value={form.valorDescuentoPrestamo} onChange={v => set('valorDescuentoPrestamo', v)} prefix="$" /></div>
                    )}
                  </div>
                </div>

                {/* Ajustar valores */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <TrendingUp size={14} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-base">Ajustar Valores</h3>
                      <p className="text-[10px] text-slate-600 mt-0.5">Edición manual para este cálculo</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <NumField label="Valor turno" value={personaEditable?.valorTurno || 0} onChange={v => setPersonaEditable(prev => prev ? { ...prev, valorTurno: v } : prev)} prefix="$" />
                    <NumField label="Hora adicional" value={personaEditable?.valorHoraAdicional || 0} onChange={v => setPersonaEditable(prev => prev ? { ...prev, valorHoraAdicional: v } : prev)} prefix="$" />
                    <div className="group">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Forma de Pago</label>
                      <select value={personaEditable?.formaPago || ''} onChange={e => setPersonaEditable(prev => prev ? { ...prev, formaPago: e.target.value } : prev)}
                        className="w-full px-4 py-3.5 bg-slate-800/60 border border-slate-700 rounded-xl text-white font-bold text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all">
                        <option value="">Seleccionar banco</option>
                        {['Bancolombia','Nequi','Daviplata','Davivienda','BBVA','Banco de Bogotá','Banco Popular','AV Villas','Caja Social','Transferencia','Efectivo'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Observaciones */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Observaciones <span className="text-slate-700 normal-case font-normal">(opcional)</span></label>
                  <textarea value={form.observaciones} onChange={e => set('observaciones', e.target.value)} placeholder="Notas adicionales…" rows={2}
                    className="w-full px-4 py-3.5 bg-slate-900/80 border border-slate-800 rounded-xl text-white font-medium text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all resize-none placeholder:text-slate-700" />
                </div>

                {/* Calcular */}
                <button onClick={handleCalcular}
                  className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white py-4 px-8 rounded-2xl font-black text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/40 transition-all duration-300 active:scale-[0.98]">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Calculator size={20} strokeWidth={2.5} />
                  <span>Calcular Liquidación</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Columna resultado */}
          <div className="space-y-5">
            {res && personaEditable ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />
                <div className="p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-black text-white text-base leading-tight">{personaEditable.nombre}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date().toLocaleDateString('es-CO')} · {personaEditable.formaPago}</p>
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Turnos regulares <span className="text-slate-600">({form.diasTurno}d)</span></span>
                      <span className="font-bold text-white">{fmt(res.subtotalTurnos)}</span>
                    </div>
                    {res.subtotalTurnosAdicionales > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Turnos adicionales <span className="text-slate-600">({form.turnosAdicionales})</span></span>
                        <span className="font-bold text-white">{fmt(res.subtotalTurnosAdicionales)}</span>
                      </div>
                    )}
                    {res.subtotalHoras > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400">Horas adicionales <span className="text-slate-600">({form.horasAdicionales}h)</span></span>
                        <span className="font-bold text-white">{fmt(res.subtotalHoras)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-700 pt-2.5 flex justify-between items-center">
                      <span className="text-slate-300 font-bold text-sm">Total bruto</span>
                      <span className="font-black text-white">{fmt(res.totalBruto)}</span>
                    </div>
                  </div>
                  {(res.descuentoSeguridad > 0 || res.descuentoPrestamo > 0) && (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 space-y-2">
                      {res.descuentoSeguridad > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-red-400 flex items-center gap-1.5"><Shield size={12} /> Seg. Social</span>
                          <span className="font-bold text-red-400">−{fmt(res.descuentoSeguridad)}</span>
                        </div>
                      )}
                      {res.descuentoPrestamo > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-red-400 flex items-center gap-1.5"><CreditCard size={12} /> Préstamos</span>
                          <span className="font-bold text-red-400">−{fmt(res.descuentoPrestamo)}</span>
                        </div>
                      )}
                      <div className="pt-1 border-t border-red-500/15 flex justify-between text-sm">
                        <span className="text-red-300 font-bold">Total descuentos</span>
                        <span className="font-black text-red-300">−{fmt(res.totalDescuentos)}</span>
                      </div>
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 shadow-xl shadow-emerald-900/40">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="relative flex items-end justify-between">
                      <div>
                        <p className="text-emerald-100 text-[9px] font-black uppercase tracking-widest">Neto a Pagar</p>
                        <p className="text-white text-4xl font-black mt-1 tracking-tight">{fmt(res.neto)}</p>
                        <p className="text-emerald-200 text-xs font-semibold mt-2">{personaEditable.cedula ? `C.C. ${personaEditable.cedula}` : 'Sin cédula'}</p>
                      </div>
                      <div className="bg-white/15 rounded-xl px-3 py-2 text-right">
                        <p className="text-emerald-100 text-[9px] font-bold uppercase">Banco</p>
                        <p className="text-white font-black text-sm mt-0.5">{personaEditable.formaPago}</p>
                      </div>
                    </div>
                  </div>
                  {form.observaciones && (
                    <p className="text-slate-500 text-xs italic flex items-start gap-2">
                      <AlertCircle size={12} className="shrink-0 mt-0.5 text-slate-600" />{form.observaciones}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              !personaSeleccionada && (
                <div className="bg-slate-900/40 border border-slate-800/60 border-dashed rounded-2xl p-10 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
                    <Calculator size={28} className="text-slate-600" />
                  </div>
                  <p className="font-bold text-slate-500">Selecciona un trabajador</p>
                  <p className="text-sm text-slate-700 mt-1">El resultado aparecerá aquí</p>
                </div>
              )
            )}

            {/* Resumen global */}
            {historial.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <BarChart3 size={14} className="text-blue-400" />
                  </div>
                  <h3 className="font-black text-base">Resumen del Periodo</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Trabajadores', value: String(historial.length), color: 'text-white', sub: 'registros' },
                    { label: 'Total Turnos', value: String(totalTurnos), color: 'text-white', sub: 'días' },
                    { label: 'Total Bruto', value: fmt(totalBruto), color: 'text-white', sub: 'antes desc.' },
                    { label: 'Total Neto', value: fmt(totalNeto), color: 'text-emerald-400', sub: 'a pagar' },
                  ].map((s, i) => (
                    <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{s.label}</p>
                      <p className={`font-black text-lg mt-1 ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] text-slate-600">{s.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Pagado</p>
                    <p className="font-black text-emerald-400 text-base mt-1">{fmt(totalPagado)}</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/15 rounded-xl p-3">
                    <p className="text-[9px] font-bold text-yellow-600 uppercase tracking-widest">Pendiente</p>
                    <p className="font-black text-yellow-400 text-base mt-1">{fmt(totalPendiente)}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <button onClick={generarPDF} className="w-full flex items-center justify-center gap-2.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/25 text-red-400 hover:text-red-300 px-4 py-3 rounded-xl font-bold text-sm transition-all">
                    <FileText size={16} />Exportar PDF
                  </button>
                  <button onClick={generarExcelDavivienda} className="w-full flex items-center justify-center gap-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/25 text-emerald-400 hover:text-emerald-300 px-4 py-3 rounded-xl font-bold text-sm transition-all">
                    <Download size={16} />Excel Davivienda
                  </button>
                  <button onClick={borrarHistorial} className="w-full flex items-center justify-center gap-2.5 bg-slate-800/60 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-500 hover:text-red-400 px-4 py-3 rounded-xl font-bold text-sm transition-all">
                    <Trash2 size={15} />Borrar informe
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabla historial */}
        {historial.length > 0 && (
          <div className="mt-8 bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                <FileText size={14} className="text-slate-400" />
              </div>
              <div>
                <h3 className="font-black text-white">Informe General de Liquidaciones</h3>
                <p className="text-[10px] text-slate-600 mt-0.5">{obtenerPeriodo()} · {historial.length} registros</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    {['Trabajador','Cédula','Banco','Turnos','Horas','Bruto','Desc.','Neto','Fecha','Estado'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-[9px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historial.map((item, i) => (
                    <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">{item.persona.nombre}</td>
                      <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">{item.persona.cedula || '—'}</td>
                      <td className="px-4 py-3.5 text-slate-400">{item.persona.formaPago}</td>
                      <td className="px-4 py-3.5 text-center"><span className="bg-yellow-500/10 text-yellow-400 font-bold px-2 py-0.5 rounded-lg text-xs">{item.form.diasTurno}</span></td>
                      <td className="px-4 py-3.5 text-center"><span className="bg-blue-500/10 text-blue-400 font-bold px-2 py-0.5 rounded-lg text-xs">{item.form.horasAdicionales}</span></td>
                      <td className="px-4 py-3.5 text-slate-300 font-semibold">{fmt(item.resultado.totalBruto)}</td>
                      <td className="px-4 py-3.5 text-red-400 font-semibold">{item.resultado.totalDescuentos > 0 ? `−${fmt(item.resultado.totalDescuentos)}` : '—'}</td>
                      <td className="px-4 py-3.5 font-black text-emerald-400">{fmt(item.resultado.neto)}</td>
                      <td className="px-4 py-3.5 text-slate-600 text-xs whitespace-nowrap">{item.fecha}</td>
                      <td className="px-4 py-3.5">
                        {item.estado === 'Pagado' ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-black">
                            <CheckCircle size={10} />Pagado
                          </span>
                        ) : (
                          <button onClick={() => cambiarEstado(i)} className="inline-flex items-center gap-1.5 bg-yellow-500/15 hover:bg-emerald-500/15 text-yellow-400 hover:text-emerald-400 border border-yellow-500/20 hover:border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-black transition-all">
                            <Clock size={10} />Pendiente
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-800/60 border-t-2 border-slate-700">
                    <td colSpan={3} className="px-4 py-4 font-black text-white text-xs uppercase tracking-widest">TOTALES</td>
                    <td className="px-4 py-4 text-center"><span className="bg-yellow-500/20 text-yellow-300 font-black px-2 py-0.5 rounded-lg text-xs">{totalTurnos}</span></td>
                    <td className="px-4 py-4 text-center"><span className="bg-blue-500/20 text-blue-300 font-black px-2 py-0.5 rounded-lg text-xs">{totalHoras}</span></td>
                    <td className="px-4 py-4 text-slate-200 font-black">{fmt(totalBruto)}</td>
                    <td className="px-4 py-4 text-red-300 font-black">−{fmt(totalDescuentos)}</td>
                    <td className="px-4 py-4 text-emerald-300 font-black text-base">{fmt(totalNeto)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
