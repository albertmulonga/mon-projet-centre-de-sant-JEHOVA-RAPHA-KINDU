"use client";
import Link from "next/link";
import { useState } from "react";

// ─── Demo data (no database needed) ───────────────────────────────────────────
const kpiData = [
  {
    id: "patients",
    icon: "👥",
    label: "Total Patients",
    value: "1 240",
    sub: "+12 aujourd'hui",
    trend: "+5.2%",
    up: true,
    color: "#1a56db",
    bg: "linear-gradient(135deg, #1a56db, #3b82f6)",
    light: "#eff6ff",
  },
  {
    id: "consultations",
    icon: "🩺",
    label: "Consultations",
    value: "28",
    sub: "Aujourd'hui",
    trend: "+3",
    up: true,
    color: "#0e9f6e",
    bg: "linear-gradient(135deg, #0e9f6e, #34d399)",
    light: "#f0fdf4",
  },
  {
    id: "chambres",
    icon: "🏨",
    label: "Chambres Libres",
    value: "12",
    sub: "sur 45 chambres",
    trend: "-2",
    up: false,
    color: "#7c3aed",
    bg: "linear-gradient(135deg, #7c3aed, #a78bfa)",
    light: "#f5f3ff",
  },
  {
    id: "medicaments",
    icon: "💊",
    label: "Médicaments",
    value: "320",
    sub: "En stock",
    trend: "4 alertes",
    up: false,
    color: "#d97706",
    bg: "linear-gradient(135deg, #d97706, #fbbf24)",
    light: "#fffbeb",
  },
  {
    id: "factures",
    icon: "💰",
    label: "Recettes du Jour",
    value: "45 000 FC",
    sub: "+8 factures",
    trend: "+18%",
    up: true,
    color: "#059669",
    bg: "linear-gradient(135deg, #059669, #10b981)",
    light: "#ecfdf5",
  },
  {
    id: "labo",
    icon: "🔬",
    label: "Examens Labo",
    value: "15",
    sub: "En attente",
    trend: "+5",
    up: false,
    color: "#0891b2",
    bg: "linear-gradient(135deg, #0891b2, #22d3ee)",
    light: "#ecfeff",
  },
];

// Weekly consultations (Mon–Sun)
const weeklyConsultations = [
  { day: "Lun", value: 22 },
  { day: "Mar", value: 35 },
  { day: "Mer", value: 28 },
  { day: "Jeu", value: 40 },
  { day: "Ven", value: 32 },
  { day: "Sam", value: 18 },
  { day: "Dim", value: 10 },
];

// Monthly revenue by category
const revenueData = [
  { label: "Consultations", amount: 125000, color: "#1a56db", percent: 35 },
  { label: "Laboratoire",   amount: 85000,  color: "#7c3aed", percent: 24 },
  { label: "Pharmacie",     amount: 95000,  color: "#0e9f6e", percent: 27 },
  { label: "Hospitalisation", amount: 50000, color: "#d97706", percent: 14 },
];

const recentPatients = [
  { id: "PAT-001", name: "Marie Kabila",  age: 34, motif: "Fièvre",       medecin: "Dr. Mutombo", status: "En consultation", statusColor: "badge-info" },
  { id: "PAT-002", name: "Jean Mwamba",   age: 52, motif: "Hypertension", medecin: "Dr. Kasongo",  status: "Hospitalisé",     statusColor: "badge-warning" },
  { id: "PAT-003", name: "Amina Lokwa",   age: 28, motif: "Grossesse",    medecin: "Dr. Mutombo", status: "Sorti",           statusColor: "badge-success" },
  { id: "PAT-004", name: "Pierre Ngoy",   age: 45, motif: "Diabète",      medecin: "Dr. Kasongo",  status: "En attente",      statusColor: "badge-gray" },
  { id: "PAT-005", name: "Sophie Tshala", age: 19, motif: "Paludisme",    medecin: "Dr. Mutombo", status: "En consultation", statusColor: "badge-info" },
  { id: "PAT-006", name: "David Kalala",  age: 61, motif: "Cardiopathie", medecin: "Dr. Kasongo",  status: "Hospitalisé",     statusColor: "badge-warning" },
];

const recentActivities = [
  { time: "08:30", action: "Nouveau patient enregistré",  detail: "Marie Kabila — PAT-001",       icon: "👤", color: "#1a56db" },
  { time: "09:15", action: "Consultation terminée",       detail: "Dr. Mutombo — Jean Mwamba",    icon: "🩺", color: "#0e9f6e" },
  { time: "10:00", action: "Résultat labo disponible",    detail: "Analyse sang — PAT-003",       icon: "🔬", color: "#7c3aed" },
  { time: "10:45", action: "Médicament dispensé",         detail: "Amoxicilline 500mg ×30",       icon: "💊", color: "#d97706" },
  { time: "11:20", action: "Facture générée",             detail: "PAT-002 — 25 000 FC",          icon: "🧾", color: "#059669" },
  { time: "12:00", action: "Chambre libérée",             detail: "Chambre 12 — Standard",        icon: "🏨", color: "#0891b2" },
  { time: "13:10", action: "Examen labo demandé",         detail: "NFS — PAT-005",                icon: "🔬", color: "#7c3aed" },
];

const roomStatus = [
  { type: "VIP",      total: 10, occupied: 7,  color: "#7c3aed" },
  { type: "Standard", total: 25, occupied: 18, color: "#1a56db" },
  { type: "Urgence",  total: 10, occupied: 8,  color: "#e02424" },
];

const stockAlerts = [
  { name: "Paracétamol 500mg",  stock: 15, min: 50, level: "critical" },
  { name: "Quinine 300mg",      stock: 8,  min: 30, level: "critical" },
  { name: "Amoxicilline 250mg", stock: 28, min: 50, level: "warning" },
  { name: "Métronidazole",      stock: 35, min: 50, level: "warning" },
];

const quickActions = [
  { href: "/dashboard/patients",       icon: "👤", label: "Nouveau Patient",  color: "#1a56db" },
  { href: "/dashboard/consultations",  icon: "🩺", label: "Consultation",     color: "#0e9f6e" },
  { href: "/dashboard/laboratoire",    icon: "🔬", label: "Examen Labo",      color: "#7c3aed" },
  { href: "/dashboard/medicaments",    icon: "💊", label: "Médicament",       color: "#d97706" },
  { href: "/dashboard/hospitalisation",icon: "🏨", label: "Hospitaliser",     color: "#e02424" },
  { href: "/dashboard/factures",       icon: "🧾", label: "Facture",          color: "#059669" },
  { href: "/dashboard/bon-sortie",     icon: "📋", label: "Bon de Sortie",    color: "#0891b2" },
  { href: "/dashboard/rapports",       icon: "📈", label: "Rapport",          color: "#f97316" },
];

// ─── Bar chart component ───────────────────────────────────────────────────────
function BarChart({ data }: { data: { day: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((d, i) => {
        const height = Math.round((d.value / max) * 100);
        const isToday = i === 4; // Friday = today (demo)
        return (
          <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
            <span className="text-xs font-semibold" style={{ color: isToday ? "#1a56db" : "#94a3b8" }}>
              {d.value}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${height}%`,
                background: isToday
                  ? "linear-gradient(180deg, #1a56db, #3b82f6)"
                  : "linear-gradient(180deg, #cbd5e1, #e2e8f0)",
                minHeight: "4px",
              }}
            />
            <span className="text-xs" style={{ color: isToday ? "#1a56db" : "#94a3b8", fontWeight: isToday ? 700 : 400 }}>
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Donut chart component ─────────────────────────────────────────────────────
function DonutChart({ data }: { data: { label: string; percent: number; color: string }[] }) {
  const size = 120;
  const r = 44;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Pre-compute offsets without mutation during render
  const segments = data.reduce<{ d: typeof data[0]; dash: number; offset: number }[]>((acc, d) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    const dash = (d.percent / 100) * circumference;
    return [...acc, { d, dash, offset: prevOffset }];
  }, []);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="14" />
      {segments.map(({ d, dash, offset }) => {
        const gap = circumference - dash;
        return (
          <circle
            key={d.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        );
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1e293b">355K</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="#94a3b8">FC / mois</text>
    </svg>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
function getStoredUser(): { nom: string; role: string } {
  if (typeof window === "undefined") return { nom: "Administrateur", role: "admin" };
  const stored = sessionStorage.getItem("hospital_user");
  if (!stored) return { nom: "Administrateur", role: "admin" };
  try { return JSON.parse(stored); } catch { return { nom: "Administrateur", role: "admin" }; }
}

export default function DashboardPage() {
  const [sessionUser] = useState(getStoredUser);
  const userName = sessionUser?.nom || "Administrateur";

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const totalRevenue = revenueData.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: "#f0f4f8" }}>
      {/* ── Top Header ── */}
      <div className="page-header">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-xs text-gray-400 capitalize mt-0.5">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Système actif
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Bienvenue, <span className="font-semibold text-gray-700">{userName}</span>
          </div>
          <Link href="/dashboard/patients" className="btn btn-primary btn-sm">
            + Nouveau Patient
          </Link>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiData.map((kpi) => (
            <div key={kpi.id} className="stat-card group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm"
                  style={{ background: kpi.bg }}
                >
                  {kpi.icon}
                </div>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: kpi.up ? "#dcfce7" : "#fee2e2",
                    color: kpi.up ? "#166534" : "#991b1b",
                  }}
                >
                  {kpi.up ? "▲" : "▼"} {kpi.trend}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-800 leading-tight">{kpi.value}</div>
              <div className="text-xs font-semibold text-gray-500 mt-0.5">{kpi.label}</div>
              <div className="text-xs mt-1" style={{ color: kpi.color }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
            <span>⚡</span> Actions Rapides
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:scale-105 hover:shadow-md"
                style={{ background: `${action.color}0d`, border: `1px solid ${action.color}25` }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: `${action.color}18` }}
                >
                  {action.icon}
                </div>
                <span className="text-xs font-medium leading-tight" style={{ color: action.color }}>
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Charts Row ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Weekly Consultations Bar Chart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-700 text-sm">Consultations — Cette Semaine</h2>
                <p className="text-xs text-gray-400 mt-0.5">Volume journalier des consultations</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-800">185</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "#dcfce7", color: "#166534" }}>
                  ▲ +12%
                </span>
              </div>
            </div>
            <BarChart data={weeklyConsultations} />
          </div>

          {/* Revenue Donut */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-700 text-sm">Revenus du Mois</h2>
                <p className="text-xs text-gray-400 mt-0.5">Répartition par service</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DonutChart data={revenueData} />
              <div className="flex-1 space-y-2">
                {revenueData.map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="flex items-center gap-1.5 text-gray-600">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }}></span>
                        {d.label}
                      </span>
                      <span className="font-semibold text-gray-700">{d.percent}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${d.percent}%`, background: d.color }}></div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100 flex justify-between">
                  <span className="text-xs font-semibold text-gray-500">Total</span>
                  <span className="text-sm font-bold text-green-600">
                    {totalRevenue.toLocaleString("fr-FR")} FC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Patients + Activity ── */}
        <div className="grid xl:grid-cols-3 gap-5">
          {/* Recent Patients Table */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-700 text-sm">Patients Récents</h2>
                <p className="text-xs text-gray-400 mt-0.5">Dernières admissions du jour</p>
              </div>
              <Link href="/dashboard/patients" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                Voir tout <span>→</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Motif</th>
                    <th>Médecin</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPatients.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <span className="font-mono text-xs font-semibold" style={{ color: "#1a56db" }}>{p.id}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
                          >
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
                            <div className="text-xs text-gray-400">{p.age} ans</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-gray-600 text-sm">{p.motif}</td>
                      <td className="text-gray-500 text-xs">{p.medecin}</td>
                      <td><span className={`badge ${p.statusColor}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-700 text-sm">Activités Récentes</h2>
                <p className="text-xs text-gray-400 mt-0.5">Flux en temps réel</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: "#f0fdf4", color: "#166534" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            </div>
            <div className="p-4 space-y-1 overflow-y-auto" style={{ maxHeight: "360px" }}>
              {recentActivities.map((a, i) => (
                <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: `${a.color}15` }}
                    >
                      {a.icon}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 leading-tight">{a.action}</div>
                    <div className="text-xs text-gray-400 truncate mt-0.5">{a.detail}</div>
                  </div>
                  <div className="text-xs text-gray-400 flex-shrink-0 mt-0.5 font-mono">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Row: Rooms + Stock + Operations ── */}
        <div className="grid md:grid-cols-3 gap-5">
          {/* Room Status */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <span>🏨</span> État des Chambres
            </h3>
            <div className="space-y-4">
              {roomStatus.map((room) => {
                const pct = Math.round((room.occupied / room.total) * 100);
                return (
                  <div key={room.type}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: room.color }}></span>
                        <span className="text-sm font-medium text-gray-700">{room.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-800">{room.occupied}</span>
                        <span className="text-xs text-gray-400">/{room.total}</span>
                        <span className="ml-2 text-xs font-semibold" style={{ color: room.color }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: room.color }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>{room.occupied} occupées</span>
                      <span>{room.total - room.occupied} libres</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-gray-500">Total occupé</span>
              <span className="font-bold text-gray-800">
                {roomStatus.reduce((s, r) => s + r.occupied, 0)}/
                {roomStatus.reduce((s, r) => s + r.total, 0)} chambres
              </span>
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <span>⚠️</span> Alertes Stock Médicaments
            </h3>
            <div className="space-y-3">
              {stockAlerts.map((med) => {
                const pct = Math.round((med.stock / med.min) * 100);
                const isCritical = med.level === "critical";
                return (
                  <div
                    key={med.name}
                    className="p-3 rounded-xl"
                    style={{
                      background: isCritical ? "#fff1f2" : "#fffbeb",
                      border: `1px solid ${isCritical ? "#fecdd3" : "#fde68a"}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="text-sm font-semibold text-gray-700 leading-tight">{med.name}</div>
                      <span
                        className="badge flex-shrink-0"
                        style={{
                          background: isCritical ? "#fee2e2" : "#fef9c3",
                          color: isCritical ? "#991b1b" : "#854d0e",
                        }}
                      >
                        {med.stock} restants
                      </span>
                    </div>
                    <div className="h-1.5 bg-white rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background: isCritical ? "#ef4444" : "#f59e0b",
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Seuil minimum: {med.min} unités</div>
                  </div>
                );
              })}
            </div>
            <Link href="/dashboard/medicaments" className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-800">
              Gérer le stock →
            </Link>
          </div>

          {/* Operations Volume */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm mb-4 flex items-center gap-2">
              <span>📊</span> Volume des Opérations
            </h3>
            <div className="space-y-3">
              {[
                { label: "Consultations",    value: 28,  max: 50, color: "#1a56db", icon: "🩺" },
                { label: "Examens Labo",     value: 15,  max: 30, color: "#7c3aed", icon: "🔬" },
                { label: "Ordonnances",      value: 22,  max: 40, color: "#0e9f6e", icon: "💊" },
                { label: "Hospitalisations", value: 8,   max: 20, color: "#d97706", icon: "🏨" },
                { label: "Factures émises",  value: 18,  max: 30, color: "#059669", icon: "🧾" },
                { label: "Bons de sortie",   value: 6,   max: 15, color: "#0891b2", icon: "📋" },
              ].map((op) => {
                const pct = Math.round((op.value / op.max) * 100);
                return (
                  <div key={op.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                        <span>{op.icon}</span> {op.label}
                      </span>
                      <span className="text-xs font-bold" style={{ color: op.color }}>
                        {op.value} <span className="text-gray-400 font-normal">/ {op.max}</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: op.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <span className="text-xs text-gray-400">Données du jour — </span>
              <span className="text-xs font-semibold text-blue-600">
                {new Date().toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
