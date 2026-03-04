"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    section: "PRINCIPAL",
    items: [
      { href: "/dashboard", icon: "📊", label: "Tableau de Bord" },
    ]
  },
  {
    section: "GESTION MÉDICALE",
    items: [
      { href: "/dashboard/patients", icon: "👥", label: "Patients" },
      { href: "/dashboard/consultations", icon: "🩺", label: "Consultations" },
      { href: "/dashboard/laboratoire", icon: "🔬", label: "Laboratoire" },
      { href: "/dashboard/medicaments", icon: "💊", label: "Médicaments" },
      { href: "/dashboard/hospitalisation", icon: "🏨", label: "Hospitalisation" },
    ]
  },
  {
    section: "ADMINISTRATION",
    items: [
      { href: "/dashboard/factures", icon: "🧾", label: "Factures" },
      { href: "/dashboard/bon-sortie", icon: "📋", label: "Bon de Sortie" },
      { href: "/dashboard/rapports", icon: "📈", label: "Rapports" },
    ]
  },
  {
    section: "SYSTÈME",
    items: [
      { href: "/dashboard/utilisateurs", icon: "👤", label: "Utilisateurs" },
      { href: "/dashboard/parametres", icon: "⚙️", label: "Paramètres" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.15)" }}>
            🏥
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">JÉHOVA RAPHA</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Centre Médical · Kindu</div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 mx-3 my-3 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "rgba(26,86,219,0.5)" }}>
            👑
          </div>
          <div>
            <div className="text-white text-sm font-medium">Dr. Admin</div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Administrateur</div>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="pb-6">
        {menuItems.map((section) => (
          <div key={section.section}>
            <div className="sidebar-section-title">{section.section}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-nav-item ${pathname === item.href ? "active" : ""}`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all" style={{ background: "rgba(224,36,36,0.15)", color: "#fca5a5" }}>
          <span>🚪</span>
          <span>Déconnexion</span>
        </Link>
      </div>
    </aside>
  );
}
