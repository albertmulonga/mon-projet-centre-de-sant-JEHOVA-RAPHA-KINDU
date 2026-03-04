"use client";
import { useState } from "react";

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paramètres du Système</h1>
          <p className="text-gray-500 text-sm mt-1">Configuration du Centre Médical Jéhova Rapha</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            ✅ Paramètres sauvegardés
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {[
              { id: "general", icon: "🏥", label: "Informations Générales" },
              { id: "tarifs", icon: "💰", label: "Tarifs & Prix" },
              { id: "chambres", icon: "🏨", label: "Types de Chambres" },
              { id: "notifications", icon: "🔔", label: "Notifications" },
              { id: "sauvegarde", icon: "💾", label: "Sauvegarde" },
              { id: "securite", icon: "🔐", label: "Sécurité" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all border-l-2 ${activeTab === tab.id ? "bg-blue-50 text-blue-700 border-blue-500 font-medium" : "text-gray-600 border-transparent hover:bg-gray-50"}`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Informations de l&apos;Établissement</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Nom de l&apos;établissement</label>
                    <input type="text" className="form-input" defaultValue="Centre Médical Jéhova Rapha de Kindu" />
                  </div>
                  <div>
                    <label className="form-label">Abréviation</label>
                    <input type="text" className="form-input" defaultValue="CMJRK" />
                  </div>
                  <div>
                    <label className="form-label">Adresse</label>
                    <input type="text" className="form-input" defaultValue="Kindu, Maniema, RD Congo" />
                  </div>
                  <div>
                    <label className="form-label">Téléphone</label>
                    <input type="tel" className="form-input" defaultValue="+243 XXX XXX XXX" />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue="info@jehova-rapha.cd" />
                  </div>
                  <div>
                    <label className="form-label">Site Web</label>
                    <input type="url" className="form-input" defaultValue="www.jehova-rapha.cd" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Devise</label>
                  <select className="form-input w-auto">
                    <option value="FC">Franc Congolais (FC)</option>
                    <option value="USD">Dollar Américain (USD)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Horaires d&apos;ouverture</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Ouverture</label>
                      <input type="time" className="form-input" defaultValue="07:00" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Fermeture</label>
                      <input type="time" className="form-input" defaultValue="20:00" />
                    </div>
                  </div>
                </div>
                <button onClick={handleSave} className="btn btn-primary">💾 Sauvegarder</button>
              </div>
            </div>
          )}

          {activeTab === "tarifs" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Tarifs des Prestations</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700 text-sm">Consultations</div>
                  <div className="p-4 space-y-3">
                    {[
                      { label: "Consultation générale", value: "2000" },
                      { label: "Consultation spécialisée", value: "5000" },
                      { label: "Consultation urgence", value: "3000" },
                      { label: "Consultation pédiatrique", value: "2500" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">{item.label}</label>
                        <div className="flex items-center gap-2">
                          <input type="number" className="form-input w-28" defaultValue={item.value} />
                          <span className="text-sm text-gray-500">FC</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700 text-sm">Laboratoire</div>
                  <div className="p-4 space-y-3">
                    {[
                      { label: "NFS (Numération Formule Sanguine)", value: "3000" },
                      { label: "Glycémie", value: "1500" },
                      { label: "Test paludisme (TDR)", value: "2000" },
                      { label: "Sérologie VIH", value: "5000" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">{item.label}</label>
                        <div className="flex items-center gap-2">
                          <input type="number" className="form-input w-28" defaultValue={item.value} />
                          <span className="text-sm text-gray-500">FC</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleSave} className="btn btn-primary">💾 Sauvegarder les Tarifs</button>
              </div>
            </div>
          )}

          {activeTab === "chambres" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Configuration des Chambres</h2>
              <div className="space-y-4">
                {[
                  { type: "VIP", prix: "5000", capacite: "1", description: "Chambre individuelle avec salle de bain privée" },
                  { type: "Standard", prix: "2000", capacite: "2", description: "Chambre partagée avec équipements de base" },
                  { type: "Urgence", prix: "3000", capacite: "1", description: "Chambre d'urgence avec monitoring" },
                  { type: "Maternité", prix: "3500", capacite: "1", description: "Chambre spécialisée pour accouchements" },
                ].map((chambre) => (
                  <div key={chambre.type} className="p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-700">Chambre {chambre.type}</h3>
                      <span className={`badge ${chambre.type === "VIP" ? "badge-warning" : chambre.type === "Urgence" ? "badge-danger" : "badge-info"}`}>{chambre.type}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="form-label text-xs">Prix/jour (FC)</label>
                        <input type="number" className="form-input" defaultValue={chambre.prix} />
                      </div>
                      <div>
                        <label className="form-label text-xs">Capacité (lits)</label>
                        <input type="number" className="form-input" defaultValue={chambre.capacite} />
                      </div>
                      <div>
                        <label className="form-label text-xs">Description</label>
                        <input type="text" className="form-input" defaultValue={chambre.description} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={handleSave} className="btn btn-primary">💾 Sauvegarder</button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Paramètres de Notifications</h2>
              <div className="space-y-4">
                {[
                  { label: "Alerte stock médicament faible", desc: "Notifier quand le stock passe sous le minimum", enabled: true },
                  { label: "Rappel rendez-vous patient", desc: "Envoyer SMS de rappel 24h avant", enabled: false },
                  { label: "Résultat laboratoire disponible", desc: "Notifier le médecin prescripteur", enabled: true },
                  { label: "Facture impayée", desc: "Rappel automatique après 7 jours", enabled: true },
                  { label: "Rapport journalier", desc: "Envoyer résumé quotidien à l'admin", enabled: false },
                ].map((notif) => (
                  <div key={notif.label} className="flex items-center justify-between p-4 rounded-xl border border-gray-200">
                    <div>
                      <div className="font-medium text-gray-700">{notif.label}</div>
                      <div className="text-sm text-gray-400">{notif.desc}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
                <button onClick={handleSave} className="btn btn-primary">💾 Sauvegarder</button>
              </div>
            </div>
          )}

          {activeTab === "sauvegarde" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Sauvegarde des Données</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <div className="font-semibold text-green-700">Dernière sauvegarde réussie</div>
                      <div className="text-sm text-green-600">2024-03-04 à 02:00 — Taille: 45.2 MB</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="btn btn-primary">💾 Sauvegarder Maintenant</button>
                  <button className="btn btn-outline">📥 Restaurer une Sauvegarde</button>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 font-medium text-gray-700 text-sm">Historique des Sauvegardes</div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { date: "2024-03-04 02:00", taille: "45.2 MB", statut: "Succès" },
                      { date: "2024-03-03 02:00", taille: "44.8 MB", statut: "Succès" },
                      { date: "2024-03-02 02:00", taille: "44.1 MB", statut: "Succès" },
                    ].map((backup, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3">
                        <div className="text-sm text-gray-600">{backup.date}</div>
                        <div className="text-sm text-gray-500">{backup.taille}</div>
                        <span className="badge badge-success">{backup.statut}</span>
                        <button className="btn btn-outline btn-sm">📥 Restaurer</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "securite" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">Paramètres de Sécurité</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3">Politique de Mot de Passe</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Longueur minimale", type: "number", value: "8" },
                      { label: "Expiration (jours)", type: "number", value: "90" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">{item.label}</label>
                        <input type={item.type} className="form-input w-24" defaultValue={item.value} />
                      </div>
                    ))}
                    {[
                      { label: "Majuscules requises", enabled: true },
                      { label: "Chiffres requis", enabled: true },
                      { label: "Caractères spéciaux requis", enabled: false },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <label className="text-sm text-gray-600">{item.label}</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-3">Sessions</h3>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600">Durée de session (minutes)</label>
                    <input type="number" className="form-input w-24" defaultValue="60" />
                  </div>
                </div>
                <button onClick={handleSave} className="btn btn-primary">💾 Sauvegarder</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
