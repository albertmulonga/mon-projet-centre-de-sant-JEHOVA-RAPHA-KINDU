"use client";
import { useState } from "react";

const consultationsData = [
  { id: "CONS-001", patient: "Marie Kabila", patientId: "PAT-001", medecin: "Dr. Mutombo", date: "2024-03-04", heure: "08:30", motif: "Fièvre persistante", diagnostic: "Paludisme", statut: "Terminée", prescriptions: 3 },
  { id: "CONS-002", patient: "Jean Mwamba", patientId: "PAT-002", medecin: "Dr. Kasongo", date: "2024-03-04", heure: "09:00", motif: "Hypertension", diagnostic: "HTA Grade 2", statut: "En cours", prescriptions: 2 },
  { id: "CONS-003", patient: "Sophie Tshala", patientId: "PAT-005", medecin: "Dr. Mutombo", date: "2024-03-04", heure: "09:30", motif: "Maux de tête", diagnostic: "Migraine", statut: "En attente", prescriptions: 0 },
  { id: "CONS-004", patient: "Pierre Ngoy", patientId: "PAT-004", medecin: "Dr. Kasongo", date: "2024-03-03", heure: "10:00", motif: "Diabète - suivi", diagnostic: "Diabète type 2", statut: "Terminée", prescriptions: 4 },
  { id: "CONS-005", patient: "Fatima Mbaya", patientId: "PAT-007", medecin: "Dr. Mutombo", date: "2024-03-03", heure: "11:00", motif: "Douleurs abdominales", diagnostic: "Gastrite", statut: "Terminée", prescriptions: 2 },
];

export default function ConsultationsPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState<typeof consultationsData[0] | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Consultations Médicales</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des consultations et prescriptions</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nouvelle Consultation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Aujourd'hui", value: "28", icon: "📅", color: "#3b82f6" },
          { label: "En cours", value: "5", icon: "⏳", color: "#f59e0b" },
          { label: "En attente", value: "8", icon: "🕐", color: "#ef4444" },
          { label: "Terminées", value: "15", icon: "✅", color: "#10b981" },
        ].map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input type="text" className="form-input max-w-xs" placeholder="🔍 Rechercher..." />
          <div className="flex gap-2">
            <select className="form-input w-auto">
              <option>Tous les médecins</option>
              <option>Dr. Mutombo</option>
              <option>Dr. Kasongo</option>
            </select>
            <input type="date" className="form-input w-auto" defaultValue="2024-03-04" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Médecin</th>
                <th>Date & Heure</th>
                <th>Motif</th>
                <th>Diagnostic</th>
                <th>Prescriptions</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {consultationsData.map((c) => (
                <tr key={c.id}>
                  <td><span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{c.id}</span></td>
                  <td>
                    <div className="font-medium text-gray-800">{c.patient}</div>
                    <div className="text-xs text-gray-400">{c.patientId}</div>
                  </td>
                  <td className="text-gray-600 text-sm">{c.medecin}</td>
                  <td>
                    <div className="text-sm text-gray-700">{c.date}</div>
                    <div className="text-xs text-gray-400">{c.heure}</div>
                  </td>
                  <td className="text-gray-600">{c.motif}</td>
                  <td>
                    {c.diagnostic ? (
                      <span className="badge badge-info">{c.diagnostic}</span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td>
                    {c.prescriptions > 0 ? (
                      <span className="badge badge-success">{c.prescriptions} prescriptions</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Aucune</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${c.statut === "Terminée" ? "badge-success" : c.statut === "En cours" ? "badge-warning" : "badge-danger"}`}>
                      {c.statut}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedConsult(c)} className="btn btn-outline btn-sm">👁️</button>
                      <button className="btn btn-outline btn-sm">✏️</button>
                      <button className="btn btn-outline btn-sm">💊</button>
                      <button className="btn btn-outline btn-sm">🖨️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvelle Consultation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Nouvelle Consultation</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Patient *</label>
                  <select className="form-input">
                    <option value="">Sélectionner un patient</option>
                    <option>PAT-001 - Marie Kabila</option>
                    <option>PAT-002 - Jean Mwamba</option>
                    <option>PAT-004 - Pierre Ngoy</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Médecin *</label>
                  <select className="form-input">
                    <option>Dr. Mutombo</option>
                    <option>Dr. Kasongo</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Heure</label>
                  <input type="time" className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Motif de consultation *</label>
                <input type="text" className="form-input" placeholder="Raison de la visite" />
              </div>
              <div>
                <label className="form-label">Symptômes</label>
                <textarea className="form-input" rows={2} placeholder="Décrire les symptômes..."></textarea>
              </div>
              <div>
                <label className="form-label">Diagnostic</label>
                <input type="text" className="form-input" placeholder="Diagnostic médical" />
              </div>
              <div>
                <label className="form-label">Traitement proposé</label>
                <textarea className="form-input" rows={2} placeholder="Traitement recommandé..."></textarea>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" />
                  <span className="text-sm">🔬 Prescrire examen</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" />
                  <span className="text-sm">💊 Prescrire médicaments</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" />
                  <span className="text-sm">🏨 Hospitaliser</span>
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1">✅ Enregistrer</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail Consultation */}
      {selectedConsult && (
        <div className="modal-overlay" onClick={() => setSelectedConsult(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Détail Consultation — {selectedConsult.id}</h2>
              <button onClick={() => setSelectedConsult(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="text-xs text-blue-500 font-medium mb-1">PATIENT</div>
                  <div className="font-semibold text-gray-800">{selectedConsult.patient}</div>
                  <div className="text-sm text-gray-500">{selectedConsult.patientId}</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="text-xs text-green-500 font-medium mb-1">MÉDECIN</div>
                  <div className="font-semibold text-gray-800">{selectedConsult.medecin}</div>
                  <div className="text-sm text-gray-500">{selectedConsult.date} à {selectedConsult.heure}</div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-500 font-medium mb-2">MOTIF</div>
                <p className="text-gray-700">{selectedConsult.motif}</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-50">
                <div className="text-xs text-yellow-600 font-medium mb-2">DIAGNOSTIC</div>
                <p className="text-gray-700 font-medium">{selectedConsult.diagnostic || "Non défini"}</p>
              </div>
              <div className="flex gap-3">
                <button className="btn btn-primary flex-1">🖨️ Imprimer Ordonnance</button>
                <button className="btn btn-success flex-1">🧾 Générer Facture</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
