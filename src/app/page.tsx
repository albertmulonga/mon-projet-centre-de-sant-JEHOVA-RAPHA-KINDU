import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #0f2044 0%, #1a3a6b 50%, #0e6655 100%)" }}>
      {/* Header */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
              🏥
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">CENTRE MÉDICAL</h1>
              <p className="text-blue-200 text-sm font-medium">JÉHOVA RAPHA DE KINDU</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#services" className="text-blue-200 hover:text-white text-sm transition-colors">Services</a>
            <a href="#about" className="text-blue-200 hover:text-white text-sm transition-colors">À propos</a>
            <a href="#contact" className="text-blue-200 hover:text-white text-sm transition-colors">Contact</a>
            <Link href="/login" className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: "rgba(14,159,110,0.2)", color: "#6ee7b7", border: "1px solid rgba(14,159,110,0.3)" }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Système de Gestion Hospitalière
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Bienvenue au<br />
              <span style={{ color: "#60a5fa" }}>Centre Médical</span><br />
              Jéhova Rapha
            </h2>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              Un système complet de gestion hospitalière pour assurer des soins de qualité à nos patients. 
              Gérez patients, consultations, laboratoire, pharmacie et facturation en un seul endroit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/login" className="px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:opacity-90 hover:scale-105" style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}>
                Accéder au Système →
              </Link>
              <a href="#services" className="px-8 py-3.5 rounded-xl font-semibold transition-all" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
                Nos Services
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "👥", label: "Patients", value: "1,240+", color: "#3b82f6" },
                { icon: "🩺", label: "Consultations", value: "8,500+", color: "#10b981" },
                { icon: "🏨", label: "Chambres", value: "45", color: "#8b5cf6" },
                { icon: "💊", label: "Médicaments", value: "320+", color: "#f59e0b" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5 text-center" style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm" style={{ color: stat.color }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-20" style={{ background: "rgba(0,0,0,0.2)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Nos Modules de Gestion</h3>
            <p className="text-blue-200 max-w-2xl mx-auto">Un système intégré couvrant tous les aspects de la gestion hospitalière</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "👤", title: "Patients", desc: "Enregistrement et suivi complet des patients", color: "#3b82f6" },
              { icon: "🩺", title: "Consultations", desc: "Gestion des consultations médicales", color: "#10b981" },
              { icon: "🔬", title: "Laboratoire", desc: "Examens et résultats d'analyses", color: "#8b5cf6" },
              { icon: "💊", title: "Pharmacie", desc: "Stock et dispensation des médicaments", color: "#f59e0b" },
              { icon: "🏨", title: "Hospitalisation", desc: "Gestion des chambres et séjours", color: "#ef4444" },
              { icon: "🧾", title: "Facturation", desc: "Factures et paiements automatisés", color: "#06b6d4" },
              { icon: "📊", title: "Rapports", desc: "Statistiques et analyses détaillées", color: "#84cc16" },
              { icon: "🔐", title: "Sécurité", desc: "Contrôle d'accès par rôles", color: "#f97316" },
            ].map((service) => (
              <div key={service.title} className="rounded-xl p-5 text-center transition-all hover:scale-105" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div className="text-3xl mb-3">{service.icon}</div>
                <h4 className="font-semibold text-white mb-2">{service.title}</h4>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">À Propos de Notre Centre</h3>
              <p className="text-blue-200 mb-4 leading-relaxed">
                Le Centre Médical Jéhova Rapha de Kindu est un établissement de santé dédié à fournir des soins médicaux de qualité à la population de Kindu et ses environs.
              </p>
              <p className="text-blue-200 mb-6 leading-relaxed">
                Notre système de gestion hospitalière moderne permet à notre équipe médicale de se concentrer sur l&apos;essentiel : le bien-être de nos patients.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Médecins", value: "12+" },
                  { label: "Infirmiers", value: "35+" },
                  { label: "Années d'expérience", value: "15+" },
                  { label: "Patients/mois", value: "500+" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg p-4" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="text-2xl font-bold text-white">{item.value}</div>
                    <div className="text-sm text-blue-300">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h4 className="text-xl font-bold text-white mb-6">Accès Rapide au Système</h4>
              <div className="space-y-3">
                {[
                  { role: "Administrateur", icon: "👑", desc: "Accès complet au système" },
                  { role: "Médecin", icon: "🩺", desc: "Consultations et prescriptions" },
                  { role: "Infirmier", icon: "💉", desc: "Soins et hospitalisations" },
                  { role: "Caissier", icon: "💰", desc: "Facturation et paiements" },
                  { role: "Laborantin", icon: "🔬", desc: "Examens et résultats" },
                  { role: "Pharmacien", icon: "💊", desc: "Stock et dispensation" },
                ].map((role) => (
                  <div key={role.role} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <span className="text-xl">{role.icon}</span>
                    <div>
                      <div className="text-white text-sm font-medium">{role.role}</div>
                      <div className="text-blue-300 text-xs">{role.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/login" className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}>
                Se Connecter →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-16" style={{ background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-3">Contactez-Nous</h3>
            <p className="text-blue-200">Nous sommes disponibles pour vous aider</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "📍", title: "Adresse", info: "Kindu, Maniema, RD Congo" },
              { icon: "📞", title: "Téléphone", info: "+243 XXX XXX XXX" },
              { icon: "🕐", title: "Horaires", info: "Lun-Sam: 7h00 - 20h00" },
            ].map((contact) => (
              <div key={contact.title} className="text-center p-6 rounded-xl" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="text-3xl mb-3">{contact.icon}</div>
                <h4 className="text-white font-semibold mb-1">{contact.title}</h4>
                <p className="text-blue-300 text-sm">{contact.info}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <p className="text-blue-300 text-sm">
          © 2024 Centre Médical Jéhova Rapha de Kindu. Tous droits réservés.
        </p>
        <p className="text-blue-400 text-xs mt-1">Système de Gestion Hospitalière v1.0</p>
      </footer>
    </main>
  );
}
