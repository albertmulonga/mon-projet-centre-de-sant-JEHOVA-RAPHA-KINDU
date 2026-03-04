import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden" style={{ background: "#0a1628" }}>
      {/* ===== HERO SECTION ===== */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0f2044 45%, #0d3b2e 100%)",
        }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large blobs */}
          <div
            className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #1a56db, transparent 70%)" }}
          />
          <div
            className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #0e9f6e, transparent 70%)" }}
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          {/* Cross pattern (medical) */}
          <div className="absolute top-20 right-20 opacity-10">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="30" y="5" width="20" height="70" rx="4" fill="#1a56db" />
              <rect x="5" y="30" width="70" height="20" rx="4" fill="#1a56db" />
            </svg>
          </div>
          <div className="absolute bottom-40 left-16 opacity-8">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="22" y="4" width="16" height="52" rx="3" fill="#0e9f6e" />
              <rect x="4" y="22" width="52" height="16" rx="3" fill="#0e9f6e" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <header className="relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
              >
                🏥
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">CENTRE MÉDICAL</h1>
                <p className="text-blue-300 text-sm font-medium">JÉHOVA RAPHA DE KINDU</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#services" className="text-blue-200 hover:text-white text-sm transition-colors font-medium">
                Services
              </a>
              <a href="#about" className="text-blue-200 hover:text-white text-sm transition-colors font-medium">
                À propos
              </a>
              <a href="#contact" className="text-blue-200 hover:text-white text-sm transition-colors font-medium">
                Contact
              </a>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:scale-105 text-white shadow-lg"
                style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
              >
                Connexion →
              </Link>
            </nav>
            {/* Mobile menu button */}
            <Link
              href="/login"
              className="md:hidden px-4 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
            >
              Connexion
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left text */}
              <div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                  style={{
                    background: "rgba(14,159,110,0.15)",
                    color: "#6ee7b7",
                    border: "1px solid rgba(14,159,110,0.3)",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Système de Gestion Hospitalière Actif
                </div>
                <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  Bienvenue au<br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #60a5fa, #34d399)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Centre Médical
                  </span>
                  <br />
                  <span className="text-4xl lg:text-5xl">Jéhova Rapha</span>
                </h2>
                <p className="text-blue-200 text-lg mb-8 leading-relaxed max-w-lg">
                  Un système complet de gestion hospitalière pour assurer des soins de qualité à nos patients.
                  Gérez patients, consultations, laboratoire, pharmacie et facturation en un seul endroit.
                </p>
                <div className="flex flex-wrap gap-4 mb-10">
                  <Link
                    href="/login"
                    className="px-8 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-105 shadow-xl flex items-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #1a56db, #0e9f6e)",
                      boxShadow: "0 8px 25px rgba(26,86,219,0.4)",
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Accéder au Système
                  </Link>
                  <a
                    href="#services"
                    className="px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 flex items-center gap-2"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    Nos Services
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: "🔒", text: "Sécurisé SSL" },
                    { icon: "⚡", text: "Temps réel" },
                    { icon: "📱", text: "Multi-appareils" },
                  ].map((b) => (
                    <div
                      key={b.text}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
                    >
                      <span>{b.icon}</span>
                      <span>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Hospital illustration */}
              <div className="hidden lg:block">
                <div className="relative">
                  {/* Main illustration card */}
                  <div
                    className="rounded-3xl p-8 relative overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {/* Hospital building SVG */}
                    <svg viewBox="0 0 400 300" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Sky background */}
                      <rect width="400" height="300" fill="url(#skyGrad)" rx="12" />
                      <defs>
                        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0f2044" />
                          <stop offset="100%" stopColor="#1a3a6b" />
                        </linearGradient>
                        <linearGradient id="buildingGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1e3a5f" />
                          <stop offset="100%" stopColor="#162d4a" />
                        </linearGradient>
                      </defs>

                      {/* Stars */}
                      {[30, 80, 150, 220, 300, 360, 50, 180, 340].map((x, i) => (
                        <circle key={i} cx={x} cy={10 + (i % 3) * 15} r="1.5" fill="white" opacity="0.6" />
                      ))}

                      {/* Ground */}
                      <rect x="0" y="260" width="400" height="40" fill="#0d2a1a" />
                      <rect x="0" y="258" width="400" height="4" fill="#0e9f6e" opacity="0.4" />

                      {/* Main hospital building */}
                      <rect x="100" y="80" width="200" height="180" fill="url(#buildingGrad)" rx="4" />

                      {/* Building facade details */}
                      <rect x="100" y="80" width="200" height="8" fill="#1a56db" opacity="0.6" />

                      {/* Windows - row 1 */}
                      {[120, 160, 200, 240, 280].map((x) => (
                        <rect key={x} x={x} y="100" width="20" height="25" rx="2" fill="#1a56db" opacity="0.7" />
                      ))}
                      {/* Windows glow */}
                      {[120, 160, 200, 240, 280].map((x) => (
                        <rect key={x + "g"} x={x + 2} y="102" width="16" height="21" rx="1" fill="#60a5fa" opacity="0.3" />
                      ))}

                      {/* Windows - row 2 */}
                      {[120, 160, 200, 240, 280].map((x) => (
                        <rect key={x + "r2"} x={x} y="140" width="20" height="25" rx="2" fill="#1a56db" opacity="0.6" />
                      ))}
                      {[120, 160, 240, 280].map((x) => (
                        <rect key={x + "r2g"} x={x + 2} y="142" width="16" height="21" rx="1" fill="#60a5fa" opacity="0.25" />
                      ))}
                      {/* Lit window */}
                      <rect x="202" y="142" width="16" height="21" rx="1" fill="#fbbf24" opacity="0.5" />

                      {/* Windows - row 3 */}
                      {[120, 160, 240, 280].map((x) => (
                        <rect key={x + "r3"} x={x} y="180" width="20" height="25" rx="2" fill="#1a56db" opacity="0.5" />
                      ))}

                      {/* Main entrance */}
                      <rect x="175" y="210" width="50" height="50" rx="3" fill="#0a1628" />
                      <rect x="175" y="210" width="50" height="4" fill="#1a56db" opacity="0.8" />
                      {/* Door */}
                      <rect x="185" y="225" width="14" height="35" rx="2" fill="#1a3a6b" />
                      <rect x="201" y="225" width="14" height="35" rx="2" fill="#1a3a6b" />
                      <circle cx="199" cy="243" r="2" fill="#fbbf24" opacity="0.8" />
                      <circle cx="201" cy="243" r="2" fill="#fbbf24" opacity="0.8" />

                      {/* Entrance canopy */}
                      <rect x="165" y="205" width="70" height="8" rx="2" fill="#1a56db" opacity="0.8" />
                      <rect x="170" y="213" width="4" height="20" fill="#1a3a6b" />
                      <rect x="226" y="213" width="4" height="20" fill="#1a3a6b" />

                      {/* Medical cross on building */}
                      <rect x="188" y="88" width="8" height="28" rx="2" fill="#ef4444" opacity="0.9" />
                      <rect x="180" y="96" width="24" height="8" rx="2" fill="#ef4444" opacity="0.9" />

                      {/* Roof details */}
                      <rect x="95" y="76" width="210" height="8" rx="2" fill="#1a56db" opacity="0.5" />

                      {/* Side wings */}
                      <rect x="40" y="130" width="65" height="130" fill="#162d4a" rx="3" />
                      <rect x="295" y="130" width="65" height="130" fill="#162d4a" rx="3" />

                      {/* Wing windows */}
                      {[50, 75].map((x) => (
                        <>
                          <rect key={x + "w1"} x={x} y="145" width="15" height="20" rx="2" fill="#1a56db" opacity="0.5" />
                          <rect key={x + "w2"} x={x} y="175" width="15" height="20" rx="2" fill="#1a56db" opacity="0.5" />
                          <rect key={x + "w3"} x={x} y="205" width="15" height="20" rx="2" fill="#1a56db" opacity="0.4" />
                        </>
                      ))}
                      {[305, 330].map((x) => (
                        <>
                          <rect key={x + "w1"} x={x} y="145" width="15" height="20" rx="2" fill="#1a56db" opacity="0.5" />
                          <rect key={x + "w2"} x={x} y="175" width="15" height="20" rx="2" fill="#1a56db" opacity="0.5" />
                          <rect key={x + "w3"} x={x} y="205" width="15" height="20" rx="2" fill="#1a56db" opacity="0.4" />
                        </>
                      ))}

                      {/* Ambulance */}
                      <rect x="30" y="240" width="60" height="25" rx="4" fill="white" opacity="0.9" />
                      <rect x="30" y="240" width="60" height="10" rx="4" fill="#ef4444" opacity="0.8" />
                      <rect x="35" y="243" width="8" height="4" rx="1" fill="white" opacity="0.9" />
                      <circle cx="45" cy="265" r="5" fill="#1a2e4a" />
                      <circle cx="75" cy="265" r="5" fill="#1a2e4a" />
                      <circle cx="45" cy="265" r="2.5" fill="#4b5563" />
                      <circle cx="75" cy="265" r="2.5" fill="#4b5563" />
                      {/* Ambulance cross */}
                      <rect x="52" y="244" width="4" height="12" rx="1" fill="#ef4444" />
                      <rect x="48" y="248" width="12" height="4" rx="1" fill="#ef4444" />

                      {/* Trees */}
                      <rect x="340" y="235" width="8" height="25" rx="2" fill="#0d2a1a" />
                      <ellipse cx="344" cy="228" rx="18" ry="22" fill="#0e9f6e" opacity="0.7" />
                      <rect x="355" y="245" width="6" height="15" rx="2" fill="#0d2a1a" />
                      <ellipse cx="358" cy="238" rx="14" ry="18" fill="#0e9f6e" opacity="0.6" />

                      {/* Flag */}
                      <rect x="196" y="60" width="2" height="20" fill="#9ca3af" />
                      <rect x="198" y="60" width="16" height="10" rx="1" fill="#1a56db" opacity="0.9" />

                      {/* Helipad on roof */}
                      <circle cx="250" cy="82" r="10" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6" />
                      <text x="246" y="86" fill="#fbbf24" fontSize="10" opacity="0.7" fontWeight="bold">H</text>

                      {/* Path to entrance */}
                      <rect x="185" y="258" width="30" height="4" fill="#1a3a6b" opacity="0.6" />
                    </svg>

                    {/* Floating stat cards */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2"
                        style={{ background: "rgba(26,86,219,0.8)", backdropFilter: "blur(10px)" }}
                      >
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Système en ligne
                      </div>
                    </div>
                  </div>

                  {/* Stats below illustration */}
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    {[
                      { icon: "👥", label: "Patients", value: "1,240+", color: "#3b82f6" },
                      { icon: "🩺", label: "Consultations", value: "8,500+", color: "#10b981" },
                      { icon: "🏨", label: "Chambres", value: "45", color: "#8b5cf6" },
                      { icon: "💊", label: "Médicaments", value: "320+", color: "#f59e0b" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl p-3 text-center"
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-lg font-bold text-white">{stat.value}</div>
                        <div className="text-xs" style={{ color: stat.color }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES SECTION ===== */}
      <section id="services" className="py-24 relative" style={{ background: "#0d1f3c" }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-30"
            style={{ background: "linear-gradient(90deg, transparent, #1a56db, transparent)" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ background: "rgba(26,86,219,0.15)", color: "#60a5fa", border: "1px solid rgba(26,86,219,0.3)" }}
            >
              🏥 Nos Modules
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">Modules de Gestion Intégrés</h3>
            <p className="text-blue-300 max-w-2xl mx-auto text-lg">
              Un système complet couvrant tous les aspects de la gestion hospitalière moderne
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: "👤", title: "Patients", desc: "Enregistrement et suivi complet des dossiers patients", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
              { icon: "🩺", title: "Consultations", desc: "Gestion des consultations médicales et prescriptions", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
              { icon: "🔬", title: "Laboratoire", desc: "Examens biologiques et résultats d'analyses", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
              { icon: "💊", title: "Pharmacie", desc: "Stock et dispensation des médicaments", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
              { icon: "🏨", title: "Hospitalisation", desc: "Gestion des chambres et séjours hospitaliers", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
              { icon: "🧾", title: "Facturation", desc: "Factures, paiements et suivi financier", color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
              { icon: "📊", title: "Rapports", desc: "Statistiques et analyses détaillées", color: "#84cc16", bg: "rgba(132,204,22,0.1)" },
              { icon: "🔐", title: "Sécurité", desc: "Contrôle d'accès par rôles et permissions", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-2xl p-5 transition-all hover:scale-105 hover:-translate-y-1 cursor-pointer group"
                style={{
                  background: service.bg,
                  border: `1px solid ${service.color}30`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${service.color}20` }}
                >
                  {service.icon}
                </div>
                <h4 className="font-bold text-white mb-2">{service.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className="py-24 relative"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f2044 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — Medical team illustration */}
            <div className="relative">
              <div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {/* Medical team SVG */}
                <svg viewBox="0 0 360 260" className="w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background */}
                  <rect width="360" height="260" fill="#0a1628" rx="12" />

                  {/* Operating room / consultation room background */}
                  <rect x="0" y="180" width="360" height="80" fill="#0d2a1a" />
                  <rect x="0" y="178" width="360" height="4" fill="#0e9f6e" opacity="0.3" />

                  {/* Medical equipment - ECG monitor */}
                  <rect x="20" y="100" width="80" height="55" rx="6" fill="#0f2044" stroke="#1a56db" strokeWidth="1.5" />
                  <rect x="25" y="105" width="70" height="35" rx="3" fill="#0a1628" />
                  {/* ECG line */}
                  <polyline points="28,122 38,122 42,110 46,134 50,122 60,122 64,115 68,129 72,122 90,122" stroke="#0e9f6e" strokeWidth="2" fill="none" />
                  <rect x="25" y="143" width="30" height="8" rx="2" fill="#1a56db" opacity="0.6" />
                  <rect x="58" y="143" width="20" height="8" rx="2" fill="#ef4444" opacity="0.6" />
                  <rect x="81" y="143" width="12" height="8" rx="2" fill="#f59e0b" opacity="0.6" />

                  {/* Doctor 1 - with white coat */}
                  {/* Body */}
                  <rect x="130" y="110" width="50" height="70" rx="8" fill="white" opacity="0.95" />
                  {/* Coat details */}
                  <path d="M155 110 L155 130" stroke="#e5e7eb" strokeWidth="1" />
                  <rect x="138" y="115" width="10" height="8" rx="1" fill="#dbeafe" />
                  {/* Stethoscope */}
                  <path d="M148 115 Q140 130 145 140 Q150 148 158 145" stroke="#1a56db" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <circle cx="158" cy="145" r="4" fill="#1a56db" />
                  {/* Head */}
                  <circle cx="155" cy="90" r="18" fill="#f5c5a3" />
                  {/* Hair */}
                  <path d="M137 86 Q139 70 155 68 Q171 70 173 86 Q169 74 155 73 Q141 74 137 86Z" fill="#1a1a1a" />
                  {/* Eyes */}
                  <circle cx="149" cy="88" r="2" fill="#2d1b00" />
                  <circle cx="161" cy="88" r="2" fill="#2d1b00" />
                  {/* Smile */}
                  <path d="M150 96 Q155 100 160 96" stroke="#c0845a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* Arms */}
                  <rect x="112" y="115" width="20" height="35" rx="7" fill="white" opacity="0.9" />
                  <rect x="178" y="115" width="20" height="35" rx="7" fill="white" opacity="0.9" />
                  {/* Hands */}
                  <ellipse cx="122" cy="150" rx="9" ry="6" fill="#f5c5a3" />
                  <ellipse cx="188" cy="150" rx="9" ry="6" fill="#f5c5a3" />
                  {/* Clipboard in hand */}
                  <rect x="178" y="130" width="22" height="28" rx="2" fill="#f3f4f6" />
                  <rect x="181" y="134" width="16" height="2" rx="1" fill="#9ca3af" />
                  <rect x="181" y="138" width="12" height="2" rx="1" fill="#9ca3af" />
                  <rect x="181" y="142" width="14" height="2" rx="1" fill="#9ca3af" />
                  <rect x="181" y="146" width="10" height="2" rx="1" fill="#9ca3af" />
                  {/* ID badge */}
                  <rect x="150" y="125" width="14" height="10" rx="2" fill="#1a56db" opacity="0.9" />
                  <rect x="152" y="127" width="10" height="2" rx="1" fill="white" opacity="0.8" />

                  {/* Doctor 2 - nurse */}
                  <rect x="230" y="115" width="45" height="65" rx="8" fill="#dbeafe" opacity="0.9" />
                  {/* Nurse cap */}
                  <rect x="240" y="80" width="25" height="8" rx="2" fill="white" opacity="0.9" />
                  <rect x="248" y="76" width="9" height="6" rx="1" fill="#ef4444" opacity="0.8" />
                  {/* Head */}
                  <circle cx="252" cy="95" r="16" fill="#f5c5a3" />
                  {/* Hair */}
                  <path d="M236 92 Q238 78 252 76 Q266 78 268 92 Q264 82 252 81 Q240 82 236 92Z" fill="#8b4513" />
                  {/* Eyes */}
                  <circle cx="247" cy="93" r="2" fill="#2d1b00" />
                  <circle cx="257" cy="93" r="2" fill="#2d1b00" />
                  {/* Smile */}
                  <path d="M248 100 Q252 104 256 100" stroke="#c0845a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* Arms */}
                  <rect x="213" y="120" width="18" height="30" rx="7" fill="#dbeafe" opacity="0.9" />
                  <rect x="274" y="120" width="18" height="30" rx="7" fill="#dbeafe" opacity="0.9" />
                  {/* Hands */}
                  <ellipse cx="222" cy="150" rx="8" ry="6" fill="#f5c5a3" />
                  <ellipse cx="283" cy="150" rx="8" ry="6" fill="#f5c5a3" />
                  {/* Syringe in hand */}
                  <rect x="278" y="138" width="18" height="6" rx="3" fill="#e5e7eb" />
                  <rect x="294" y="140" width="8" height="2" rx="1" fill="#9ca3af" />
                  <rect x="280" y="139" width="6" height="4" rx="1" fill="#bfdbfe" />

                  {/* Medical cross symbol */}
                  <rect x="310" y="60" width="10" height="35" rx="3" fill="#ef4444" opacity="0.7" />
                  <rect x="298" y="72" width="34" height="10" rx="3" fill="#ef4444" opacity="0.7" />

                  {/* Patient bed */}
                  <rect x="30" y="185" width="100" height="20" rx="4" fill="#1e3a5f" />
                  <rect x="30" y="175" width="100" height="12" rx="3" fill="#1a2e4a" />
                  {/* Patient */}
                  <ellipse cx="80" cy="172" rx="14" ry="10" fill="#f5c5a3" />
                  <rect x="66" y="175" width="28" height="22" rx="3" fill="#dbeafe" opacity="0.7" />
                  {/* IV drip */}
                  <rect x="125" y="140" width="3" height="45" fill="#9ca3af" opacity="0.6" />
                  <rect x="118" y="138" width="17" height="25" rx="3" fill="#bfdbfe" opacity="0.7" />
                  <rect x="126" y="163" width="1" height="22" fill="#60a5fa" opacity="0.8" />

                  {/* Decorative elements */}
                  <circle cx="340" cy="40" r="20" fill="none" stroke="#1a56db" strokeWidth="1" opacity="0.3" />
                  <circle cx="340" cy="40" r="12" fill="none" stroke="#0e9f6e" strokeWidth="1" opacity="0.3" />
                </svg>

                {/* Overlay label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white text-center"
                    style={{ background: "rgba(26,86,219,0.7)", backdropFilter: "blur(10px)" }}
                  >
                    🏥 Équipe Médicale Professionnelle
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-xl"
                style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
              >
                <span className="text-2xl">⭐</span>
                <span className="text-white text-xs font-bold">Top</span>
                <span className="text-white text-xs">Qualité</span>
              </div>
            </div>

            {/* Right — Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                style={{ background: "rgba(14,159,110,0.15)", color: "#6ee7b7", border: "1px solid rgba(14,159,110,0.3)" }}
              >
                🏥 À Propos
              </div>
              <h3 className="text-4xl font-bold text-white mb-6">
                Notre Centre Médical au Service de la Communauté
              </h3>
              <p className="text-blue-200 mb-4 leading-relaxed text-lg">
                Le Centre Médical Jéhova Rapha de Kindu est un établissement de santé dédié à fournir des soins médicaux de qualité à la population de Kindu et ses environs.
              </p>
              <p className="text-blue-300 mb-8 leading-relaxed">
                Notre système de gestion hospitalière moderne permet à notre équipe médicale de se concentrer sur l&apos;essentiel : le bien-être de nos patients.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Médecins", value: "12+", icon: "🩺", color: "#3b82f6" },
                  { label: "Infirmiers", value: "35+", icon: "💉", color: "#10b981" },
                  { label: "Années d'expérience", value: "15+", icon: "📅", color: "#8b5cf6" },
                  { label: "Patients/mois", value: "500+", icon: "👥", color: "#f59e0b" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: `${item.color}20` }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{item.value}</div>
                      <div className="text-xs text-blue-300">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Roles */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <h4 className="text-white font-bold mb-4">Accès par Rôle</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: "Administrateur", icon: "👑", color: "#f59e0b" },
                    { role: "Médecin", icon: "🩺", color: "#3b82f6" },
                    { role: "Infirmier", icon: "💉", color: "#10b981" },
                    { role: "Caissier", icon: "💰", color: "#84cc16" },
                    { role: "Laborantin", icon: "🔬", color: "#8b5cf6" },
                    { role: "Pharmacien", icon: "💊", color: "#ef4444" },
                  ].map((r) => (
                    <div
                      key={r.role}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <span>{r.icon}</span>
                      <span className="text-sm text-white">{r.role}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/login"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
                >
                  Se Connecter →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 relative" style={{ background: "#0d1f3c" }}>
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-30"
          style={{ background: "linear-gradient(90deg, transparent, #0e9f6e, transparent)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-3">Contactez-Nous</h3>
            <p className="text-blue-300">Nous sommes disponibles pour vous aider</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: "📍", title: "Adresse", info: "Kindu, Maniema, RD Congo", color: "#3b82f6" },
              { icon: "📞", title: "Téléphone", info: "+243 XXX XXX XXX", color: "#10b981" },
              { icon: "🕐", title: "Horaires", info: "Lun-Sam: 7h00 - 20h00", color: "#8b5cf6" },
            ].map((contact) => (
              <div
                key={contact.title}
                className="text-center p-6 rounded-2xl transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{ background: `${contact.color}20` }}
                >
                  {contact.icon}
                </div>
                <h4 className="text-white font-bold mb-2">{contact.title}</h4>
                <p className="text-blue-300 text-sm">{contact.info}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(26,86,219,0.2), rgba(14,159,110,0.2))",
              border: "1px solid rgba(26,86,219,0.3)",
            }}
          >
            <h4 className="text-2xl font-bold text-white mb-3">Prêt à commencer?</h4>
            <p className="text-blue-300 mb-6">Accédez au système de gestion hospitalière dès maintenant</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-105 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1a56db, #0e9f6e)",
                boxShadow: "0 8px 25px rgba(26,86,219,0.4)",
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Accéder au Système →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EQUIPE / TRAVAILLEURS SECTION ===== */}
      <section id="equipe" className="py-20 relative" style={{ background: "#0a1628" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4"
              style={{ background: "rgba(14,159,110,0.15)", color: "#6ee7b7", border: "1px solid rgba(14,159,110,0.3)" }}
            >
              👥 Notre Équipe
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">L&apos;Équipe du Centre Médical</h3>
            <p className="text-blue-300 max-w-2xl mx-auto">
              Une équipe dédiée de professionnels de santé engagés à为您提供优质的医疗服务
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Dr. M. K.", role: "Médecin Chef", icon: "🩺", color: "#3b82f6" },
              { name: "Inf. J. D.", role: "Infirmière en Chef", icon: "💉", color: "#10b981" },
              { name: "Dr. P. L.", role: "Laborantin", icon: "🔬", color: "#8b5cf6" },
              { name: "M. T. B.", role: "Pharmacien", icon: "💊", color: "#f59e0b" },
              { name: "Mme S. M.", role: "Caissière", icon: "💰", color: "#06b6d4" },
              { name: "M. R. K.", role: "Administrateur", icon: "👑", color: "#ef4444" },
            ].map((member, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 text-center transition-all hover:scale-105 hover:-translate-y-1"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${member.color}20`, border: `2px solid ${member.color}40` }}
                >
                  {member.icon}
                </div>
                <h4 className="text-white font-semibold text-sm mb-1">{member.name}</h4>
                <p className="text-xs" style={{ color: member.color }}>{member.role}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-blue-400 text-xs mt-8">
            💡 Cliquez sur "Créer Utilisateur" pour ajouter les membres de votre équipe
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        className="py-8 text-center"
        style={{ background: "#080f1e", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
          >
            🏥
          </div>
          <span className="text-white font-semibold text-sm">Centre Médical Jéhova Rapha de Kindu</span>
        </div>
        <p className="text-blue-400 text-xs">© 2024 Tous droits réservés — Système de Gestion Hospitalière v1.0</p>
      </footer>
    </main>
  );
}
