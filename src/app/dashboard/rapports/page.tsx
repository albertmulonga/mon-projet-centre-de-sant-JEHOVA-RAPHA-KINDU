"use client";
import { useState } from "react";

const monthlyData = [
  { mois: "Oct", patients: 95, consultations: 180, revenus: 285000 },
  { mois: "Nov", patients: 110, consultations: 210, revenus: 320000 },
  { mois: "Déc", patients: 88, consultations: 165, revenus: 260000 },
  { mois: "Jan", patients: 125, consultations: 240, revenus: 380000 },
  { mois: "Fév", patients: 140, consultations: 265, revenus: 420000 },
  { mois: "Mar", patients: 132, consultations: 250, revenus: 395000 },
];

const maxRevenu = Math.max(...monthlyData.map(d => d.revenus));
const maxPatients = Math.max(...monthlyData.map(d => d.patients));

const topDiagnostics = [
  { diagnostic: "Paludisme", cas: 145, pourcentage: 32 },
  { diagnostic: "Hypertension", cas: 89, pourcentage: 20 },
  { diagnostic: "Diabète", cas: 67, pourcentage: 15 },
  { diagnostic: "Infections respiratoires", cas: 54, pourcentage: 12 },
  { diagnostic: "Grossesse (suivi)", cas: 48, pourcentage: 11 },
  { diagnostic: "Autres", cas: 45, pourcentage: 10 },
];

export default function RapportsPage() {
  const [periode, setPeriode] = useState("mois");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rapports & Statistiques</h1>
          <p className="text-gray-500 text-sm mt-1">Analyse des activités du centre médical</p>
        </div>
        <div className="flex gap-2">
          <select className="form-input w-auto" value={periode} onChange={(e) => setPeriode(e.target.value)}>
            <option value="semaine">Cette semaine</option>
            <option value="mois">Ce mois</option>
            <option value="trimestre">Ce trimestre</option>
            <option value="annee">Cette année</option>
          </select>
          <button className="btn btn-outline">📥 Exporter PDF</button>
          <button className="btn btn-outline">📊 Exporter Excel</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Nouveaux Patients", value: "132", change: "+6%", icon: "👥", color: "#3b82f6", bg: "#eff6ff" },
          { label: "Consultations", value: "250", change: "+12%", icon: "🩺", color: "#10b981", bg: "#f0fdf4" },
          { label: "Revenus", value: "395,000 FC", change: "+8%", icon: "💰", color: "#8b5cf6", bg: "#f5f3ff" },
          { label: "Taux Satisfaction", value: "94%", change: "+2%", icon: "⭐", color: "#f59e0b", bg: "#fffbeb" },
        ].map((kpi) => (
          <div key={kpi.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: kpi.bg }}>
                {kpi.icon}
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">{kpi.change}</span>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{kpi.value}</div>
            <div className="text-sm text-gray-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Graphique Revenus */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Évolution des Revenus (6 mois)</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.mois} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-500 font-medium">{Math.round(d.revenus/1000)}k</div>
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    height: `${(d.revenus / maxRevenu) * 120}px`,
                    background: "linear-gradient(180deg, #3b82f6, #1d4ed8)"
                  }}
                ></div>
                <div className="text-xs text-gray-500">{d.mois}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique Patients */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Nouveaux Patients (6 mois)</h3>
          <div className="flex items-end gap-3 h-40">
            {monthlyData.map((d) => (
              <div key={d.mois} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-xs text-gray-500 font-medium">{d.patients}</div>
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{
                    height: `${(d.patients / maxPatients) * 120}px`,
                    background: "linear-gradient(180deg, #10b981, #059669)"
                  }}
                ></div>
                <div className="text-xs text-gray-500">{d.mois}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Top Diagnostics */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Top Diagnostics du Mois</h3>
          <div className="space-y-3">
            {topDiagnostics.map((d, i) => (
              <div key={d.diagnostic} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: i < 3 ? "#eff6ff" : "#f9fafb", color: i < 3 ? "#1d4ed8" : "#6b7280" }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{d.diagnostic}</span>
                    <span className="text-sm text-gray-500">{d.cas} cas ({d.pourcentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${d.pourcentage}%`,
                      background: i === 0 ? "#ef4444" : i === 1 ? "#f59e0b" : i === 2 ? "#3b82f6" : "#10b981"
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition par service */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Revenus par Service</h3>
          <div className="space-y-3">
            {[
              { service: "Consultations", montant: 138250, color: "#3b82f6", percent: 35 },
              { service: "Laboratoire", montant: 98750, color: "#8b5cf6", percent: 25 },
              { service: "Pharmacie", montant: 118500, color: "#10b981", percent: 30 },
              { service: "Hospitalisation", montant: 39500, color: "#f59e0b", percent: 10 },
            ].map((s) => (
              <div key={s.service}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{s.service}</span>
                  <span className="font-medium">{s.montant.toLocaleString()} FC</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.percent}%`, background: s.color }}></div>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between font-bold">
                <span className="text-gray-700">Total</span>
                <span className="text-green-600">395,000 FC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rapports disponibles */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Rapports Disponibles</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: "Rapport Mensuel", desc: "Activités du mois en cours", icon: "📅", color: "#3b82f6" },
            { title: "Rapport Financier", desc: "Revenus et dépenses", icon: "💰", color: "#10b981" },
            { title: "Rapport Patients", desc: "Statistiques patients", icon: "👥", color: "#8b5cf6" },
            { title: "Rapport Médicaments", desc: "Consommation et stock", icon: "💊", color: "#f59e0b" },
            { title: "Rapport Labo", desc: "Examens réalisés", icon: "🔬", color: "#ef4444" },
            { title: "Rapport Hospitalisation", desc: "Taux d'occupation", icon: "🏨", color: "#06b6d4" },
            { title: "Rapport Épidémio", desc: "Maladies fréquentes", icon: "📊", color: "#84cc16" },
            { title: "Rapport Annuel", desc: "Bilan de l'année", icon: "📈", color: "#f97316" },
          ].map((rapport) => (
            <button key={rapport.title} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: `${rapport.color}15` }}>
                {rapport.icon}
              </div>
              <div>
                <div className="font-medium text-gray-700 text-sm">{rapport.title}</div>
                <div className="text-xs text-gray-400">{rapport.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
