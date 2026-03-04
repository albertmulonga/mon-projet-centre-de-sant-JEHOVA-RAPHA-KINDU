<?php
/**
 * Gestion de l'hospitalisation - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['medecin', 'infirmier', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des hospitalisations
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'admettre') {
        $patient_id = (int)$_POST['patient_id'];
        $chambre_id = (int)$_POST['chambre_id'];
        $motif = sanitize($_POST['motif'] ?? '');
        $date_sortie_prevue = $_POST['date_sortie_prevue'] ?: null;
        
        if (empty($patient_id) || empty($chambre_id) || empty($motif)) {
            $error = 'Veuillez remplir tous les champs.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM hospitalisations");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'HOSP-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            $pdo->beginTransaction();
            try {
                // Créer l'hospitalisation
                $stmt = $pdo->prepare("
                    INSERT INTO hospitalisations (code, patient_id, chambre_id, medecin_id, motif, date_sortie_prevue, statut)
                    VALUES (?, ?, ?, ?, ?, ?, 'en_cours')
                ");
                $stmt->execute([$code, $patient_id, $chambre_id, $_SESSION['user_id'], $motif, $date_sortie_prevue]);
                
                // Mettre à jour le statut de la chambre
                $stmt = $pdo->prepare("UPDATE chambres SET statut = 'occupee' WHERE id = ?");
                $stmt->execute([$chambre_id]);
                
                $pdo->commit();
                $_SESSION['success'] = 'Patient admis avec succès!';
                redirect('hospitalisation.php');
            } catch (PDOException $e) {
                $pdo->rollBack();
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
    
    if ($action === 'sortie') {
        $id = (int)$_POST['id'];
        $chambre_id = (int)$_POST['chambre_id'];
        
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("UPDATE hospitalisations SET statut = 'sorti', date_sortie_reelle = NOW() WHERE id = ?");
            $stmt->execute([$id]);
            
            $stmt = $pdo->prepare("UPDATE chambres SET statut = 'libre' WHERE id = ?");
            $stmt->execute([$chambre_id]);
            
            $pdo->commit();
            $_SESSION['success'] = 'Patient sorti avec succès!';
            redirect('hospitalisation.php');
        } catch (PDOException $e) {
            $pdo->rollBack();
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
    
    if ($action === 'save_chambre') {
        $numero = sanitize($_POST['numero'] ?? '');
        $type = $_POST['type'] ?? 'standard';
        $capacite = (int)$_POST['capacite'];
        $prix_par_nuit = (float)$_POST['prix_par_nuit'];
        $etage = (int)$_POST['etage'];
        $description = sanitize($_POST['description'] ?? '');
        
        if (empty($numero)) {
            $error = 'Veuillez remplir le numéro de chambre.';
        } else {
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO chambres (numero, type, capacite, prix_par_nuit, etage, description)
                    VALUES (?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$numero, $type, $capacite, $prix_par_nuit, $etage, $description]);
                
                $_SESSION['success'] = 'Chambre créée avec succès!';
                redirect('hospitalisation.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
}

// Liste des patients pour admission
$stmt = $pdo->query("SELECT id, code, nom, prenom FROM patients WHERE statut = 'actif' ORDER BY nom, prenom");
$patients = $stmt->fetchAll();

// Chambres disponibles
$stmt = $pdo->query("SELECT * FROM chambres WHERE statut = 'libre' ORDER BY numero");
$chambres_libres = $stmt->fetchAll();

// Toutes les chambres
$stmt = $pdo->query("SELECT * FROM chambres ORDER BY numero");
$chambres = $stmt->fetchAll();

// Hospitalisations en cours
$stmt = $pdo->query("
    SELECT h.*, p.code as patient_code, CONCAT(p.prenom, ' ', p.nom) as patient_nom, 
           c.numero as chambre_numero, c.prix_par_nuit, u.nom as medecin_nom
    FROM hospitalisations h
    JOIN patients p ON h.patient_id = p.id
    JOIN chambres c ON h.chambre_id = c.id
    JOIN utilisateurs u ON h.medecin_id = u.id
    WHERE h.statut = 'en_cours'
    ORDER BY h.date_entree DESC
");
$hospitalisations = $stmt->fetchAll();

// Statistiques
$stmt = $pdo->query("SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN statut = 'libre' THEN 1 ELSE 0 END) as libres,
    SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) as occupees
    FROM chambres");
$stats_chambres = $stmt->fetch();
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Hospitalisation</h1>
                    <p class="page-subtitle">Gestion des chambres et des patients hospitalisés</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('admissionModal')">
                    ➕ Admettre un patient
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid mb-4">
                <div class="stat-card">
                    <div class="stat-icon green">🏨</div>
                    <div class="stat-content">
                        <div class="stat-label">Chambres totales</div>
                        <div class="stat-value"><?= $stats_chambres['total'] ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon blue">✅</div>
                    <div class="stat-content">
                        <div class="stat-label">Chambres libres</div>
                        <div class="stat-value"><?= $stats_chambres['libres'] ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🛏️</div>
                    <div class="stat-content">
                        <div class="stat-label">Chambres occupées</div>
                        <div class="stat-value"><?= $stats_chambres['occupyes'] ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">👥</div>
                    <div class="stat-content">
                        <div class="stat-label">Patients hospitalisés</div>
                        <div class="stat-value"><?= count($hospitalisations) ?></div>
                    </div>
                </div>
            </div>

            <!-- Chambres Grid -->
            <div class="card mb-4">
                <div class="card-header">
                    <h3 class="card-title">État des chambres</h3>
                    <button class="btn btn-sm btn-outline" onclick="openModal('chambreModal')">➕ Ajouter une chambre</button>
                </div>
                <div class="card-body">
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem;">
                        <?php foreach ($chambres as $chambre): ?>
                        <div style="padding: 1rem; border-radius: 8px; background: <?= $chambre['statut'] === 'libre' ? '#d1fae5' : ($chambre['statut'] === 'occupee' ? '#fee2e2' : '#fef3c7'); ?>; text-align: center;">
                            <div style="font-size: 2rem;"><?= $chambre['statut'] === 'libre' ? '🟢' : ($chambre['statut'] === 'occupee' ? '🔴' : '🟡') ?></div>
                            <div style="font-weight: 600;">Chambre <?= sanitize($chambre['numero']) ?></div>
                            <div style="font-size: 0.875rem;"><?= ucfirst($chambre['type']) ?></div>
                            <div style="font-size: 0.75rem; color: #666;"><?= formatCurrency($chambre['prix_par_nuit']) ?>/nuit</div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Hospitalisations en cours -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Patients hospitalisés (<?= count($hospitalisations) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($hospitalisations)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">🏨</div>
                            <h4 class="empty-state-title">Aucun patient hospitalisé</h4>
                            <p class="empty-state-text">Tous les patients sont sortis.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Patient</th>
                                        <th>Chambre</th>
                                        <th>Médecin</th>
                                        <th>Date entrée</th>
                                        <th>Durée</th>
                                        <th>Coût jour</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                    foreach ($hospitalisations as $hosp): 
                                        $date_entree = new DateTime($hosp['date_entree']);
                                        $now = new DateTime();
                                        $duree = $date_entree->diff($now)->days;
                                        $cout_total = $duree * $hosp['prix_par_nuit'];
                                    ?>
                                    <tr>
                                        <td><strong><?= sanitize($hosp['code']) ?></strong></td>
                                        <td><?= sanitize($hosp['patient_nom']) ?></td>
                                        <td>Ch. <?= sanitize($hosp['chambre_numero']) ?></td>
                                        <td><?= sanitize($hosp['medecin_nom']) ?></td>
                                        <td><?= formatDateTime($hosp['date_entree']) ?></td>
                                        <td><?= $duree ?> jours</td>
                                        <td><?= formatCurrency($cout_total) ?></td>
                                        <td>
                                            <form method="POST" style="display: inline;" onsubmit="return confirmAction('Confirmer la sortie du patient?');">
                                                <input type="hidden" name="action" value="sortie">
                                                <input type="hidden" name="id" value="<?= $hosp['id'] ?>">
                                                <input type="hidden" name="chambre_id" value="<?= $hosp['chambre_id'] ?>">
                                                <button type="submit" class="btn btn-sm btn-success">Sortie</button>
                                            </form>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Admission Modal -->
            <div class="modal-overlay" id="admissionModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Admettre un patient</h3>
                        <button class="modal-close" onclick="closeModal('admissionModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="admettre">
                            
                            <div class="form-group">
                                <label class="form-label">Patient *</label>
                                <select name="patient_id" class="form-control form-select" required>
                                    <option value="">Sélectionner un patient</option>
                                    <?php foreach ($patients as $patient): ?>
                                    <option value="<?= $patient['id'] ?>"><?= sanitize($patient['code'] . ' - ' . $patient['prenom'] . ' ' . $patient['nom']) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Chambre *</label>
                                <select name="chambre_id" class="form-control form-select" required>
                                    <option value="">Sélectionner une chambre</option>
                                    <?php foreach ($chambres_libres as $chambre): ?>
                                    <option value="<?= $chambre['id'] ?>">Chambre <?= sanitize($chambre['numero']) ?> - <?= ucfirst($chambre['type']) ?> (<?= formatCurrency($chambre['prix_par_nuit']) ?>/nuit)</option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Motif d'hospitalisation *</label>
                                <textarea name="motif" class="form-control" rows="2" required placeholder="Raison de l'hospitalisation"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Date de sortie prévue</label>
                                <input type="date" name="date_sortie_prevue" class="form-control">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('admissionModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Admettre</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- New Chambre Modal -->
            <div class="modal-overlay" id="chambreModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Nouvelle chambre</h3>
                        <button class="modal-close" onclick="closeModal('chambreModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="save_chambre">
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Numéro *</label>
                                    <input type="text" name="numero" class="form-control" required placeholder="Ex: 101">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Type</label>
                                    <select name="type" class="form-control form-select">
                                        <option value="standard">Standard</option>
                                        <option value="vip">VIP</option>
                                        <option value="urgence">Urgence</option>
                                        <option value="pediatrie">Pédiatrie</option>
                                        <option value="maternite">Maternité</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Capacité</label>
                                    <input type="number" name="capacite" class="form-control" value="1" min="1">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Prix par nuit (FC)</label>
                                    <input type="number" name="prix_par_nuit" class="form-control" value="15000" min="0">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Étage</label>
                                <input type="number" name="etage" class="form-control" value="1" min="1">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Description</label>
                                <textarea name="description" class="form-control" rows="2" placeholder="Description supplémentaire"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('chambreModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

<?php include __DIR__ . '/../partials/footer.php'; ?>
