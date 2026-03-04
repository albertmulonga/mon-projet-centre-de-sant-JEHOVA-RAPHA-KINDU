"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

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

export default function Header() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useApp();
  const [user, setUser] = useState<{ nom: string; role: string; email: string; photo?: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("current_user");
      if (stored) {
        try { 
          const userData = JSON.parse(stored);
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

  return (
    <>
      <header className={`h-16 flex items-center justify-between px-6 border-b ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        {/* Left: Page title placeholder (can be enhanced later) */}
        <div className="flex items-center gap-4">
          {/* You can add breadcrumbs or page title here */}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={darkMode ? "Mode Clair" : "Mode Sombre"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  darkMode ? 'bg-gray-700' : 'bg-blue-100'
                }`}>
                  {user.photo ? (
                    <img src={user.photo} alt={user.nom} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    roleIcons[user.role] || "👤"
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user.nom}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {roleLabels[user.role] || user.role}
                  </div>
                </div>
                <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-lg py-1 z-50 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {user.nom}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {user.email}
                    </div>
                  </div>
                  <button
                    onClick={confirmLogout}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                      darkMode 
                        ? 'text-red-400 hover:bg-gray-700' 
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <span>🚪</span>
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

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
