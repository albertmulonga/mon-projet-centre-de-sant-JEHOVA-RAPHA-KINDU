"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface MenuItem {
  href: string;
  icon: string;
  label: string;
  exact?: boolean;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    section: "PRINCIPAL",
    items: [
      { href: "/dashboard", icon: "📊", label: "Tableau de Bord", exact: true },
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

const roleIcons: Record<string, string> = {
  admin: "👑",
  medecin: "🩺",
  infirmier: "💉",
  caissier: "💰",
  laborantin: "🔬",
  pharmacien: "💊",
};

const roleLabels: Record<string, string> = {
  admin: "Administrateur",
  medecin: "Médecin",
  infirmier: "Infirmier(e)",
  caissier: "Caissier(e)",
  laborantin: "Laborantin(e)",
  pharmacien: "Pharmacien(ne)",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user] = useState<{ nom: string; role: string; email: string } | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("hospital_user");
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  });
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("hospital_user");
    router.push("/login");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay mobile */}
      <div className={`sidebar-overlay ${collapsed ? "" : ""}`} />

      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
        {/* Logo + Toggle */}
        <div className="sidebar-logo">
          <div className="flex items-center gap-3 min-w-0">
            <div className="sidebar-logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                <rect width="40" height="40" rx="10" fill="rgba(255,255,255,0.15)"/>
                <path d="M20 8v24M8 20h24" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-white font-bold text-sm leading-tight truncate">JÉHOVA RAPHA</div>
                <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>Centre Médical · Kindu</div>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-toggle-btn"
            title={collapsed ? "Agrandir" : "Réduire"}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              {collapsed
                ? <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                : <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              }
            </svg>
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className={`sidebar-user ${collapsed ? "sidebar-user-collapsed" : ""}`}>
            <div className="sidebar-user-avatar">
              {roleIcons[user.role] || "👤"}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-semibold truncate">{user.nom}</div>
                <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {roleLabels[user.role] || user.role}
                </div>
              </div>
            )}
            {!collapsed && (
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="En ligne"></div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <div className="sidebar-section-title">{section.section}</div>
              )}
              {collapsed && <div className="sidebar-section-divider" />}
              {section.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${active ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="sidebar-nav-icon">{item.icon}</span>
                    {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
                    {!collapsed && active && (
                      <span className="sidebar-nav-dot" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className={`sidebar-logout ${collapsed ? "collapsed" : ""}`}
            title="Déconnexion"
          >
            <span className="text-base">🚪</span>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
