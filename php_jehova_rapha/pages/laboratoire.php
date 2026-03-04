<?php
/**
 * Gestion du laboratoire - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['laborantin', 'medecin', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des examens
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'save_examen') {
        $patient_id = (int)$_POST['patient_id'];
        $type_examen = sanitize($_POST['type_examen'] ?? '');
        
        if (empty($patient_id) || empty($type_examen)) {
            $error = 'Veuillez remplir tous les champs.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM examens_laboratoire");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'LAB-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO examens_laboratoire (code, patient_id, type_examen, statut)
                    VALUES (?, ?, ?, 'demande')
                ");
                $stmt->execute([$code, $patient_id, $type_examen]);
                
                $_SESSION['success'] = 'Examen demandé avec succès!';
                redirect('laboratoire.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
    
    if ($action === 'update_result') {
        $id = (int)$_POST['id'];
        $resultat = sanitize($_POST['resultat'] ?? '');
        $interpretation = sanitize($_POST['interpretation'] ?? '');
        
        try {
            $stmt = $pdo->prepare("
                UPDATE examens_laboratoire 
                SET resultat = ?, interpretation = ?, statut = 'resultat_disponible', date_resultat = NOW(), laborantin_id = ?
                WHERE id = ?
            ");
            $stmt->execute([$resultat, $interpretation, $_SESSION['user_id'], $id]);
            
            $_SESSION['success'] = 'Résultat enregistré avec succès!';
            redirect('laboratoire.php');
        } catch (PDOException $e) {
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
    
    if ($action === 'update_statut') {
        $id = (int)$_POST['id'];
        $statut = $_POST['statut'];
        
        try {
            $stmt = $pdo->prepare("UPDATE examens_laboratoire SET statut = ? WHERE id = ?");
            $stmt->execute([$statut, $id]);
            
            $_SESSION['success'] = 'Statut mis à jour!';
            redirect('laboratoire.php');
        } catch (PDOException $e) {
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
}

// Liste des patients
$stmt = $pdo->query("SELECT id, code, nom, prenom FROM patients WHERE statut = 'actif' ORDER BY nom, prenom");
$patients = $stmt->fetchAll();

// Liste des examens
$statut_filter = $_GET['statut'] ?? '';
$query = "
    SELECT e.*, p.code as patient_code, CONCAT(p.prenom, ' ', p.nom) as patient_nom
    FROM examens_laboratoire e
    JOIN patients p ON e.patient_id = p.id
    WHERE 1=1
";
$params = [];

if (!empty($statut_filter)) {
    $query .= " AND e.statut = ?";
    $params[] = $statut_filter;
}

$query .= " ORDER BY e.date_demande DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$examens = $stmt->fetchAll();
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Laboratoire</h1>
                    <p class="page-subtitle">Gestion des examens de laboratoire</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('examenModal')">
                    ➕ Demander un examen
                </button>
            </div>

            <!-- Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="search-bar" style="margin-bottom: 0;">
                        <div class="filter-group">
                            <a href="laboratoire.php" class="filter-btn <?= $statut_filter === '' ? 'active' : '' ?>">Tous</a>
                            <a href="?statut=demande" class="filter-btn <?= $statut_filter === 'demande' ? 'active' : '' ?>">En attente</a>
                            <a href="?statut=en_cours" class="filter-btn <?= $statut_filter === 'en_cours' ? 'active' : '' ?>">En cours</a>
                            <a href="?statut=resultat_disponible" class="filter-btn <?= $statut_filter === 'resultat_disponible' ? 'active' : : '' ?>">Résultats disponibles</a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Examens List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Examens (<?= count($examens) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($examens)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">🔬</div>
                            <h4 class="empty-state-title">Aucun examen</h4>
                            <p class="empty-state-text">Aucun examen trouvé.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Patient</th>
                                        <th>Type d'examen</th>
                                        <th>Date demande</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($examens as $examen): ?>
                                    <tr>
                                        <td><strong><?= sanitize($examen['code']) ?></strong></td>
                                        <td><?= sanitize($examen['patient_nom']) ?></td>
                                        <td><?= sanitize($examen['type_examen']) ?></td>
                                        <td><?= formatDateTime($examen['date_demande']) ?></td>
                                        <td>
                                            <?php 
                                            $badges = [
                                                'demande' => 'badge-warning',
                                                'en_cours' => 'badge-info',
                                                'resultat_disponible' => 'badge-success',
                                                'annule' => 'badge-danger'
                                            ];
                                            ?>
                                            <span class="badge <?= $badges[$examen['statut']] ?? 'badge-gray' ?>">
                                                <?= str_replace('_', ' ', ucfirst($examen['statut'])) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <?php if ($examen['statut'] === 'demande'): ?>
                                                <form method="POST" style="display: inline;">
                                                    <input type="hidden" name="action" value="update_statut">
                                                    <input type="hidden" name="id" value="<?= $examen['id'] ?>">
                                                    <input type="hidden" name="statut" value="en_cours">
                                                    <button type="submit" class="btn btn-sm btn-primary">Commencer</button>
                                                </form>
                                            <?php elseif ($examen['statut'] === 'en_cours'): ?>
                                                <button class="btn btn-sm btn-success" onclick="openModal('resultatModal<?= $examen['id'] ?>')">Saisir résultat</button>
                                            <?php else: ?>
                                                <button class="btn btn-sm btn-outline" onclick="alert('Résultat: <?= sanitize($examen['resultat']) ?>\n\nInterprétation: <?= sanitize($examen['interpretation'] ?? 'Aucune') ?>')">Voir résultat</button>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- New Exam Modal -->
            <div class="modal-overlay" id="examenModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Demander un examen</h3>
                        <button class="modal-close" onclick="closeModal('examenModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="save_examen">
                            
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
                                <label class="form-label">Type d'examen *</label>
                                <select name="type_examen" class="form-control form-select" required>
                                    <option value="">Sélectionner le type</option>
                                    <option value="NFS">NFS (Numération Formule Sanguine)</option>
                                    <option value="Glycémie">Glycémie</option>
                                    <option value="Test Paludisme (TDR)">Test Paludisme (TDR)</option>
                                    <option value="Créatinine">Créatinine</option>
                                    <option value="Urée">Urée</option>
                                    <option value="Fonction hépatique">Fonction hépatique (ASAT/ALAT)</option>
                                    <option value="Lipidogramme">Lipidogramme</option>
                                    <option value="Groupe sanguin">Groupe sanguin</option>
                                    <option value="Test de Coombs">Test de Coombs</option>
                                    <option value="Sérologie HIV">Sérologie HIV</option>
                                    <option value="Hépatite B">Hépatite B</option>
                                    <option value="Hépatite C">Hépatite C</option>
                                    <option value="Syphilis">Syphilis (VDRL)</option>
                                    <option value="Typhoïde">Typhoïde (Widal)</option>
                                    <option value="Parasitologie selles">Parasitologie selles</option>
                                    <option value="ECBU">ECBU (Examen cytobactériologique des urines)</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('examenModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Result Modals -->
            <?php foreach ($examens as $examen): ?>
            <?php if ($examen['statut'] === 'en_cours'): ?>
            <div class="modal-overlay" id="resultatModal<?= $examen['id'] ?>">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Saisir le résultat - <?= sanitize($examen['code']) ?></h3>
                        <button class="modal-close" onclick="closeModal('resultatModal<?= $examen['id'] ?>')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="update_result">
                            <input type="hidden" name="id" value="<?= $examen['id'] ?>">
                            
                            <div class="form-group">
                                <label class="form-label">Patient</label>
                                <p><?= sanitize($examen['patient_nom']) ?></p>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Type d'examen</label>
                                <p><?= sanitize($examen['type_examen']) ?></p>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Résultat</label>
                                <textarea name="resultat" class="form-control" rows="4" required placeholder="Saisir les résultats de l'examen"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Interprétation</label>
                                <textarea name="interpretation" class="form-control" rows="2" placeholder="Interprétation clinique (optionnel)"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('resultatModal<?= $examen['id'] ?>')">Annuler</button>
                            <button type="submit" class="btn btn-success">Enregistrer le résultat</button>
                        </div>
                    </form>
                </div>
            </div>
            <?php endif; ?>
            <?php endforeach; ?>

<?php include __DIR__ . '/../partials/footer.php'; ?>
