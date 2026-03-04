"use client";
import { useState } from "react";

const chambresData = [
  { id: "CH-001", numero: "101", type: "VIP", etage: "1er", capacite: 1, occupee: true, patient: "Jean Mwamba", patientId: "PAT-002", dateEntree: "2024-03-01", prixJour: 5000, medecin: "Dr. Kasongo" },
  { id: "CH-002", numero: "102", type: "VIP", etage: "1er", capacite: 1, occupee: false, patient: null, patientId: null, dateEntree: null, prixJour: 5000, medecin: null },
  { id: "CH-003", numero: "103", type: "VIP", etage: "1er", capacite: 1, occupee: true, patient: "Robert Kalala", patientId: "PAT-006", dateEntree: "2024-03-02", prixJour: 5000, medecin: "Dr. Mutombo" },
  { id: "CH-004", numero: "201", type: "Standard", etage: "2ème", capacite: 2, occupee: true, patient: "Marie Kabila", patientId: "PAT-001", dateEntree: "2024-03-03", prixJour: 2000, medecin: "Dr. Mutombo" },
  { id: "CH-005", numero: "202", type: "Standard", etage: "2ème", capacite: 2, occupee: false, patient: null, patientId: null, dateEntree: null, prixJour: 2000, medecin: null },
  { id: "CH-006", numero: "203", type: "Standard", etage: "2ème", capacite: 2, occupee: false, patient: null, patientId: null, dateEntree: null, prixJour: 2000, medecin: null },
  { id: "CH-007", numero: "URG-01", type: "Urgence", etage: "RDC", capacite: 1, occupee: true, patient: "Sophie Tshala", patientId: "PAT-005", dateEntree: "2024-03-04", prixJour: 3000, medecin: "Dr. Kasongo" },
  { id: "CH-008", numero: "URG-02", type: "Urgence", etage: "RDC", capacite: 1, occupee: false, patient: null, patientId: null, dateEntree: null, prixJour: 3000, medecin: null },
];

function calculateDays(dateEntree: string | null): number {
  if (!dateEntree) return 0;
  const diff = new Date().getTime() - new Date(dateEntree).getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function HospitalisationPage() {
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState("tous");

  const filtered = chambresData.filter(c => filterType === "tous" || c.type.toLowerCase() === filterType.toLowerCase());
  const occupees = chambresData.filter(c => c.occupee).length;
  const libres = chambresData.filter(c => !c.occupee).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hospitalisation</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des chambres et séjours</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Hospitaliser un Patient
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Chambres", value: chambresData.length, icon: "🏨", color: "#3b82f6" },
          { label: "Occupées", value: occupees, icon: "🔴", color: "#ef4444" },
          { label: "Libres", value: libres, icon: "🟢", color: "#10b981" },
          { label: "Taux Occupation", value: `${Math.round((occupees/chambresData.length)*100)}%`, icon: "📊", color: "#8b5cf6" },
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

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["tous", "VIP", "Standard", "Urgence"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === f ? "bg-blue-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode("grid")} className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline"}`}>⊞ Grille</button>
          <button onClick={() => setViewMode("list")} className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline"}`}>☰ Liste</button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((chambre) => {
            const jours = calculateDays(chambre.dateEntree);
            const cout = jours * chambre.prixJour;
            return (
              <div key={chambre.id} className={`rounded-xl p-4 border-2 transition-all hover:shadow-md ${chambre.occupee ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold text-gray-700">#{chambre.numero}</div>
                  <span className={`badge ${chambre.occupee ? "badge-danger" : "badge-success"}`}>
                    {chambre.occupee ? "Occupée" : "Libre"}
                  </span>
                </div>
                <div className="mb-2">
                  <span className={`badge ${chambre.type === "VIP" ? "badge-warning" : chambre.type === "Urgence" ? "badge-danger" : "badge-info"}`}>
                    {chambre.type}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">{chambre.etage}</span>
                </div>
                {chambre.occupee && chambre.patient ? (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="font-medium text-gray-800 text-sm">{chambre.patient}</div>
                    <div className="text-xs text-gray-500">{chambre.patientId}</div>
                    <div className="text-xs text-gray-500 mt-1">Entrée: {chambre.dateEntree}</div>
                    <div className="text-xs font-semibold text-blue-600 mt-1">{jours} jour(s) · {cout.toLocaleString()} FC</div>
                    <div className="flex gap-1 mt-2">
                      <button className="btn btn-outline btn-sm flex-1">Sortie</button>
                      <button className="btn btn-outline btn-sm">🧾</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500 mb-2">{chambre.prixJour.toLocaleString()} FC/jour</div>
                    <button onClick={() => setShowModal(true)} className="btn btn-success btn-sm w-full">Attribuer</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Chambre</th>
                  <th>Type</th>
                  <th>Étage</th>
                  <th>Patient</th>
                  <th>Médecin</th>
                  <th>Date Entrée</th>
                  <th>Durée</th>
                  <th>Coût</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((chambre) => {
                  const jours = calculateDays(chambre.dateEntree);
                  const cout = jours * chambre.prixJour;
                  return (
                    <tr key={chambre.id}>
                      <td className="font-bold text-gray-700">#{chambre.numero}</td>
                      <td><span className={`badge ${chambre.type === "VIP" ? "badge-warning" : chambre.type === "Urgence" ? "badge-danger" : "badge-info"}`}>{chambre.type}</span></td>
                      <td className="text-gray-500 text-sm">{chambre.etage}</td>
                      <td>
                        {chambre.patient ? (
                          <div>
                            <div className="font-medium text-gray-800">{chambre.patient}</div>
                            <div className="text-xs text-gray-400">{chambre.patientId}</div>
                          </div>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="text-gray-500 text-sm">{chambre.medecin || "—"}</td>
                      <td className="text-gray-500 text-sm">{chambre.dateEntree || "—"}</td>
                      <td className="text-gray-700">{chambre.occupee ? `${jours} jour(s)` : "—"}</td>
                      <td className="font-semibold text-blue-600">{chambre.occupee ? `${cout.toLocaleString()} FC` : "—"}</td>
                      <td><span className={`badge ${chambre.occupee ? "badge-danger" : "badge-success"}`}>{chambre.occupee ? "Occupée" : "Libre"}</span></td>
                      <td>
                        <div className="flex gap-1">
                          {chambre.occupee ? (
                            <>
                              <button className="btn btn-outline btn-sm">Sortie</button>
                              <button className="btn btn-outline btn-sm">🧾</button>
                            </>
                          ) : (
                            <button onClick={() => setShowModal(true)} className="btn btn-success btn-sm">Attribuer</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Hospitalisation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Hospitaliser un Patient</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Patient *</label>
                  <select className="form-input">
                    <option>PAT-001 - Marie Kabila</option>
                    <option>PAT-004 - Pierre Ngoy</option>
                    <option>PAT-007 - Fatima Mbaya</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Chambre *</label>
                  <select className="form-input">
                    <option>CH-002 - Chambre 102 (VIP) - 5000 FC/j</option>
                    <option>CH-005 - Chambre 202 (Standard) - 2000 FC/j</option>
                    <option>CH-006 - Chambre 203 (Standard) - 2000 FC/j</option>
                    <option>CH-008 - URG-02 (Urgence) - 3000 FC/j</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Médecin responsable *</label>
                  <select className="form-input">
                    <option>Dr. Mutombo</option>
                    <option>Dr. Kasongo</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Date d&apos;entrée *</label>
                  <input type="date" className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Motif d&apos;hospitalisation *</label>
                <textarea className="form-input" rows={2} placeholder="Raison de l'hospitalisation..."></textarea>
              </div>
              <div>
                <label className="form-label">Diagnostic initial</label>
                <input type="text" className="form-input" placeholder="Diagnostic" />
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-sm font-medium text-blue-700 mb-1">💡 Calcul automatique</div>
                <p className="text-xs text-blue-600">Le coût sera calculé automatiquement selon la durée du séjour et le type de chambre.</p>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">✅ Confirmer l&apos;Hospitalisation</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
