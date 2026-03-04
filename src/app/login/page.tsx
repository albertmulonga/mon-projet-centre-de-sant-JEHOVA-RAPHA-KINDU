"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function generateCaptcha() {
  const ops = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === "+") {
    a = Math.floor(Math.random() * 10) + 1;
    b = Math.floor(Math.random() * 10) + 1;
    answer = a + b;
  } else if (op === "-") {
    a = Math.floor(Math.random() * 10) + 5;
    b = Math.floor(Math.random() * 5) + 1;
    answer = a - b;
  } else {
    a = Math.floor(Math.random() * 5) + 1;
    b = Math.floor(Math.random() * 5) + 1;
    answer = a * b;
  }
  return { question: `Combien font ${a} ${op} ${b} = ?`, answer };
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const [captcha, setCaptcha] = useState(() => generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const refreshCaptcha = useCallback(() => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (parseInt(captchaInput) !== captcha.answer) {
      setError("Réponse au CAPTCHA incorrecte. Veuillez réessayer.");
      refreshCaptcha();
      return;
    }

    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a1628 0%, #0f2044 40%, #0d3b2e 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{ background: "radial-gradient(circle, #1a56db, transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -right-32 w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{ background: "radial-gradient(circle, #0e9f6e, transparent 70%)", animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)", animationDelay: "2s" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Left Panel — Illustration */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 relative z-10">
        <div className="text-center max-w-lg">
          {/* Hospital Logo */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-2xl"
              style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
            >
              🏥
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white leading-tight">CENTRE MÉDICAL</h1>
              <p className="text-blue-300 font-semibold">JÉHOVA RAPHA DE KINDU</p>
            </div>
          </div>

          {/* Doctor Illustration SVG */}
          <div className="relative mb-8">
            <div
              className="w-72 h-72 mx-auto rounded-3xl flex items-center justify-center relative overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}
            >
              {/* Doctor at computer SVG illustration */}
              <svg viewBox="0 0 280 280" className="w-64 h-64" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Desk */}
                <rect x="20" y="200" width="240" height="12" rx="4" fill="#1e3a5f" />
                <rect x="30" y="212" width="10" height="50" rx="3" fill="#1a2e4a" />
                <rect x="240" y="212" width="10" height="50" rx="3" fill="#1a2e4a" />
                {/* Monitor */}
                <rect x="80" y="130" width="120" height="75" rx="6" fill="#0f2044" stroke="#1a56db" strokeWidth="2" />
                <rect x="86" y="136" width="108" height="60" rx="3" fill="#0a1628" />
                {/* Screen content */}
                <rect x="92" y="142" width="60" height="4" rx="2" fill="#1a56db" opacity="0.8" />
                <rect x="92" y="150" width="40" height="3" rx="2" fill="#0e9f6e" opacity="0.7" />
                <rect x="92" y="157" width="50" height="3" rx="2" fill="#3b82f6" opacity="0.5" />
                <rect x="92" y="164" width="35" height="3" rx="2" fill="#0e9f6e" opacity="0.5" />
                <rect x="155" y="142" width="33" height="48" rx="3" fill="#1a3a6b" opacity="0.6" />
                {/* Monitor stand */}
                <rect x="132" y="205" width="16" height="10" rx="2" fill="#1e3a5f" />
                <rect x="122" y="213" width="36" height="5" rx="2" fill="#1a2e4a" />
                {/* Keyboard */}
                <rect x="90" y="218" width="100" height="14" rx="3" fill="#1a2e4a" />
                <rect x="95" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="106" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="117" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="128" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="139" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="150" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="161" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                <rect x="172" y="221" width="8" height="4" rx="1" fill="#2d4a7a" />
                {/* Doctor body */}
                {/* White coat */}
                <rect x="108" y="95" width="64" height="55" rx="8" fill="white" opacity="0.95" />
                {/* Stethoscope */}
                <path d="M128 100 Q120 115 125 125 Q130 135 140 130" stroke="#1a56db" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <circle cx="140" cy="130" r="5" fill="#1a56db" />
                {/* Coat collar */}
                <path d="M130 95 L140 108 L150 95" fill="#e8f0fe" stroke="#c7d7f8" strokeWidth="1" />
                {/* Blue shirt under */}
                <rect x="133" y="95" width="14" height="15" fill="#1a56db" opacity="0.8" />
                {/* Doctor head */}
                <circle cx="140" cy="72" r="22" fill="#f5c5a3" />
                {/* Hair */}
                <path d="M118 68 Q120 48 140 46 Q160 48 162 68 Q158 55 140 54 Q122 55 118 68Z" fill="#2d1b00" />
                {/* Eyes */}
                <circle cx="133" cy="70" r="2.5" fill="#2d1b00" />
                <circle cx="147" cy="70" r="2.5" fill="#2d1b00" />
                <circle cx="134" cy="69" r="1" fill="white" />
                <circle cx="148" cy="69" r="1" fill="white" />
                {/* Smile */}
                <path d="M134 78 Q140 83 146 78" stroke="#c0845a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                {/* Ears */}
                <ellipse cx="118" cy="72" rx="4" ry="5" fill="#f5c5a3" />
                <ellipse cx="162" cy="72" rx="4" ry="5" fill="#f5c5a3" />
                {/* Arms */}
                <rect x="90" y="100" width="20" height="40" rx="8" fill="white" opacity="0.9" />
                <rect x="170" y="100" width="20" height="40" rx="8" fill="white" opacity="0.9" />
                {/* Hands on keyboard */}
                <ellipse cx="100" cy="140" rx="10" ry="7" fill="#f5c5a3" />
                <ellipse cx="180" cy="140" rx="10" ry="7" fill="#f5c5a3" />
                {/* ID Badge */}
                <rect x="136" y="108" width="18" height="12" rx="2" fill="#1a56db" opacity="0.9" />
                <rect x="138" y="110" width="14" height="2" rx="1" fill="white" opacity="0.8" />
                <rect x="138" y="114" width="10" height="2" rx="1" fill="#60a5fa" opacity="0.8" />
                {/* Phone on desk */}
                <rect x="210" y="185" width="28" height="16" rx="4" fill="#1a2e4a" stroke="#1a56db" strokeWidth="1.5" />
                <rect x="213" y="188" width="22" height="10" rx="2" fill="#0a1628" />
                <rect x="215" y="190" width="12" height="2" rx="1" fill="#1a56db" opacity="0.7" />
                <rect x="215" y="194" width="8" height="2" rx="1" fill="#0e9f6e" opacity="0.7" />
              </svg>
            </div>
            {/* Floating badges */}
            <div
              className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #1a56db, #3b82f6)" }}
            >
              🔒 Sécurisé
            </div>
            <div
              className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #0e9f6e, #10b981)" }}
            >
              ✅ Certifié
            </div>
          </div>

          <p className="text-blue-200 text-sm leading-relaxed max-w-sm mx-auto">
            Système de Gestion Hospitalière Intégré — Accédez à votre espace de travail sécurisé pour gérer efficacement votre centre médical.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex justify-center gap-6">
            {[
              { value: "1,240+", label: "Patients" },
              { value: "45", label: "Chambres" },
              { value: "6", label: "Rôles" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-blue-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          <div
            className="rounded-3xl p-8 shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.97)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.4)",
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <div className="text-5xl mb-2">🏥</div>
              <h1 className="text-xl font-bold text-gray-800">Centre Médical Jéhova Rapha</h1>
              <p className="text-gray-500 text-sm">de Kindu</p>
            </div>

            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)" }}
                >
                  🔐
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Connexion</h2>
                  <p className="text-gray-500 text-xs">Accédez à votre espace de travail</p>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2"
                style={{ background: "#fde8e8", color: "#9b1c1c", border: "1px solid #fca5a5" }}
              >
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rôle</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                    {form.role === "admin" ? "👑" : form.role === "medecin" ? "🩺" : form.role === "infirmier" ? "💉" : form.role === "caissier" ? "💰" : form.role === "laborantin" ? "🔬" : "💊"}
                  </span>
                  <select
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#d1d5db", background: "#f9fafb" }}
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="admin">Administrateur</option>
                    <option value="medecin">Médecin</option>
                    <option value="infirmier">Infirmier</option>
                    <option value="caissier">Caissier</option>
                    <option value="laborantin">Laborantin</option>
                    <option value="pharmacien">Pharmacien</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse Email</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#d1d5db", background: "#f9fafb" }}
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#d1d5db", background: "#f9fafb" }}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* CAPTCHA */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Vérification de sécurité</label>
                <div
                  className="rounded-xl p-4"
                  style={{ background: "linear-gradient(135deg, #eff6ff, #f0fdf4)", border: "1px solid #bfdbfe" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🧮</span>
                      <span className="text-sm font-medium text-gray-700">CAPTCHA Mathématique</span>
                    </div>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80 flex items-center gap-1"
                      style={{ background: "#dbeafe", color: "#1a56db" }}
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Changer
                    </button>
                  </div>
                  <div
                    className="text-center py-3 rounded-lg mb-3 font-bold text-xl tracking-widest"
                    style={{ background: "rgba(255,255,255,0.8)", color: "#1a56db", letterSpacing: "0.1em", fontFamily: "monospace" }}
                  >
                    {captcha.question}
                  </div>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm text-center font-semibold focus:outline-none focus:ring-2 transition-all"
                    style={{ borderColor: "#93c5fd", background: "white" }}
                    placeholder="Votre réponse..."
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded w-4 h-4" style={{ accentColor: "#1a56db" }} />
                  <span className="text-sm text-gray-600">Se souvenir de moi</span>
                </label>
                <a href="#" className="text-sm font-medium hover:underline" style={{ color: "#1a56db" }}>
                  Mot de passe oublié?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 hover:scale-[1.01] disabled:opacity-70 disabled:scale-100 shadow-lg"
                style={{ background: "linear-gradient(135deg, #1a56db, #0e9f6e)", boxShadow: "0 4px 15px rgba(26,86,219,0.4)" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se Connecter
                  </span>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour à l&apos;accueil
              </Link>
              <div
                className="text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                style={{ background: "#f0fdf4", color: "#166534" }}
              >
                🔒 Connexion sécurisée
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
