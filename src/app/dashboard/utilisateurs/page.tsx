"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  password: string;
  role: string;
  statut: "Actif" | "Inactif";
  dernierLogin: string;
  permissions: string[];
  telephone?: string;
}

// ─── Admin account (always present, read-only) ────────────────────────────────
const ADMIN_USER: Utilisateur = {
  id: "USR-001",
  nom: "Administrateur Système",
  email: "jehovarapha@gmail.com",
  password: "admin.com",
  role: "Administrateur",
  statut: "Actif",
  dernierLogin: new Date().toLocaleString("fr-FR"),
  permissions: ["all"],
};

function loadUsers(): Utilisateur[] {
  try {
    const stored = localStorage.getItem("hospital_users");
    const extra: Utilisateur[] = stored ? JSON.parse(stored) : [];
    return [ADMIN_USER, ...extra];
  } catch {
    return [ADMIN_USER];
  }
}

function saveExtraUsers(users: Utilisateur[]) {
  // Never save the admin account (index 0) — it's always hardcoded
  localStorage.setItem("hospital_users", JSON.stringify(users));
}

const roleColors: Record<string, string> = {
  "Administrateur": "badge-danger",
  "Médecin": "badge-info",
  "Infirmier": "badge-success",
  "Caissier": "badge-warning",
  "Laborantin": "badge-gray",
  "Pharmacien": "badge-gray",
};

const roleIcons: Record<string, string> = {
  "Administrateur": "👑",
  "Médecin": "🩺",
  "Infirmier": "💉",
  "Caissier": "💰",
  "Laborantin": "🔬",
  "Pharmacien": "💊",
};

const rolePermissions: Record<string, string[]> = {
  "Administrateur": ["all"],
  "Médecin": ["patients", "consultations", "prescriptions", "laboratoire", "hospitalisation"],
  "Infirmier": ["patients", "hospitalisation"],
  "Caissier": ["factures", "paiements"],
  "Laborantin": ["laboratoire"],
  "Pharmacien": ["medicaments", "prescriptions"],
};

export default function UtilisateursPage() {
  const [users, setUsers] = useState<Utilisateur[]>(() => loadUsers());
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");
  const [newUser, setNewUser] = useState({
    nom: "", email: "", password: "", confirmPassword: "", role: "Médecin", telephone: "",
  });

  const roleCounts = (role: string) => users.filter(u => u.role === role).length;

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!newUser.nom || !newUser.email || !newUser.password) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    if (newUser.password !== newUser.confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (users.find(u => u.email === newUser.email)) {
      setFormError("Cet email est déjà utilisé.");
      return;
    }

    const created: Utilisateur = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      nom: newUser.nom,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      statut: "Actif",
      dernierLogin: "Jamais",
      permissions: rolePermissions[newUser.role] ?? [],
      telephone: newUser.telephone,
    };

    // Save to localStorage (exclude admin from stored list)
    const extra = [...users.slice(1), created];
    saveExtraUsers(extra);
    setUsers([ADMIN_USER, ...extra]);
    setShowModal(false);
    setNewUser({ nom: "", email: "", password: "", confirmPassword: "", role: "Médecin", telephone: "" });
    setSuccess(`✅ Compte créé pour ${created.nom} (${created.email})`);
    setTimeout(() => setSuccess(""), 5000);
  };

  const toggleStatut = (id: string) => {
    const updated = users.map(u =>
      u.id === id && u.id !== "USR-001"
        ? { ...u, statut: u.statut === "Actif" ? "Inactif" as const : "Actif" as const }
        : u
    );
    setUsers(updated);
    saveExtraUsers(updated.slice(1));
  };

  const deleteUser = (id: string) => {
    if (id === "USR-001") return; // cannot delete admin
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveExtraUsers(updated.slice(1));
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">Seul l&apos;administrateur peut créer des comptes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nouvel Utilisateur
        </button>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-4 p-3 rounded-xl text-sm" style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
          {success}
        </div>
      )}

      {/* Stats par rôle */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
        {[
          { role: "Administrateur", icon: "👑", color: "#ef4444" },
          { role: "Médecin", icon: "🩺", color: "#3b82f6" },
          { role: "Infirmier", icon: "💉", color: "#10b981" },
          { role: "Caissier", icon: "💰", color: "#f59e0b" },
          { role: "Laborantin", icon: "🔬", color: "#8b5cf6" },
          { role: "Pharmacien", icon: "💊", color: "#06b6d4" },
        ].map((r) => (
          <div key={r.role} className="stat-card text-center p-4">
            <div className="text-2xl mb-1">{r.icon}</div>
            <div className="text-xl font-bold" style={{ color: r.color }}>{roleCounts(r.role)}</div>
            <div className="text-xs text-gray-500">{r.role}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input type="text" className="form-input max-w-xs" placeholder="🔍 Rechercher un utilisateur..." />
          <select className="form-input w-auto">
            <option>Tous les rôles</option>
            <option>Administrateur</option>
            <option>Médecin</option>
            <option>Infirmier</option>
            <option>Caissier</option>
            <option>Laborantin</option>
            <option>Pharmacien</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Permissions</th>
                <th>Dernier Login</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td><span className="font-mono text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{user.id}</span></td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: "#f3f4f6" }}>
                        {roleIcons[user.role]}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.nom}</div>
                        {user.telephone && <div className="text-xs text-gray-400">{user.telephone}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-500 text-sm">{user.email}</td>
                  <td><span className={`badge ${roleColors[user.role]}`}>{user.role}</span></td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.includes("all") ? (
                        <span className="badge badge-danger">Accès complet</span>
                      ) : (
                        user.permissions.slice(0, 2).map(p => (
                          <span key={p} className="badge badge-gray capitalize">{p}</span>
                        ))
                      )}
                      {user.permissions.length > 2 && !user.permissions.includes("all") && (
                        <span className="badge badge-gray">+{user.permissions.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="text-gray-500 text-sm">{user.dernierLogin}</td>
                  <td>
                    <span className={`badge ${user.statut === "Actif" ? "badge-success" : "badge-gray"}`}>
                      {user.statut === "Actif" ? "🟢" : "🔴"} {user.statut}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {user.id !== "USR-001" && (
                        <>
                          <button
                            className={`btn btn-sm ${user.statut === "Actif" ? "btn-danger" : "btn-success"}`}
                            onClick={() => toggleStatut(user.id)}
                            title={user.statut === "Actif" ? "Désactiver" : "Activer"}
                          >
                            {user.statut === "Actif" ? "🚫" : "✅"}
                          </button>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => deleteUser(user.id)}
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                      {user.id === "USR-001" && (
                        <span className="text-xs text-gray-400 italic">Compte principal</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logs d'activité */}
      <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">Journal d&apos;Activité Récent</h3>
        <div className="space-y-2">
          {[
            { user: "Administrateur", action: "Connexion au système", time: "07:30", type: "info" },
            { user: "Administrateur", action: "Compte utilisateur créé", time: "08:00", type: "success" },
            { user: "Administrateur", action: "Paramètres mis à jour", time: "09:15", type: "info" },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "#f9fafb" }}>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.type === "success" ? "bg-green-400" : log.type === "danger" ? "bg-red-400" : "bg-blue-400"}`}></div>
              <span className="text-sm font-medium text-gray-700 w-36 flex-shrink-0">{log.user}</span>
              <span className="text-sm text-gray-600 flex-1">{log.action}</span>
              <span className="text-xs text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nouvel Utilisateur */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Créer un Utilisateur</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleCreateUser}>
              {formError && (
                <div className="p-3 rounded-xl text-sm" style={{ background: "#fde8e8", color: "#9b1c1c", border: "1px solid #fca5a5" }}>
                  ⚠️ {formError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nom complet *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nom et prénom"
                    value={newUser.nom}
                    onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="email@exemple.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Rôle *</label>
                  <select
                    className="form-input"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option>Médecin</option>
                    <option>Infirmier</option>
                    <option>Caissier</option>
                    <option>Laborantin</option>
                    <option>Pharmacien</option>
                    <option>Administrateur</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+243 XXX XXX XXX"
                    value={newUser.telephone}
                    onChange={(e) => setNewUser({ ...newUser, telephone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Mot de passe *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Confirmer mot de passe *</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              <div
                className="p-3 rounded-xl text-sm"
                style={{ background: "#eff6ff", color: "#1e40af", border: "1px solid #bfdbfe" }}
              >
                ℹ️ Les permissions seront attribuées automatiquement selon le rôle sélectionné. L&apos;utilisateur pourra se connecter avec cet email et ce mot de passe.
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">✅ Créer l&apos;Utilisateur</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
