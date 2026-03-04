"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

type Language = "fr" | "en" | "sw" | "lg" | "ki" | "zh" | "ts";

interface MenuItem {
  href: string;
  icon: string;
  label: string;
  labelEn: string;
  exact?: boolean;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

// Menu based on database roles: admin, medecin, infirmier, caissier, laborantin, pharmacien
const menuItems: MenuSection[] = [
  {
    section: "PRINCIPAL",
    items: [
      { href: "/dashboard", icon: "📊", label: "Tableau de Bord", labelEn: "Dashboard", exact: true },
    ]
  },
  {
    section: "RÉCEPTION",
    items: [
      { href: "/dashboard/patients", icon: "📝", label: "Patients", labelEn: "Patients" },
    ]
  },
  {
    section: "GESTION MÉDICALE",
    items: [
      { href: "/dashboard/consultations", icon: "🩺", label: "Consultations", labelEn: "Consultations" },
      { href: "/dashboard/laboratoire", icon: "🔬", label: "Laboratoire", labelEn: "Laboratory" },
      { href: "/dashboard/medicaments", icon: "💊", label: "Médicaments", labelEn: "Medications" },
      { href: "/dashboard/hospitalisation", icon: "🏨", label: "Hospitalisation", labelEn: "Hospitalization" },
    ]
  },
  {
    section: "ADMINISTRATION",
    items: [
      { href: "/dashboard/factures", icon: "🧾", label: "Factures", labelEn: "Invoices" },
      { href: "/dashboard/bon-sortie", icon: "📋", label: "Bon de Sortie", labelEn: "Discharge Note" },
      { href: "/dashboard/rapports", icon: "📈", label: "Rapports", labelEn: "Reports" },
    ]
  },
  {
    section: "SYSTÈME",
    items: [
      { href: "/dashboard/utilisateurs", icon: "👤", label: "Utilisateurs", labelEn: "Users" },
      { href: "/dashboard/parametres", icon: "⚙️", label: "Paramètres", labelEn: "Settings" },
    ]
  }
];

// Permissions: which sections AND which specific items each role can see
const rolePermissions: Record<string, { sections: string[], items: string[] }> = {
  admin: { 
    sections: ["PRINCIPAL", "RÉCEPTION", "GESTION MÉDICALE", "ADMINISTRATION", "SYSTÈME"],
    items: ["dashboard", "patients", "consultations", "laboratoire", "medicaments", "hospitalisation", "factures", "bon-sortie", "rapports", "utilisateurs", "parametres"]
  },
  medecin: { 
    sections: ["PRINCIPAL", "GESTION MÉDICALE"],
    items: ["dashboard", "consultations", "laboratoire", "medicaments", "hospitalisation"]
  },
  infirmier: { 
    sections: ["PRINCIPAL", "RÉCEPTION", "GESTION MÉDICALE"],
    items: ["dashboard", "patients", "hospitalisation"]
  },
  caissier: { 
    sections: ["PRINCIPAL", "ADMINISTRATION"],
    items: ["dashboard", "factures", "rapports"]
  },
  laborantin: { 
    sections: ["PRINCIPAL", "GESTION MÉDICALE"],
    items: ["dashboard", "laboratoire"]
  },
  pharmacien: { 
    sections: ["PRINCIPAL", "GESTION MÉDICALE"],
    items: ["dashboard", "medicaments"]
  },
};

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

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Swahili", flag: "🇹🇿" },
  { code: "lg", name: "Lingala", flag: "🇨🇩" },
  { code: "ki", name: "Kirundi", flag: "🇧🇮" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ts", name: "Tshiluba", flag: "🇨🇩" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { darkMode, language, setLanguage } = useApp();
  const [user, setUser] = useState<{ nom: string; role: string; email: string; photo?: string } | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("current_user");
      if (stored) {
        try { 
          const userData = JSON.parse(stored);
          // Get photo from localStorage if exists
          const storedUsers = localStorage.getItem("hospital_users");
          if (storedUsers) {
            const users = JSON.parse(storedUsers);
            const foundUser = users.find((u: any) => u.email === userData.email);
            if (foundUser?.photo) {
              userData.photo = foundUser.photo;
            }
          }
          setUser(userData);
        } catch { 
          setUser(null); 
        }
      }
    }
  }, [pathname]); // Re-check sessionStorage when pathname changes

  // Logout functions - now handled in Header component
  const handleConfirmYes = () => {
    sessionStorage.removeItem("current_user");
    router.push("/");
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const getLabel = (item: MenuItem) => {
    return language === "en" ? item.labelEn : item.label;
  };

  return (
    <>
      {/* Overlay mobile */}
      <div className={`sidebar-overlay ${collapsed ? "" : ""}`} />

      <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${darkMode ? "dark" : ""}`}>
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

        {/* User Info with Photo */}
        {user && (
          <div className={`sidebar-user ${collapsed ? "sidebar-user-collapsed" : ""}`}>
            <div className="sidebar-user-avatar">
              {user.photo ? (
                <img src={user.photo} alt={user.nom} className="w-full h-full rounded-full object-cover" />
              ) : (
                roleIcons[user.role] || "👤"
              )}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-white text-sm font-semibold truncate">{user.nom}</div>
                <div className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {roleLabels[user.role] || user.role}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems
            .filter((section) => {
              if (!user) return false;
              const perms = rolePermissions[user.role];
              if (!perms) return false;
              return perms.sections.includes(section.section);
            })
            .map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <div className="sidebar-section-title">{section.section}</div>
              )}
              {collapsed && <div className="sidebar-section-divider" />}
              {section.items
                .filter((item) => {
                  if (!user) return false;
                  const perms = rolePermissions[user.role];
                  if (!perms) return false;
                  // Extract key from href like "/dashboard/factures" -> "factures"
                  const itemKey = item.href.split("/").pop() || "";
                  return perms.items.includes(itemKey);
                })
                .map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={`sidebar-nav-item ${active ? "active" : ""} ${collapsed ? "collapsed" : ""}`}
                    title={collapsed ? getLabel(item) : undefined}
                  >
                    <span className="sidebar-nav-icon">{item.icon}</span>
                    {!collapsed && <span className="sidebar-nav-label">{getLabel(item)}</span>}
                    {!collapsed && active && (
                      <span className="sidebar-nav-dot" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
