import Link from "next/link";

const stats = [
  { icon: "👥", label: "Total Patients", value: "1,240", change: "+12 aujourd'hui", color: "#3b82f6", bg: "#eff6ff" },
  { icon: "🩺", label: "Consultations", value: "28", change: "Aujourd'hui", color: "#10b981", bg: "#f0fdf4" },
  { icon: "🏨", label: "Chambres Libres", value: "12/45", change: "Disponibles", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: "💊", label: "Médicaments", value: "320", change: "En stock", color: "#f59e0b", bg: "#fffbeb" },
  { icon: "🧾", label: "Factures du Jour", value: "45,000 FC", change: "+8 factures", color: "#ef4444", bg: "#fef2f2" },
  { icon: "🔬", label: "Examens Labo", value: "15", change: "En attente", color: "#06b6d4", bg: "#ecfeff" },
];

const recentPatients = [
  { id: "PAT-001", name: "Marie Kabila", age: 34, motif: "Fièvre", medecin: "Dr. Mutombo", status: "En consultation", statusColor: "badge-info" },
  { id: "PAT-002", name: "Jean Mwamba", age: 52, motif: "Hypertension", medecin: "Dr. Kasongo", status: "Hospitalisé", statusColor: "badge-warning" },
  { id: "PAT-003", name: "Amina Lokwa", age: 28, motif: "Grossesse", medecin: "Dr. Mutombo", status: "Sorti", statusColor: "badge-success" },
  { id: "PAT-004", name: "Pierre Ngoy", age: 45, motif: "Diabète", medecin: "Dr. Kasongo", status: "En attente", statusColor: "badge-gray" },
  { id: "PAT-005", name: "Sophie Tshala", age: 19, motif: "Paludisme", medecin: "Dr. Mutombo", status: "En consultation", statusColor: "badge-info" },
];

const recentActivities = [
  { time: "08:30", action: "Nouveau patient enregistré", detail: "Marie Kabila - PAT-001", icon: "👤" },
  { time: "09:15", action: "Consultation terminée", detail: "Dr. Mutombo - Jean Mwamba", icon: "🩺" },
  { time: "10:00", action: "Résultat labo disponible", detail: "Analyse sang - PAT-003", icon: "🔬" },
  { time: "10:45", action: "Médicament dispensé", detail: "Amoxicilline 500mg x30", icon: "💊" },
  { time: "11:20", action: "Facture générée", detail: "PAT-002 - 25,000 FC", icon: "🧾" },
  { time: "12:00", action: "Chambre libérée", detail: "Chambre 12 - Standard", icon: "🏨" },
];

export default function DashboardPage() {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
          <p className="text-gray-500 text-sm mt-1 capitalize">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Système actif
          </div>
          <Link href="/dashboard/patients" className="btn btn-primary">
            + Nouveau Patient
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: stat.bg }}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-gray-500">{stat.label}</div>
            <div className="text-xs mt-1" style={{ color: stat.color }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
        <h2 className="font-semibold text-gray-700 mb-4">Actions Rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { href: "/dashboard/patients", icon: "👤", label: "Nouveau Patient", color: "#3b82f6" },
            { href: "/dashboard/consultations", icon: "🩺", label: "Consultation", color: "#10b981" },
            { href: "/dashboard/laboratoire", icon: "🔬", label: "Examen Labo", color: "#8b5cf6" },
            { href: "/dashboard/medicaments", icon: "💊", label: "Médicament", color: "#f59e0b" },
            { href: "/dashboard/hospitalisation", icon: "🏨", label: "Hospitaliser", color: "#ef4444" },
            { href: "/dashboard/factures", icon: "🧾", label: "Facture", color: "#06b6d4" },
            { href: "/dashboard/bon-sortie", icon: "📋", label: "Bon Sortie", color: "#84cc16" },
            { href: "/dashboard/rapports", icon: "📈", label: "Rapport", color: "#f97316" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all hover:scale-105" style={{ background: "#f9fafb", border: "1px solid #e5e7eb" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: `${action.color}15` }}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Patients */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Patients Récents</h2>
            <Link href="/dashboard/patients" className="text-sm text-blue-600 hover:text-blue-800">Voir tout →</Link>
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
                {recentPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="font-mono text-xs text-blue-600">{patient.id}</td>
                    <td>
                      <div className="font-medium text-gray-800">{patient.name}</div>
                      <div className="text-xs text-gray-400">{patient.age} ans</div>
                    </td>
                    <td className="text-gray-600">{patient.motif}</td>
                    <td className="text-gray-600 text-xs">{patient.medecin}</td>
                    <td><span className={`badge ${patient.statusColor}`}>{patient.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700">Activités Récentes</h2>
            <span className="text-xs text-gray-400">Aujourd&apos;hui</span>
          </div>
          <div className="p-4 space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "#f3f4f6" }}>
                    {activity.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-700">{activity.action}</div>
                  <div className="text-xs text-gray-400 truncate">{activity.detail}</div>
                </div>
                <div className="text-xs text-gray-400 flex-shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Chambres Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">État des Chambres</h3>
          <div className="space-y-3">
            {[
              { type: "VIP", total: 10, occupied: 7, color: "#8b5cf6" },
              { type: "Standard", total: 25, occupied: 18, color: "#3b82f6" },
              { type: "Urgence", total: 10, occupied: 8, color: "#ef4444" },
            ].map((room) => (
              <div key={room.type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{room.type}</span>
                  <span className="font-medium">{room.occupied}/{room.total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(room.occupied/room.total)*100}%`, background: room.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Médicaments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Alertes Stock</h3>
          <div className="space-y-2">
            {[
              { name: "Paracétamol 500mg", stock: 15, min: 50, color: "#ef4444" },
              { name: "Amoxicilline 250mg", stock: 28, min: 50, color: "#f59e0b" },
              { name: "Quinine 300mg", stock: 8, min: 30, color: "#ef4444" },
              { name: "Métronidazole", stock: 35, min: 50, color: "#f59e0b" },
            ].map((med) => (
              <div key={med.name} className="flex items-center justify-between p-2 rounded-lg" style={{ background: "#fef9f0" }}>
                <div>
                  <div className="text-sm font-medium text-gray-700">{med.name}</div>
                  <div className="text-xs text-gray-400">Min: {med.min} unités</div>
                </div>
                <span className="badge" style={{ background: `${med.color}15`, color: med.color }}>
                  {med.stock} restants
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenus */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-4">Revenus du Mois</h3>
          <div className="space-y-3">
            {[
              { label: "Consultations", amount: "125,000 FC", percent: 35, color: "#3b82f6" },
              { label: "Laboratoire", amount: "85,000 FC", percent: 24, color: "#8b5cf6" },
              { label: "Pharmacie", amount: "95,000 FC", percent: 27, color: "#10b981" },
              { label: "Hospitalisation", amount: "50,000 FC", percent: 14, color: "#f59e0b" },
            ].map((rev) => (
              <div key={rev.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{rev.label}</span>
                  <span className="font-medium text-gray-800">{rev.amount}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${rev.percent}%`, background: rev.color }}></div>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="font-bold text-green-600">355,000 FC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
