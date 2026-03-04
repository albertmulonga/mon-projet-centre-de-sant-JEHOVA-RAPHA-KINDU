<?php
/**
 * Gestion des consultations - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['medecin', 'infirmier', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement du formulaire
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'list';
    
    if ($action === 'save') {
        $patient_id = (int)$_POST['patient_id'];
        $motif = sanitize($_POST['motif'] ?? '');
        $symptomes = sanitize($_POST['symptomes'] ?? '');
        $diagnostic = sanitize($_POST['diagnostic'] ?? '');
        $traitement = sanitize($_POST['traitement'] ?? '');
        $observations = sanitize($_POST['observations'] ?? '');
        $tension = sanitize($_POST['tension'] ?? '');
        $temperature = sanitize($_POST['temperature'] ?? '');
        $poids = sanitize($_POST['poids'] ?? '');
        $taille = sanitize($_POST['taille'] ?? '');
        
        if (empty($patient_id) || empty($motif)) {
            $error = 'Veuillez remplir les champs obligatoires.';
        } else {
            // Générer le code consultation
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM consultations");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'CONS-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO consultations (code, patient_id, medecin_id, motif, symptomes, diagnostic, traitement, observations, tension, temperature, poids, taille, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'terminee')
                ");
                $stmt->execute([$code, $patient_id, $_SESSION['user_id'], $motif, $symptomes, $diagnostic, $traitement, $observations, $tension, $temperature, $poids, $taille]);
                
                // Sauvegarder les prescriptions
                if (!empty($_POST['medicaments'])) {
                    $consultationId = $pdo->lastInsertId();
                    foreach ($_POST['medicaments'] as $medicament) {
                        if (!empty($medicament['nom'])) {
                            $stmt = $pdo->prepare("
                                INSERT INTO ordonnances (consultation_id, medicament_nom, dosage, frequence, duree, instructions)
                                VALUES (?, ?, ?, ?, ?, ?)
                            ");
                            $stmt->execute([
                                $consultationId,
                                sanitize($medicament['nom']),
                                sanitize($medicament['dosage']),
                                sanitize($medicament['frequence']),
                                sanitize($medicament['duree']),
                                sanitize($medicament['instructions'])
                            ]);
                        }
                    }
                }
                
                $_SESSION['success'] = 'Consultation enregistrée avec succès!';
                redirect('consultations.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
}

// Liste des patients pour le select
$stmt = $pdo->query("SELECT id, code, nom, prenom FROM patients WHERE statut = 'actif' ORDER BY nom, prenom");
$patients = $stmt->fetchAll();

// Liste des consultations
$search = $_GET['search'] ?? '';
$date_filter = $_GET['date'] ?? '';

$query = "
    SELECT c.*, p.code as patient_code, CONCAT(p.prenom, ' ', p.nom) as patient_nom, u.nom as medecin_nom
    FROM consultations c
    JOIN patients p ON c.patient_id = p.id
    JOIN utilisateurs u ON c.medecin_id = u.id
    WHERE 1=1
";
$params = [];

if (!empty($search)) {
    $query .= " AND (p.nom LIKE ? OR p.prenom LIKE ? OR c.motif LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
}

if (!empty($date_filter)) {
    $query .= " AND DATE(c.date_consultation) = ?";
    $params[] = $date_filter;
}

$query .= " ORDER BY c.date_consultation DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$consultations = $stmt->fetchAll();
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Consultations</h1>
                    <p class="page-subtitle">Gestion des consultations médicales</p>
                </div>
                <?php if (canAccess(['medecin'])): ?>
                <button class="btn btn-primary" onclick="openModal('consultationModal')">
                    ➕ Nouvelle consultation
                </button>
                <?php endif; ?>
            </div>

            <!-- Search -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="search-bar" style="margin-bottom: 0;">
                        <div class="search-input" style="flex: 2;">
                            <input type="text" name="search" placeholder="Rechercher un patient ou motif..." 
                                   value="<?= sanitize($search) ?>">
                        </div>
                        <div class="filter-group">
                            <input type="date" name="date" class="form-control" value="<?= sanitize($date_filter) ?>" style="width: auto;">
                            <button type="submit" class="btn btn-primary">Rechercher</button>
                            <a href="consultations.php" class="btn btn-outline">Réinitialiser</a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Consultations List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Historique des consultations (<?= count($consultations) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($consultations)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">🩺</div>
                            <h4 class="empty-state-title">Aucune consultation</h4>
                            <p class="empty-state-text">Aucune consultation trouvée.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Patient</th>
                                        <th>Motif</th>
                                        <th>Médecin</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($consultations as $consult): ?>
                                    <tr>
                                        <td><strong><?= sanitize($consult['code']) ?></strong></td>
                                        <td><?= sanitize($consult['patient_nom']) ?></td>
                                        <td><?= sanitize($consult['motif']) ?></td>
                                        <td><?= sanitize($consult['medecin_nom']) ?></td>
                                        <td><?= formatDateTime($consult['date_consultation']) ?></td>
                                        <td>
                                            <?php 
                                            $badges = [
                                                'en_attente' => 'badge-warning',
                                                'en_cours' => 'badge-info',
                                                'terminee' => 'badge-success',
                                                'annulee' => 'badge-danger'
                                            ];
                                            ?>
                                            <span class="badge <?= $badges[$consult['statut']] ?? 'badge-gray' ?>">
                                                <?= ucfirst($consult['statut']) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-outline" onclick="viewConsultation(<?= $consult['id'] ?>)" title="Voir détails">
                                                👁️
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

            <!-- Consultation Modal -->
            <?php if (canAccess(['medecin'])): ?>
            <div class="modal-overlay" id="consultationModal">
                <div class="modal" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Nouvelle consultation</h3>
                        <button class="modal-close" onclick="closeModal('consultationModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="save">
                            
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
                                <label class="form-label">Motif de consultation *</label>
                                <input type="text" name="motif" class="form-control" required placeholder="Raison de la visite">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Température (°C)</label>
                                    <input type="text" name="temperature" class="form-control" placeholder="37.5">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Tension</label>
                                    <input type="text" name="tension" class="form-control" placeholder="120/80">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Poids (kg)</label>
                                    <input type="text" name="poids" class="form-control" placeholder="70">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Taille (cm)</label>
                                    <input type="text" name="taille" class="form-control" placeholder="170">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Symptômes</label>
                                <textarea name="symptomes" class="form-control" rows="2" placeholder="Description des symptômes"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Diagnostic</label>
                                <textarea name="diagnostic" class="form-control" rows="2" placeholder="Diagnostic établi"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Traitement prescrit</label>
                                <textarea name="traitement" class="form-control" rows="2" placeholder="Traitement prescrit"></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Observations</label>
                                <textarea name="observations" class="form-control" rows="2" placeholder="Observations supplémentaires"></textarea>
                            </div>
                            
                            <hr>
                            <h4>Prescriptions (Ordonnance)</h4>
                            <div id="prescriptions-container">
                                <div class="prescription-row" style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
                                    <input type="text" name="medicaments[0][nom]" class="form-control" placeholder="Médicament">
                                    <input type="text" name="medicaments[0][dosage]" class="form-control" placeholder="Dosage">
                                    <input type="text" name="medicaments[0][frequence]" class="form-control" placeholder="Fréquence">
                                    <input type="text" name="medicaments[0][duree]" class="form-control" placeholder="Durée">
                                </div>
                            </div>
                            <button type="button" class="btn btn-sm btn-outline" onclick="addPrescription()">➕ Ajouter un médicament</button>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('consultationModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
            <?php endif; ?>

            <script>
                let prescriptionCount = 1;
                function addPrescription() {
                    const container = document.getElementById('prescriptions-container');
                    const div = document.createElement('div');
                    div.className = 'prescription-row';
                    div.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;';
                    div.innerHTML = `
                        <input type="text" name="medicaments[${prescriptionCount}][nom]" class="form-control" placeholder="Médicament">
                        <input type="text" name="medicaments[${prescriptionCount}][dosage]" class="form-control" placeholder="Dosage">
                        <input type="text" name="medicaments[${prescriptionCount}][frequence]" class="form-control" placeholder="Fréquence">
                        <input type="text" name="medicaments[${prescriptionCount}][duree]" class="form-control" placeholder="Durée">
                    `;
                    container.appendChild(div);
                    prescriptionCount++;
                }
                
                function viewConsultation(id) {
                    alert('Fonctionnalité de détail en cours de développement');
                }
            </script>

<?php include __DIR__ . '/../partials/footer.php'; ?>
