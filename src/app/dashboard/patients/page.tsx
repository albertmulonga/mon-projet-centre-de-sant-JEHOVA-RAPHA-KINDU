"use client";
import { useState } from "react";

const patientsData = [
  { id: "PAT-001", nom: "Marie Kabila", sexe: "F", age: 34, telephone: "+243 812 345 678", adresse: "Kindu, Q. Alunguli", groupe: "A+", statut: "Actif", date: "2024-01-15" },
  { id: "PAT-002", nom: "Jean Mwamba", sexe: "M", age: 52, telephone: "+243 897 654 321", adresse: "Kindu, Q. Kasuku", groupe: "O+", statut: "Hospitalisé", date: "2024-01-20" },
  { id: "PAT-003", nom: "Amina Lokwa", sexe: "F", age: 28, telephone: "+243 823 456 789", adresse: "Kindu, Q. Mikelenge", groupe: "B+", statut: "Sorti", date: "2024-02-01" },
  { id: "PAT-004", nom: "Pierre Ngoy", sexe: "M", age: 45, telephone: "+243 845 678 901", adresse: "Kindu, Q. Kasuku", groupe: "AB+", statut: "Actif", date: "2024-02-10" },
  { id: "PAT-005", nom: "Sophie Tshala", sexe: "F", age: 19, telephone: "+243 867 890 123", adresse: "Kindu, Q. Alunguli", groupe: "A-", statut: "Actif", date: "2024-02-15" },
  { id: "PAT-006", nom: "Robert Kalala", sexe: "M", age: 67, telephone: "+243 889 012 345", adresse: "Kindu, Q. Mikelenge", groupe: "O-", statut: "Hospitalisé", date: "2024-02-20" },
  { id: "PAT-007", nom: "Fatima Mbaya", sexe: "F", age: 41, telephone: "+243 801 234 567", adresse: "Kindu, Q. Kasuku", groupe: "B-", statut: "Actif", date: "2024-03-01" },
  { id: "PAT-008", nom: "David Muteba", sexe: "M", age: 23, telephone: "+243 813 456 789", adresse: "Kindu, Q. Alunguli", groupe: "A+", statut: "Sorti", date: "2024-03-05" },
];

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("tous");

  const filtered = patientsData.filter(p => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "tous" || p.statut.toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Patients</h1>
          <p className="text-gray-500 text-sm mt-1">{patientsData.length} patients enregistrés</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nouveau Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: patientsData.length, color: "#3b82f6", bg: "#eff6ff" },
          { label: "Actifs", value: patientsData.filter(p => p.statut === "Actif").length, color: "#10b981", bg: "#f0fdf4" },
          { label: "Hospitalisés", value: patientsData.filter(p => p.statut === "Hospitalisé").length, color: "#f59e0b", bg: "#fffbeb" },
          { label: "Sortis", value: patientsData.filter(p => p.statut === "Sorti").length, color: "#6b7280", bg: "#f9fafb" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="flex-1 min-w-48">
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Rechercher par nom ou ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["tous", "actif", "hospitalisé", "sorti"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn btn-outline btn-sm">📥 Exporter</button>
          <button className="btn btn-outline btn-sm">🖨️ Imprimer</button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Patient</th>
                <th>Nom Complet</th>
                <th>Sexe</th>
                <th>Âge</th>
                <th>Téléphone</th>
                <th>Groupe Sanguin</th>
                <th>Statut</th>
                <th>Date Enreg.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{patient.id}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: patient.sexe === "F" ? "#fce7f3" : "#dbeafe", color: patient.sexe === "F" ? "#9d174d" : "#1e40af" }}>
                        {patient.nom.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{patient.nom}</div>
                        <div className="text-xs text-gray-400">{patient.adresse}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${patient.sexe === "F" ? "badge-danger" : "badge-info"}`}>
                      {patient.sexe === "F" ? "♀ Féminin" : "♂ Masculin"}
                    </span>
                  </td>
                  <td className="text-gray-600">{patient.age} ans</td>
                  <td className="text-gray-600 text-sm">{patient.telephone}</td>
                  <td>
                    <span className="badge badge-warning">{patient.groupe}</span>
                  </td>
                  <td>
                    <span className={`badge ${patient.statut === "Actif" ? "badge-success" : patient.statut === "Hospitalisé" ? "badge-warning" : "badge-gray"}`}>
                      {patient.statut}
                    </span>
                  </td>
                  <td className="text-gray-500 text-sm">{patient.date}</td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-outline btn-sm" title="Voir">👁️</button>
                      <button className="btn btn-outline btn-sm" title="Modifier">✏️</button>
                      <button className="btn btn-outline btn-sm" title="Consultation">🩺</button>
                      <button className="btn btn-outline btn-sm" title="Imprimer carte">🪪</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p>Aucun patient trouvé</p>
          </div>
        )}
      </div>

      {/* Modal Nouveau Patient */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Enregistrer un Nouveau Patient</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nom complet *</label>
                  <input type="text" className="form-input" placeholder="Nom et prénom" />
                </div>
                <div>
                  <label className="form-label">Sexe *</label>
                  <select className="form-input">
                    <option value="">Sélectionner</option>
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date de naissance *</label>
                  <input type="date" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Groupe sanguin</label>
                  <select className="form-input">
                    <option value="">Sélectionner</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Téléphone *</label>
                  <input type="tel" className="form-input" placeholder="+243 XXX XXX XXX" />
                </div>
                <div>
                  <label className="form-label">Adresse</label>
                  <input type="text" className="form-input" placeholder="Quartier, Commune" />
                </div>
                <div>
                  <label className="form-label">Contact d&apos;urgence</label>
                  <input type="text" className="form-input" placeholder="Nom et téléphone" />
                </div>
                <div>
                  <label className="form-label">Profession</label>
                  <input type="text" className="form-input" placeholder="Profession" />
                </div>
              </div>
              <div>
                <label className="form-label">Antécédents médicaux</label>
                <textarea className="form-input" rows={3} placeholder="Maladies chroniques, allergies..."></textarea>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1">
                  ✅ Enregistrer le Patient
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
