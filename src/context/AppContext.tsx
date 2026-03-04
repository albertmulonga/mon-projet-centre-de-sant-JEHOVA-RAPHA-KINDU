"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fr" | "en" | "sw" | "lg" | "ki" | "zh" | "ts";

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    dashboard: "Tableau de Bord",
    patients: "Patients",
    consultations: "Consultations",
    laboratoire: "Laboratoire",
    medicaments: "Médicaments",
    hospitalisation: "Hospitalisation",
    factures: "Factures",
    bonSortie: "Bon de Sortie",
    rapports: "Rapports",
    utilisateurs: "Utilisateurs",
    parametres: "Paramètres",
    logout: "Déconnexion",
    profile: "Profil",
    settings: "Paramètres",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    language: "Langue",
  },
  en: {
    dashboard: "Dashboard",
    patients: "Patients",
    consultations: "Consultations",
    laboratoire: "Laboratory",
    medicaments: "Medications",
    hospitalisation: "Hospitalization",
    factures: "Invoices",
    bonSortie: "Discharge Note",
    rapports: "Reports",
    utilisateurs: "Users",
    parametres: "Settings",
    logout: "Logout",
    profile: "Profile",
    settings: "Settings",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
  },
  sw: {
    dashboard: "Dashibodi",
    patients: "Wagonjwa",
    consultations: "Mauguzi",
    laboratoire: "Maabara",
    medicaments: "Dawa",
    hospitalisation: "Wagonjwa Waliolazwa",
    factures: "Bill",
    bonSortie: "Hati ya Kutoka",
    rapports: "Ripoti",
    utilisateurs: "Watumiaji",
    parametres: "Mipangilio",
    logout: "Ondoka",
    profile: "Wasifu",
    settings: "Mipangilio",
    darkMode: "Halisi ya Giza",
    lightMode: "Halisi ya Mwanga",
    language: "Lugha",
  },
  lg: {
    dashboard: "Bólo",
    patients: "Bázalá",
    consultations: "Bokondisama",
    laboratoire: "Laboratoire",
    medicaments: "Mokasi",
    hospitalisation: "Botalela",
    factures: "Fature",
    bonSortie: "Bon ya Kopé",
    rapports: "Rapó",
    utilisateurs: "Basálá",
    parametres: "Paramètres",
    logout: "Kokí",
    profile: "Profile",
    settings: "Paramètres",
    darkMode: "Mode ya mokú",
    lightMode: "Mode ya makámá",
    language: "Lokótá",
  },
  ki: {
    dashboard: "Ikigererzo",
    patients: "Abantu",
    consultations: "Imiconsultation",
    laboratoire: "Laboratoire",
    medicaments: "Imiti",
    hospitalisation: "Hospitalisation",
    factures: "Factures",
    bonSortie: "Bon y'isuka",
    rapports: "Rapports",
    utilisateurs: "Abakoresha",
    parametres: "Paramètres",
    logout: "Gusohoka",
    profile: "Profili",
    settings: "Paramètres",
    darkMode: "Umucyo mw'ikirenge",
    lightMode: "Umucyo",
    language: "Ururimi",
  },
  zh: {
    dashboard: "仪表板",
    patients: "病人",
    consultations: "会诊",
    laboratoire: "实验室",
    medicaments: "药物",
    hospitalisation: "住院",
    factures: "发票",
    bonSortie: "出院证明",
    rapports: "报告",
    utilisateurs: "用户",
    parametres: "设置",
    logout: "退出",
    profile: "个人资料",
    settings: "设置",
    darkMode: "深色模式",
    lightMode: "浅色模式",
    language: "语言",
  },
  ts: {
    dashboard: "Bureau",
    patients: "Babalwa",
    consultations: "Consultations",
    laboratoire: "Laboratoire",
    medicaments: "Mitshena",
    hospitalisation: "Hospitalisation",
    factures: "Bills",
    bonSortie: "Bon ya kuisa",
    rapports: "Rapports",
    utilisateurs: "Bashiki",
    parametres: "Paramètres",
    logout: "Ku isa",
    profile: "Profil",
    settings: "Paramètres",
    darkMode: "Mu munda wa nima",
    lightMode: "Mu munda wa munya",
    language: "Lusangu",
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedDark = localStorage.getItem("darkMode");
    const storedLang = localStorage.getItem("language") as Language;
    if (storedDark === "true") setDarkMode(true);
    if (storedLang) setLanguage(storedLang);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("darkMode", String(darkMode));
      if (darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        language,
        setLanguage: handleSetLanguage,
        translations: t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
