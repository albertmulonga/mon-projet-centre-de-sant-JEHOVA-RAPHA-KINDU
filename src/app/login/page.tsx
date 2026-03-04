"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "", role: "admin" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate authentication
    setTimeout(() => {
      if (form.username && form.password) {
        router.push("/dashboard");
      } else {
        setError("Veuillez remplir tous les champs.");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0f2044 0%, #1a3a6b 50%, #0e6655 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full" style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full" style={{ background: "radial-gradient(circle, #10b981, transparent)" }}></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6">🏥</div>
          <h1 className="text-4xl font-bold text-white mb-3">CENTRE MÉDICAL</h1>
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#60a5fa" }}>JÉHOVA RAPHA</h2>
          <p className="text-blue-300 text-lg mb-8">DE KINDU</p>
          <div className="w-24 h-1 mx-auto rounded-full mb-8" style={{ background: "linear-gradient(90deg, #3b82f6, #10b981)" }}></div>
          <p className="text-blue-200 text-sm max-w-sm leading-relaxed">
            Système de Gestion Hospitalière Intégré — Gérez efficacement tous les aspects de votre centre médical
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[
              { icon: "👥", label: "Patients" },
              { icon: "🩺", label: "Consultations" },
              { icon: "💊", label: "Pharmacie" },
              { icon: "🧾", label: "Facturation" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }}>
                <span>{item.icon}</span>
                <span className="text-white text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl p-8 shadow-2xl" style={{ background: "rgba(255,255,255,0.97)" }}>
            {/* Logo mobile */}
            <div className="lg:hidden text-center mb-6">
              <div className="text-5xl mb-2">🏥</div>
              <h1 className="text-xl font-bold text-gray-800">Centre Médical Jéhova Rapha</h1>
              <p className="text-gray-500 text-sm">de Kindu</p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Connexion</h2>
              <p className="text-gray-500 text-sm">Accédez à votre espace de travail</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: "#fde8e8", color: "#9b1c1c" }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Rôle</label>
                <select
                  className="form-input"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="admin">👑 Administrateur</option>
                  <option value="medecin">🩺 Médecin</option>
                  <option value="infirmier">💉 Infirmier</option>
                  <option value="caissier">💰 Caissier</option>
                  <option value="laborantin">🔬 Laborantin</option>
                  <option value="pharmacien">💊 Pharmacien</option>
                </select>
              </div>

              <div>
                <label className="form-label">Nom d&apos;utilisateur</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Entrez votre nom d'utilisateur"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm" style={{ color: "#1a56db" }}>Mot de passe oublié?</a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : "Se Connecter →"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                ← Retour à l&apos;accueil
              </Link>
            </div>

            <div className="mt-4 p-3 rounded-lg text-xs text-center" style={{ background: "#f0fdf4", color: "#166534" }}>
              🔒 Connexion sécurisée — Vos données sont protégées
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
