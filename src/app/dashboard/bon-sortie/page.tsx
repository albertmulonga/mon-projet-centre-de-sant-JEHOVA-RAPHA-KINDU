"use client";
import { useState } from "react";

const bonsSortieData = [
  {
    id: "BS-001", patient: "Amina Lokwa", patientId: "PAT-003", medecin: "Dr. Mutombo",
    dateSortie: "2024-03-01", diagnostic: "Grossesse normale - 32 SA",
    traitement: "Fer + Acide folique, Calcium", recommandations: "Repos, alimentation équilibrée, prochain RDV dans 4 semaines",
    statut: "Signé"
  },
  {
    id: "BS-002", patient: "David Muteba", patientId: "PAT-008", medecin: "Dr. Kasongo",
    dateSortie: "2024-03-05", diagnostic: "Paludisme simple traité",
    traitement: "Artéméther-Luméfantrine 6 jours", recommandations: "Éviter l'exposition aux moustiques, moustiquaire imprégnée",
    statut: "Signé"
  },
  {
    id: "BS-003", patient: "Jean Mwamba", patientId: "PAT-002", medecin: "Dr. Kasongo",
    dateSortie: null, diagnostic: "HTA Grade 2 - En cours de traitement",
    traitement: "Amlodipine 5mg, Hydrochlorothiazide", recommandations: "",
    statut: "En cours"
  },
];

export default function BonSortiePage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBon, setSelectedBon] = useState<typeof bonsSortieData[0] | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bons de Sortie</h1>
          <p className="text-gray-500 text-sm mt-1">Résumés médicaux et recommandations de sortie</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nouveau Bon de Sortie
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Bons", value: bonsSortieData.length, icon: "📋", color: "#3b82f6" },
          { label: "Signés", value: bonsSortieData.filter(b => b.statut === "Signé").length, icon: "✅", color: "#10b981" },
          { label: "En cours", value: bonsSortieData.filter(b => b.statut === "En cours").length, icon: "⏳", color: "#f59e0b" },
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

      {/* List */}
      <div className="space-y-4">
        {bonsSortieData.map((bon) => (
          <div key={bon.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-blue-50">
                  📋
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-blue-600">{bon.id}</span>
                    <span className={`badge ${bon.statut === "Signé" ? "badge-success" : "badge-warning"}`}>{bon.statut}</span>
                  </div>
                  <div className="font-semibold text-gray-800 mt-1">{bon.patient}</div>
                  <div className="text-sm text-gray-500">{bon.patientId} · {bon.medecin}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{bon.dateSortie ? `Sortie: ${bon.dateSortie}` : "Sortie non définie"}</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setSelectedBon(bon)} className="btn btn-outline btn-sm">👁️ Voir</button>
                  <button className="btn btn-outline btn-sm">🖨️ Imprimer</button>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-yellow-50">
                <div className="text-xs text-yellow-600 font-medium mb-1">DIAGNOSTIC</div>
                <p className="text-sm text-gray-700">{bon.diagnostic}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <div className="text-xs text-green-600 font-medium mb-1">TRAITEMENT SUIVI</div>
                <p className="text-sm text-gray-700">{bon.traitement}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <div className="text-xs text-blue-600 font-medium mb-1">RECOMMANDATIONS</div>
                <p className="text-sm text-gray-700">{bon.recommandations || "—"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nouveau Bon de Sortie */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Créer un Bon de Sortie</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Patient *</label>
                  <select className="form-input">
                    <option>PAT-001 - Marie Kabila</option>
                    <option>PAT-002 - Jean Mwamba</option>
                    <option>PAT-006 - Robert Kalala</option>
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
                  <label className="form-label">Date de sortie *</label>
                  <input type="date" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Consultation liée</label>
                  <select className="form-input">
                    <option>CONS-001 - 2024-03-04</option>
                    <option>CONS-002 - 2024-03-04</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label">Résumé médical / Diagnostic final *</label>
                <textarea className="form-input" rows={3} placeholder="Résumé du séjour et diagnostic final..."></textarea>
              </div>
              <div>
                <label className="form-label">Traitement suivi</label>
                <textarea className="form-input" rows={2} placeholder="Médicaments et traitements administrés..."></textarea>
              </div>
              <div>
                <label className="form-label">Recommandations au patient</label>
                <textarea className="form-input" rows={3} placeholder="Conseils, restrictions, prochain rendez-vous..."></textarea>
              </div>
              <div>
                <label className="form-label">Prochain rendez-vous</label>
                <input type="date" className="form-input" />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">✅ Créer le Bon de Sortie</button>
                <button className="btn btn-outline">🖨️ Créer & Imprimer</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détail Bon de Sortie */}
      {selectedBon && (
        <div className="modal-overlay" onClick={() => setSelectedBon(null)}>
          <div className="modal-content" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Bon de Sortie — {selectedBon.id}</h2>
              <button onClick={() => setSelectedBon(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6">
              {/* En-tête du bon */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="text-3xl mb-2">🏥</div>
                <h3 className="text-xl font-bold text-gray-800">CENTRE MÉDICAL JÉHOVA RAPHA</h3>
                <p className="text-gray-500">Kindu, Maniema — RD Congo</p>
                <div className="mt-3 inline-block px-4 py-1 rounded-full text-sm font-semibold" style={{ background: "#eff6ff", color: "#1e40af" }}>
                  BON DE SORTIE — {selectedBon.id}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="text-xs text-gray-500 font-medium">PATIENT</div>
                  <div className="font-semibold text-gray-800">{selectedBon.patient}</div>
                  <div className="text-sm text-gray-500">{selectedBon.patientId}</div>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="text-xs text-gray-500 font-medium">MÉDECIN TRAITANT</div>
                  <div className="font-semibold text-gray-800">{selectedBon.medecin}</div>
                  <div className="text-sm text-gray-500">Date sortie: {selectedBon.dateSortie || "—"}</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                  <div className="text-xs text-yellow-700 font-semibold mb-2">DIAGNOSTIC FINAL</div>
                  <p className="text-gray-700">{selectedBon.diagnostic}</p>
                </div>
                <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                  <div className="text-xs text-green-700 font-semibold mb-2">TRAITEMENT SUIVI</div>
                  <p className="text-gray-700">{selectedBon.traitement}</p>
                </div>
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                  <div className="text-xs text-blue-700 font-semibold mb-2">RECOMMANDATIONS</div>
                  <p className="text-gray-700">{selectedBon.recommandations || "Aucune recommandation particulière"}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="text-center">
                  <div className="w-32 h-16 border-b-2 border-gray-400 mb-1"></div>
                  <div className="text-sm text-gray-600">Signature du Médecin</div>
                  <div className="text-sm font-medium text-gray-800">{selectedBon.medecin}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button className="btn btn-primary flex-1">🖨️ Imprimer</button>
                <button onClick={() => setSelectedBon(null)} className="btn btn-outline">Fermer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
