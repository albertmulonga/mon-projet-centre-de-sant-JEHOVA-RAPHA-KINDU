<?php
/**
 * Gestion des bons de sortie - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['medecin', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des bons de sortie
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'creer') {
        $patient_id = (int)$_POST['patient_id'];
        $hospitalisation_id = (int)$_POST['hospitalisation_id'] ?: null;
        $diagnostic_final = sanitize($_POST['diagnostic_final'] ?? '');
        $traitement_suivi = sanitize($_POST['traitement_suivi'] ?? '');
        $recommandations = sanitize($_POST['recommandations'] ?? '');
        $prochain_rdv = $_POST['prochain_rdv'] ?: null;
        $etat_sortie = $_POST['etat_sortie'] ?? 'gueri';
        $notes = sanitize($_POST['notes'] ?? '');
        
        if (empty($patient_id) || empty($diagnostic_final)) {
            $error = 'Veuillez remplir les champs obligatoires.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM bons_sortie");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'BS-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO bons_sortie (code, patient_id, hospitalisation_id, medecin_id, diagnostic_final, traitement_suivi, recommandations, prochain_rdv, etat_sortie, notes)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$code, $patient_id, $hospitalisation_id, $_SESSION['user_id'], $diagnostic_final, $traitement_suivi, $recommandations, $prochain_rdv, $etat_sortie, $notes]);
                
                // Mettre à jour le statut du patient
                $stmt = $pdo->prepare("UPDATE patients SET statut = 'sorti' WHERE id = ?");
                $stmt->execute([$patient_id]);
                
                $_SESSION['success'] = 'Bon de sortie créé avec succès!';
                redirect('bon-sortie.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
}

// Liste des patients hospitalisés pour création
$stmt = $pdo->query("
    SELECT h.id, h.code, p.id as patient_id, p.code as patient_code, CONCAT(p.prenom, ' ', p.nom) as patient_nom
    FROM hospitalisations h
    JOIN patients p ON h.patient_id = p.id
    WHERE h.statut = 'en_cours'
    ORDER BY h.date_entree DESC
");
$patients_hosp = $stmt->fetchAll();

// Liste des bons de sortie
$stmt = $pdo->query("
    SELECT b.*, p.code as patient_code, CONCAT(p.prenom, ' ', p.nom) as patient_nom, u.nom as medecin_nom
    FROM bons_sortie b
    JOIN patients p ON b.patient_id = p.id
    JOIN utilisateurs u ON b.medecin_id = u.id
    ORDER BY b.date_sortie DESC
");
$bons_sortie = $stmt->fetchAll();
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Bons de sortie</h1>
                    <p class="page-subtitle">Gestion des résumés de sortie et recommandations</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('bonSortieModal')">
                    ➕ Nouveau bon de sortie
                </button>
            </div>

            <!-- Patients hospitalisés pour bon de sortie -->
            <?php if (!empty($patients_hosp)): ?>
            <div class="alert alert-info mb-4">
                <span>ℹ️</span>
                <strong><?= count($patients_hosp) ?> patient(s)</strong> hospitalisé(s) prêt(s) pour un bon de sortie.
            </div>
            <?php endif; ?>

            <!-- Bons de sortie List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Historique des bons de sortie (<?= count($bons_sortie) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($bons_sortie)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">📋</div>
                            <h4 class="empty-state-title">Aucun bon de sortie</h4>
                            <p class="empty-state-text">Aucun bon de sortie enregistré.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Patient</th>
                                        <th>Date sortie</th>
                                        <th>Médecin</th>
                                        <th>État</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($bons_sortie as $bon): ?>
                                    <tr>
                                        <td><strong><?= sanitize($bon['code']) ?></strong></td>
                                        <td><?= sanitize($bon['patient_nom']) ?></td>
                                        <td><?= formatDateTime($bon['date_sortie']) ?></td>
                                        <td><?= sanitize($bon['medecin_nom']) ?></td>
                                        <td>
                                            <?php 
                                            $badges = [
                                                'gueri' => 'badge-success',
                                                'ameliore' => 'badge-info',
                                                'stationnaire' => 'badge-warning',
                                                'transfere' => 'badge-primary',
                                                'contre_avis_medical' => 'badge-danger',
                                                'decede' => 'badge-danger'
                                            ];
                                            ?>
                                            <span class="badge <?= $badges[$bon['etat_sortie']] ?? 'badge-gray' ?>">
                                                <?= str_replace('_', ' ', ucfirst($bon['etat_sortie'])) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-outline" onclick="viewBonSortie(<?= $bon['id'] ?>)">
                                                👁️ Voir
                                            </button>
                                            <button class="btn btn-sm btn-outline" onclick="printBonSortie(<?= $bon['id'] ?>)">
                                                🖨️
                                            </button>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- New Bon de Sortie Modal -->
            <div class="modal-overlay" id="bonSortieModal">
                <div class="modal" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Nouveau bon de sortie</h3>
                        <button class="modal-close" onclick="closeModal('bonSortieModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="creer">
                            
                            <div class="form-group">
                                <label class="form-label">Patient *</label>
                                <select name="patient_id" class="form-control form-select" required>
                                    <option value="">Sélectionner un patient</option>
                                    <?php foreach ($patients_hosp as $ph): ?>
                                    <option value="<?= $ph['patient_id'] ?>"><?= sanitize($ph['patient_code'] . ' - ' . $ph['patient_nom']) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <?php if (!empty($patients_hosp)): ?>
                            <div class="form-group">
                                <label class="form-label">Hospitalisation</label>
                                <select name="hospitalisation_id" class="form-control form-select">
                                    <option value="">Sélectionner (optionnel)</option>
                                    <?php foreach ($patients_hosp as $ph): ?>
                                    <option value="<?= $ph['id'] ?>"><?= sanitize($ph['code']) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <?php endif; ?>
                            
                            <div class="form-group">
                                <label class="form-label">Diagnostic final *</label>
                                <textarea name="diagnostic_final" class="form-control" rows="2" required placeholder="Diagnostic à la sortie"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Traitement suivi</label>
                                <textarea name="traitement_suivi" class="form-control" rows="2" placeholder="Traitement administré pendant le séjour"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Recommandations</label>
                                <textarea name="recommandations" class="form-control" rows="2" placeholder="Recommandations pour le patient"></textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Prochain rendez-vous</label>
                                    <input type="date" name="prochain_rdv" class="form-control">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">État à la sortie</label>
                                    <select name="etat_sortie" class="form-control form-select">
                                        <option value="gueri">Guéri</option>
                                        <option value="ameliore">Amélioré</option>
                                        <option value="stationnaire">Stationnaire</option>
                                        <option value="transfere">Transféré</option>
                                        <option value="contre_avis_medical">Contre avis médical</option>
                                        <option value="decede">Décédé</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Notes</label>
                                <textarea name="notes" class="form-control" rows="2" placeholder="Notes supplémentaires"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('bonSortieModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Créer le bon de sortie</button>
                        </div>
                    </form>
                </div>
            </div>

            <script>
                function viewBonSortie(id) {
                    alert('Fonctionnalité de visualisation en cours de développement');
                }
                
                function printBonSortie(id) {
                    alert('Fonctionnalité d\'impression en cours de développement');
                }
            </script>

<?php include __DIR__ . '/../partials/footer.php'; ?>
