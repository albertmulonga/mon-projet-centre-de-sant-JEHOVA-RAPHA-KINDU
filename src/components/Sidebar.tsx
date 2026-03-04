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

// Permissions based on database roles
const rolePermissions: Record<string, string[]> = {
  admin: ["PRINCIPAL", "ADMINISTRATION", "SYSTÈME"],
  medecin: ["PRINCIPAL", "GESTION MÉDICALE"],
  infirmier: ["PRINCIPAL", "GESTION MÉDICALE"],
  caissier: ["PRINCIPAL", "ADMINISTRATION"],
  laborantin: ["PRINCIPAL", "GESTION MÉDICALE"],
  pharmacien: ["PRINCIPAL", "GESTION MÉDICALE"],
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
  const { darkMode, toggleDarkMode, language, setLanguage } = useApp();
  const [user, setUser] = useState<{ nom: string; role: string; email: string; photo?: string } | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

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
  }, []);

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmYes = () => {
    setShowLogoutConfirm(false);
    sessionStorage.removeItem("current_user");
    router.push("/");
  };

  const handleConfirmNo = () => {
    setShowLogoutConfirm(false);
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
            {!collapsed && (
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="En ligne"></div>
            )}
          </div>
        )}

        {/* Settings Row: Dark Mode + Language */}
        <div className={`sidebar-settings ${collapsed ? "collapsed" : ""}`}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="sidebar-settings-btn"
            title={darkMode ? "Mode Clair" : "Mode Sombre"}
          >
            <span className="text-base">{darkMode ? "☀️" : "🌙"}</span>
            {!collapsed && <span>{darkMode ? "Clair" : "Sombre"}</span>}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="sidebar-settings-btn"
              title="Langue"
            >
              <span className="text-base">{languages.find(l => l.code === language)?.flag || "🌐"}</span>
              {!collapsed && <span>{languages.find(l => l.code === language)?.name || "Langue"}</span>}
            </button>
            {showLangMenu && !collapsed && (
              <div className="sidebar-lang-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`sidebar-lang-item ${language === lang.code ? "active" : ""}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems
            .filter((section) => {
              if (!user) return false;
              const allowedSections = rolePermissions[user.role] || [];
              return allowedSections.includes(section.section);
            })
            .map((section) => (
            <div key={section.section}>
              {!collapsed && (
                <div className="sidebar-section-title">{section.section}</div>
              )}
              {collapsed && <div className="sidebar-section-divider" />}
              {section.items.map((item) => {
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

        {/* Logout */}
        <div className="sidebar-footer">
          <button
            onClick={confirmLogout}
            className={`sidebar-logout ${collapsed ? "collapsed" : ""}`}
            title="Déconnexion"
          >
            <span className="text-base">🚪</span>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: "#fef2f2" }}>
                <span className="text-3xl">🚪</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Voulez-vous quitter l'application ?</h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-6">Vous serez déconnecté et redirigé vers la page d'accueil.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmNo}
                  className="flex-1 btn btn-outline py-3"
                >
                  ❌ Non
                </button>
                <button
                  onClick={handleConfirmYes}
                  className="flex-1 btn btn-danger py-3"
                >
                  ✅ Oui, quitter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
