"use client";
import { useState } from "react";

const medicamentsData = [
  { id: "MED-001", nom: "Paracétamol 500mg", categorie: "Analgésique", forme: "Comprimé", stock: 15, stockMin: 50, prixUnit: 50, fournisseur: "Pharma Congo", expiration: "2025-06-30", statut: "Critique" },
  { id: "MED-002", nom: "Amoxicilline 250mg", categorie: "Antibiotique", forme: "Gélule", stock: 28, stockMin: 50, prixUnit: 150, fournisseur: "MediSupply", expiration: "2025-12-31", statut: "Faible" },
  { id: "MED-003", nom: "Quinine 300mg", categorie: "Antipaludéen", forme: "Comprimé", stock: 8, stockMin: 30, prixUnit: 200, fournisseur: "Pharma Congo", expiration: "2025-09-30", statut: "Critique" },
  { id: "MED-004", nom: "Métronidazole 250mg", categorie: "Antibiotique", forme: "Comprimé", stock: 35, stockMin: 50, prixUnit: 100, fournisseur: "MediSupply", expiration: "2026-03-31", statut: "Faible" },
  { id: "MED-005", nom: "Ibuprofène 400mg", categorie: "Anti-inflammatoire", forme: "Comprimé", stock: 120, stockMin: 50, prixUnit: 75, fournisseur: "Pharma Congo", expiration: "2026-06-30", statut: "Normal" },
  { id: "MED-006", nom: "Oméprazole 20mg", categorie: "Gastro-entérologie", forme: "Gélule", stock: 85, stockMin: 30, prixUnit: 250, fournisseur: "MediSupply", expiration: "2025-11-30", statut: "Normal" },
  { id: "MED-007", nom: "Amlodipine 5mg", categorie: "Cardiovasculaire", forme: "Comprimé", stock: 60, stockMin: 40, prixUnit: 300, fournisseur: "Pharma Congo", expiration: "2026-01-31", statut: "Normal" },
  { id: "MED-008", nom: "Metformine 500mg", categorie: "Antidiabétique", forme: "Comprimé", stock: 45, stockMin: 50, prixUnit: 180, fournisseur: "MediSupply", expiration: "2025-08-31", statut: "Faible" },
];

const mouvementsData = [
  { date: "2024-03-04", type: "Sortie", medicament: "Paracétamol 500mg", quantite: 30, patient: "PAT-001", motif: "Prescription" },
  { date: "2024-03-04", type: "Entrée", medicament: "Ibuprofène 400mg", quantite: 100, patient: "—", motif: "Réapprovisionnement" },
  { date: "2024-03-03", type: "Sortie", medicament: "Amoxicilline 250mg", quantite: 21, patient: "PAT-003", motif: "Prescription" },
  { date: "2024-03-03", type: "Sortie", medicament: "Quinine 300mg", quantite: 15, patient: "PAT-005", motif: "Prescription" },
];

export default function MedicamentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("stock");

  const critiques = medicamentsData.filter(m => m.statut === "Critique").length;
  const faibles = medicamentsData.filter(m => m.statut === "Faible").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pharmacie & Médicaments</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion du stock et des dispensations</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline">📥 Entrée Stock</button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">+ Nouveau Médicament</button>
        </div>
      </div>

      {/* Alertes */}
      {(critiques > 0 || faibles > 0) && (
        <div className="mb-6 p-4 rounded-xl border" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⚠️</span>
            <span className="font-semibold text-red-700">Alertes de Stock</span>
          </div>
          <p className="text-red-600 text-sm">
            {critiques} médicament(s) en stock critique · {faibles} médicament(s) en stock faible
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Médicaments", value: medicamentsData.length, icon: "💊", color: "#3b82f6" },
          { label: "Stock Normal", value: medicamentsData.filter(m => m.statut === "Normal").length, icon: "✅", color: "#10b981" },
          { label: "Stock Faible", value: faibles, icon: "⚠️", color: "#f59e0b" },
          { label: "Stock Critique", value: critiques, icon: "🚨", color: "#ef4444" },
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

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { id: "stock", label: "📦 Stock" },
          { id: "mouvements", label: "🔄 Mouvements" },
          { id: "prescriptions", label: "📋 Prescriptions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-white shadow text-blue-600" : "text-gray-600 hover:text-gray-800"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "stock" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <input type="text" className="form-input max-w-xs" placeholder="🔍 Rechercher un médicament..." />
            <select className="form-input w-auto">
              <option>Toutes catégories</option>
              <option>Analgésique</option>
              <option>Antibiotique</option>
              <option>Antipaludéen</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Médicament</th>
                  <th>Catégorie</th>
                  <th>Forme</th>
                  <th>Stock Actuel</th>
                  <th>Stock Min.</th>
                  <th>Prix Unitaire</th>
                  <th>Expiration</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicamentsData.map((med) => (
                  <tr key={med.id}>
                    <td><span className="font-mono text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{med.id}</span></td>
                    <td>
                      <div className="font-medium text-gray-800">{med.nom}</div>
                      <div className="text-xs text-gray-400">{med.fournisseur}</div>
                    </td>
                    <td><span className="badge badge-info">{med.categorie}</span></td>
                    <td className="text-gray-600 text-sm">{med.forme}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden" style={{ minWidth: "60px" }}>
                          <div className="h-full rounded-full" style={{
                            width: `${Math.min((med.stock / (med.stockMin * 2)) * 100, 100)}%`,
                            background: med.statut === "Critique" ? "#ef4444" : med.statut === "Faible" ? "#f59e0b" : "#10b981"
                          }}></div>
                        </div>
                        <span className="font-semibold text-sm">{med.stock}</span>
                      </div>
                    </td>
                    <td className="text-gray-500 text-sm">{med.stockMin}</td>
                    <td className="font-medium text-gray-700">{med.prixUnit} FC</td>
                    <td className="text-gray-500 text-sm">{med.expiration}</td>
                    <td>
                      <span className={`badge ${med.statut === "Normal" ? "badge-success" : med.statut === "Faible" ? "badge-warning" : "badge-danger"}`}>
                        {med.statut}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="btn btn-outline btn-sm">✏️</button>
                        <button className="btn btn-success btn-sm">📥</button>
                        <button className="btn btn-outline btn-sm">📤</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "mouvements" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700">Historique des Mouvements</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Médicament</th>
                  <th>Quantité</th>
                  <th>Patient</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                {mouvementsData.map((m, i) => (
                  <tr key={i}>
                    <td className="text-gray-500 text-sm">{m.date}</td>
                    <td>
                      <span className={`badge ${m.type === "Entrée" ? "badge-success" : "badge-danger"}`}>
                        {m.type === "Entrée" ? "📥" : "📤"} {m.type}
                      </span>
                    </td>
                    <td className="font-medium text-gray-700">{m.medicament}</td>
                    <td className="font-bold text-gray-800">{m.quantite}</td>
                    <td className="text-gray-500 text-sm">{m.patient}</td>
                    <td className="text-gray-500 text-sm">{m.motif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "prescriptions" && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Prescriptions en attente de validation</h3>
          <p className="text-gray-500 mb-4">3 prescriptions attendent votre validation</p>
          <button className="btn btn-primary">Voir les prescriptions</button>
        </div>
      )}

      {/* Modal Nouveau Médicament */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Ajouter un Médicament</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Nom du médicament *</label>
                  <input type="text" className="form-input" placeholder="Nom + dosage" />
                </div>
                <div>
                  <label className="form-label">Catégorie *</label>
                  <select className="form-input">
                    <option>Analgésique</option>
                    <option>Antibiotique</option>
                    <option>Antipaludéen</option>
                    <option>Anti-inflammatoire</option>
                    <option>Cardiovasculaire</option>
                    <option>Antidiabétique</option>
                    <option>Gastro-entérologie</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Forme pharmaceutique</label>
                  <select className="form-input">
                    <option>Comprimé</option>
                    <option>Gélule</option>
                    <option>Sirop</option>
                    <option>Injectable</option>
                    <option>Pommade</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Prix unitaire (FC) *</label>
                  <input type="number" className="form-input" placeholder="0" />
                </div>
                <div>
                  <label className="form-label">Stock initial *</label>
                  <input type="number" className="form-input" placeholder="0" />
                </div>
                <div>
                  <label className="form-label">Stock minimum *</label>
                  <input type="number" className="form-input" placeholder="0" />
                </div>
                <div>
                  <label className="form-label">Date d&apos;expiration</label>
                  <input type="date" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Fournisseur</label>
                  <input type="text" className="form-input" placeholder="Nom du fournisseur" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn btn-primary flex-1">✅ Enregistrer</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
