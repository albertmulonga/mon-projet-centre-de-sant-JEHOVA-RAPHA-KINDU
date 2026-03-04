"use client";
import { useState } from "react";

const examensData = [
  { id: "LAB-001", patient: "Marie Kabila", patientId: "PAT-001", type: "Numération Formule Sanguine", prescrit: "Dr. Mutombo", date: "2024-03-04", statut: "Résultat disponible", resultat: "Hémoglobine: 10.2 g/dL, Leucocytes: 12000/mm³", observation: "Anémie légère, leucocytose" },
  { id: "LAB-002", patient: "Jean Mwamba", patientId: "PAT-002", type: "Glycémie à jeun", prescrit: "Dr. Kasongo", date: "2024-03-04", statut: "En cours", resultat: "", observation: "" },
  { id: "LAB-003", patient: "Sophie Tshala", patientId: "PAT-005", type: "Test de grossesse", prescrit: "Dr. Mutombo", date: "2024-03-04", statut: "En attente", resultat: "", observation: "" },
  { id: "LAB-004", patient: "Pierre Ngoy", patientId: "PAT-004", type: "HbA1c", prescrit: "Dr. Kasongo", date: "2024-03-03", statut: "Résultat disponible", resultat: "HbA1c: 8.5%", observation: "Diabète mal contrôlé" },
  { id: "LAB-005", patient: "Fatima Mbaya", patientId: "PAT-007", type: "Sérologie Hépatite B", prescrit: "Dr. Mutombo", date: "2024-03-03", statut: "Résultat disponible", resultat: "AgHBs: Négatif", observation: "Résultat normal" },
];

const typesExamens = [
  "Numération Formule Sanguine", "Glycémie à jeun", "Glycémie post-prandiale", "HbA1c",
  "Créatinine", "Urée", "ASAT/ALAT", "Bilirubine", "Test de grossesse",
  "Sérologie Hépatite B", "Sérologie Hépatite C", "Test VIH", "Paludisme (TDR)",
  "ECBU", "Coproculture", "Radiographie", "Échographie"
];

export default function LaboratoirePage() {
  const [showModal, setShowModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<typeof examensData[0] | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Laboratoire</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des examens et résultats</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nouvel Examen
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Examens", value: examensData.length, icon: "🔬", color: "#8b5cf6" },
          { label: "En attente", value: examensData.filter(e => e.statut === "En attente").length, icon: "⏳", color: "#f59e0b" },
          { label: "En cours", value: examensData.filter(e => e.statut === "En cours").length, icon: "🔄", color: "#3b82f6" },
          { label: "Résultats disponibles", value: examensData.filter(e => e.statut === "Résultat disponible").length, icon: "✅", color: "#10b981" },
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

      {/* Types d'examens disponibles */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Types d&apos;Examens Disponibles</h3>
        <div className="flex flex-wrap gap-2">
          {typesExamens.map((type) => (
            <span key={type} className="badge badge-info">{type}</span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Liste des Examens</h3>
          <div className="flex gap-2">
            <input type="text" className="form-input max-w-xs" placeholder="🔍 Rechercher..." />
            <select className="form-input w-auto">
              <option>Tous les statuts</option>
              <option>En attente</option>
              <option>En cours</option>
              <option>Résultat disponible</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Type d&apos;Examen</th>
                <th>Prescrit par</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Résultat</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {examensData.map((exam) => (
                <tr key={exam.id}>
                  <td><span className="font-mono text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">{exam.id}</span></td>
                  <td>
                    <div className="font-medium text-gray-800">{exam.patient}</div>
                    <div className="text-xs text-gray-400">{exam.patientId}</div>
                  </td>
                  <td className="font-medium text-gray-700">{exam.type}</td>
                  <td className="text-gray-600 text-sm">{exam.prescrit}</td>
                  <td className="text-gray-500 text-sm">{exam.date}</td>
                  <td>
                    <span className={`badge ${exam.statut === "Résultat disponible" ? "badge-success" : exam.statut === "En cours" ? "badge-info" : "badge-warning"}`}>
                      {exam.statut}
                    </span>
                  </td>
                  <td>
                    {exam.resultat ? (
                      <span className="text-sm text-gray-600 max-w-xs truncate block">{exam.resultat.substring(0, 30)}...</span>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedExam(exam); setShowResultModal(true); }} className="btn btn-outline btn-sm">👁️</button>
                      {exam.statut !== "Résultat disponible" && (
                        <button className="btn btn-success btn-sm">+ Résultat</button>
                      )}
                      <button className="btn btn-outline btn-sm">🖨️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nouvel Examen */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Demande d&apos;Examen</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Patient *</label>
                  <select className="form-input">
                    <option>PAT-001 - Marie Kabila</option>
                    <option>PAT-002 - Jean Mwamba</option>
                    <option>PAT-004 - Pierre Ngoy</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Médecin prescripteur *</label>
                  <select className="form-input">
                    <option>Dr. Mutombo</option>
                    <option>Dr. Kasongo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Type d&apos;examen *</label>
                <select className="form-input">
                  <option value="">Sélectionner le type</option>
                  {typesExamens.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Urgence</label>
                <select className="form-input">
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Très urgent</option>
                </select>
              </div>
              <div>
                <label className="form-label">Notes / Instructions</label>
                <textarea className="form-input" rows={3} placeholder="Instructions particulières..."></textarea>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">✅ Enregistrer la Demande</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Résultat */}
      {showResultModal && selectedExam && (
        <div className="modal-overlay" onClick={() => setShowResultModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Résultat — {selectedExam.id}</h2>
              <button onClick={() => setShowResultModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="text-xs text-purple-500 font-medium">PATIENT</div>
                  <div className="font-semibold">{selectedExam.patient}</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="text-xs text-blue-500 font-medium">EXAMEN</div>
                  <div className="font-semibold">{selectedExam.type}</div>
                </div>
              </div>
              {selectedExam.resultat ? (
                <>
                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <div className="text-xs text-green-600 font-medium mb-2">RÉSULTAT</div>
                    <p className="text-gray-700">{selectedExam.resultat}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-50">
                    <div className="text-xs text-yellow-600 font-medium mb-2">OBSERVATION</div>
                    <p className="text-gray-700">{selectedExam.observation}</p>
                  </div>
                </>
              ) : (
                <form className="space-y-4">
                  <div>
                    <label className="form-label">Résultat *</label>
                    <textarea className="form-input" rows={4} placeholder="Entrer les résultats de l'examen..."></textarea>
                  </div>
                  <div>
                    <label className="form-label">Observation</label>
                    <textarea className="form-input" rows={2} placeholder="Observations du laborantin..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-success w-full">✅ Enregistrer le Résultat</button>
                </form>
              )}
              <button className="btn btn-outline w-full">🖨️ Imprimer le Résultat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
