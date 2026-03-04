"use client";
import { useState } from "react";

const facturesData = [
  {
    id: "FAC-001", patient: "Marie Kabila", patientId: "PAT-001", date: "2024-03-04",
    consultation: 2000, examens: 5000, medicaments: 3500, hospitalisation: 6000,
    total: 16500, paye: 10000, statut: "Partiel"
  },
  {
    id: "FAC-002", patient: "Jean Mwamba", patientId: "PAT-002", date: "2024-03-03",
    consultation: 2000, examens: 8000, medicaments: 5000, hospitalisation: 15000,
    total: 30000, paye: 30000, statut: "Payé"
  },
  {
    id: "FAC-003", patient: "Sophie Tshala", patientId: "PAT-005", date: "2024-03-04",
    consultation: 2000, examens: 3000, medicaments: 2000, hospitalisation: 0,
    total: 7000, paye: 0, statut: "Impayé"
  },
  {
    id: "FAC-004", patient: "Pierre Ngoy", patientId: "PAT-004", date: "2024-03-03",
    consultation: 2000, examens: 12000, medicaments: 8000, hospitalisation: 0,
    total: 22000, paye: 22000, statut: "Payé"
  },
  {
    id: "FAC-005", patient: "Fatima Mbaya", patientId: "PAT-007", date: "2024-03-02",
    consultation: 2000, examens: 4000, medicaments: 3000, hospitalisation: 0,
    total: 9000, paye: 5000, statut: "Partiel"
  },
];

export default function FacturesPage() {
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<typeof facturesData[0] | null>(null);

  const totalRevenu = facturesData.reduce((sum, f) => sum + f.paye, 0);
  const totalImpaye = facturesData.reduce((sum, f) => sum + (f.total - f.paye), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Facturation</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des factures et paiements</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nouvelle Facture
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Factures", value: facturesData.length, icon: "🧾", color: "#3b82f6" },
          { label: "Payées", value: facturesData.filter(f => f.statut === "Payé").length, icon: "✅", color: "#10b981" },
          { label: "Revenus Encaissés", value: `${totalRevenu.toLocaleString()} FC`, icon: "💰", color: "#10b981" },
          { label: "Montant Impayé", value: `${totalImpaye.toLocaleString()} FC`, icon: "⚠️", color: "#ef4444" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <input type="text" className="form-input max-w-xs" placeholder="🔍 Rechercher une facture..." />
          <div className="flex gap-2">
            <select className="form-input w-auto">
              <option>Tous les statuts</option>
              <option>Payé</option>
              <option>Partiel</option>
              <option>Impayé</option>
            </select>
            <button className="btn btn-outline btn-sm">📥 Exporter</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>N° Facture</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Consultation</th>
                <th>Examens</th>
                <th>Médicaments</th>
                <th>Hospitalisation</th>
                <th>Total</th>
                <th>Payé</th>
                <th>Reste</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facturesData.map((facture) => (
                <tr key={facture.id}>
                  <td><span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">{facture.id}</span></td>
                  <td>
                    <div className="font-medium text-gray-800">{facture.patient}</div>
                    <div className="text-xs text-gray-400">{facture.patientId}</div>
                  </td>
                  <td className="text-gray-500 text-sm">{facture.date}</td>
                  <td className="text-gray-600 text-sm">{facture.consultation.toLocaleString()} FC</td>
                  <td className="text-gray-600 text-sm">{facture.examens.toLocaleString()} FC</td>
                  <td className="text-gray-600 text-sm">{facture.medicaments.toLocaleString()} FC</td>
                  <td className="text-gray-600 text-sm">{facture.hospitalisation > 0 ? `${facture.hospitalisation.toLocaleString()} FC` : "—"}</td>
                  <td className="font-bold text-gray-800">{facture.total.toLocaleString()} FC</td>
                  <td className="font-semibold text-green-600">{facture.paye.toLocaleString()} FC</td>
                  <td className={`font-semibold ${facture.total - facture.paye > 0 ? "text-red-600" : "text-green-600"}`}>
                    {(facture.total - facture.paye).toLocaleString()} FC
                  </td>
                  <td>
                    <span className={`badge ${facture.statut === "Payé" ? "badge-success" : facture.statut === "Partiel" ? "badge-warning" : "badge-danger"}`}>
                      {facture.statut}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => { setSelectedFacture(facture); }} className="btn btn-outline btn-sm">👁️</button>
                      {facture.statut !== "Payé" && (
                        <button onClick={() => { setSelectedFacture(facture); setShowPayModal(true); }} className="btn btn-success btn-sm">💰</button>
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

      {/* Modal Nouvelle Facture */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" style={{ maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Générer une Facture</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Patient *</label>
                  <select className="form-input">
                    <option>PAT-001 - Marie Kabila</option>
                    <option>PAT-002 - Jean Mwamba</option>
                    <option>PAT-005 - Sophie Tshala</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" />
                </div>
              </div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-700 text-sm">Détail des Prestations</div>
                <div className="p-4 space-y-3">
                  {[
                    { label: "Consultation médicale", placeholder: "0" },
                    { label: "Examens de laboratoire", placeholder: "0" },
                    { label: "Médicaments", placeholder: "0" },
                    { label: "Hospitalisation", placeholder: "0" },
                    { label: "Autres frais", placeholder: "0" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-4">
                      <label className="flex-1 text-sm text-gray-600">{item.label}</label>
                      <div className="flex items-center gap-2">
                        <input type="number" className="form-input w-32" placeholder={item.placeholder} />
                        <span className="text-sm text-gray-500">FC</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 px-4 py-3 flex justify-between items-center">
                  <span className="font-bold text-gray-700">TOTAL</span>
                  <span className="font-bold text-blue-700 text-lg">0 FC</span>
                </div>
              </div>
              <div>
                <label className="form-label">Mode de paiement</label>
                <select className="form-input">
                  <option>Espèces</option>
                  <option>Mobile Money</option>
                  <option>Virement</option>
                  <option>Assurance</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">✅ Générer la Facture</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Paiement */}
      {showPayModal && selectedFacture && (
        <div className="modal-overlay" onClick={() => setShowPayModal(false)}>
          <div className="modal-content" style={{ maxWidth: "450px" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Enregistrer un Paiement</h2>
              <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Facture</span>
                  <span className="font-semibold">{selectedFacture.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Patient</span>
                  <span className="font-semibold">{selectedFacture.patient}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-gray-800">{selectedFacture.total.toLocaleString()} FC</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Déjà payé</span>
                  <span className="font-semibold text-green-600">{selectedFacture.paye.toLocaleString()} FC</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-700">Reste à payer</span>
                  <span className="font-bold text-red-600">{(selectedFacture.total - selectedFacture.paye).toLocaleString()} FC</span>
                </div>
              </div>
              <div>
                <label className="form-label">Montant à payer *</label>
                <input type="number" className="form-input" placeholder={`Max: ${(selectedFacture.total - selectedFacture.paye).toLocaleString()} FC`} />
              </div>
              <div>
                <label className="form-label">Mode de paiement</label>
                <select className="form-input">
                  <option>Espèces</option>
                  <option>Mobile Money</option>
                  <option>Virement</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-success flex-1">💰 Confirmer le Paiement</button>
                <button type="button" onClick={() => setShowPayModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
