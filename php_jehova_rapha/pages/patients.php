<?php
/**
 * Gestion des patients - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['medecin', 'infirmier', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();
$message = '';
$error = '';

// Traitement du formulaire d'ajout/modification de patient
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'list';
    
    if ($action === 'save') {
        $nom = sanitize($_POST['nom'] ?? '');
        $prenom = sanitize($_POST['prenom'] ?? '');
        $date_naissance = $_POST['date_naissance'] ?? '';
        $sexe = $_POST['sexe'] ?? '';
        $adresse = sanitize($_POST['adresse'] ?? '');
        $telephone = sanitize($_POST['telephone'] ?? '');
        $groupe_sanguin = $_POST['groupe_sanguin'] ?? 'Inconnu';
        $allergies = sanitize($_POST['allergies'] ?? '');
        $antecedents = sanitize($_POST['antecedents'] ?? '');
        $contact_urgence_nom = sanitize($_POST['contact_urgence_nom'] ?? '');
        $contact_urgence_tel = sanitize($_POST['contact_urgence_tel'] ?? '');
        
        if (empty($nom) || empty($prenom) || empty($date_naissance) || empty($sexe)) {
            $error = 'Veuillez remplir tous les champs obligatoires.';
        } else {
            // Générer le code patient
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM patients");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'PAT-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO patients (code, nom, prenom, date_naissance, sexe, adresse, telephone, groupe_sanguin, allergies, antecedents, contact_urgence_nom, contact_urgence_tel)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$code, $nom, $prenom, $date_naissance, $sexe, $adresse, $telephone, $groupe_sanguin, $allergies, $antecedents, $contact_urgence_nom, $contact_urgence_tel]);
                
                $_SESSION['success'] = 'Patient enregistré avec succès!';
                redirect('patients.php');
            } catch (PDOException $e) {
                $error = 'Erreur lors de l\'enregistrement: ' . $e->getMessage();
            }
        }
    }
    
    if ($action === 'update') {
        $id = (int)$_POST['id'];
        $nom = sanitize($_POST['nom'] ?? '');
        $prenom = sanitize($_POST['prenom'] ?? '');
        $date_naissance = $_POST['date_naissance'] ?? '';
        $sexe = $_POST['sexe'] ?? '';
        $adresse = sanitize($_POST['adresse'] ?? '');
        $telephone = sanitize($_POST['telephone'] ?? '');
        $groupe_sanguin = $_POST['groupe_sanguin'] ?? 'Inconnu';
        $allergies = sanitize($_POST['allergies'] ?? '');
        $antecedents = sanitize($_POST['antecedents'] ?? '');
        $contact_urgence_nom = sanitize($_POST['contact_urgence_nom'] ?? '');
        $contact_urgence_tel = sanitize($_POST['contact_urgence_tel'] ?? '');
        $statut = $_POST['statut'] ?? 'actif';
        
        try {
            $stmt = $pdo->prepare("
                UPDATE patients SET nom = ?, prenom = ?, date_naissance = ?, sexe = ?, adresse = ?, telephone = ?, 
                groupe_sanguin = ?, allergies = ?, antecedents = ?, contact_urgence_nom = ?, contact_urgence_tel = ?, statut = ?
                WHERE id = ?
            ");
            $stmt->execute([$nom, $prenom, $date_naissance, $sexe, $adresse, $telephone, $groupe_sanguin, $allergies, $antecedents, $contact_urgence_nom, $contact_urgence_tel, $statut, $id]);
            
            $_SESSION['success'] = 'Patient mis à jour avec succès!';
            redirect('patients.php');
        } catch (PDOException $e) {
            $error = 'Erreur lors de la mise à jour: ' . $e->getMessage();
        }
    }
    
    if ($action === 'delete') {
        $id = (int)$_POST['id'];
        
        try {
            $stmt = $pdo->prepare("DELETE FROM patients WHERE id = ?");
            $stmt->execute([$id]);
            
            $_SESSION['success'] = 'Patient supprimé avec succès!';
            redirect('patients.php');
        } catch (PDOException $e) {
            $error = 'Erreur lors de la suppression: ' . $e->getMessage();
        }
    }
}

// Recherche et filtrage
$search = $_GET['search'] ?? '';
$statut_filter = $_GET['statut'] ?? '';

$query = "SELECT * FROM patients WHERE 1=1";
$params = [];

if (!empty($search)) {
    $query .= " AND (nom LIKE ? OR prenom LIKE ? OR code LIKE ? OR telephone LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
}

if (!empty($statut_filter)) {
    $query .= " AND statut = ?";
    $params[] = $statut_filter;
}

$query .= " ORDER BY created_at DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$patients = $stmt->fetchAll();

// Patient à modifier
$patient_edit = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM patients WHERE id = ?");
    $stmt->execute([(int)$_GET['edit']]);
    $patient_edit = $stmt->fetch();
}
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Gestion des patients</h1>
                    <p class="page-subtitle">Liste et gestion des dossiers patients</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('patientModal')">
                    ➕ Nouveau patient
                </button>
            </div>

            <!-- Search & Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="search-bar" style="margin-bottom: 0;">
                        <div class="search-input" style="flex: 2;">
                            <input type="text" name="search" placeholder="Rechercher par nom, prénom, code ou téléphone..." 
                                   value="<?= sanitize($search) ?>">
                        </div>
                        <div class="filter-group">
                            <select name="statut" class="form-control form-select" style="width: auto;">
                                <option value="">Tous les statuts</option>
                                <option value="actif" <?= $statut_filter === 'actif' ? 'selected' : '' ?>>Actif</option>
                                <option value="sorti" <?= $statut_filter === 'sorti' ? 'selected' : '' ?>>Sorti</option>
                                <option value="decede" <?= $statut_filter === 'decede' ? 'selected' : '' ?>>Décédé</option>
                            </select>
                            <button type="submit" class="btn btn-primary">Rechercher</button>
                            <a href="patients.php" class="btn btn-outline">Réinitialiser</a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Patients List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Liste des patients (<?= count($patients) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($patients)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">👥</div>
                            <h4 class="empty-state-title">Aucun patient trouvé</h4>
                            <p class="empty-state-text">Commencez par enregistrer un nouveau patient.</p>
                            <button class="btn btn-primary" onclick="openModal('patientModal')">
                                ➕ Nouveau patient
                            </button>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table" id="patientsTable">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Nom complet</th>
                                        <th>Âge</th>
                                        <th>Sexe</th>
                                        <th>Téléphone</th>
                                        <th>Groupe S.</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($patients as $patient): ?>
                                    <tr>
                                        <td><strong><?= sanitize($patient['code']) ?></strong></td>
                                        <td><?= sanitize($patient['prenom'] . ' ' . $patient['nom']) ?></td>
                                        <td><?= calculateAge($patient['date_naissance']) ?> ans</td>
                                        <td><?= $patient['sexe'] === 'M' ? 'Masculin' : 'Féminin' ?></td>
                                        <td><?= sanitize($patient['telephone'] ?? '-') ?></td>
                                        <td><?= $patient['groupe_sanguin'] ?></td>
                                        <td>
                                            <?php 
                                            $badge_class = [
                                                'actif' => 'badge-success',
                                                'sorti' => 'badge-warning',
                                                'decede' => 'badge-danger'
                                            ];
                                            ?>
                                            <span class="badge <?= $badge_class[$patient['statut']] ?? 'badge-gray' ?>">
                                                <?= ucfirst($patient['statut']) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 0.5rem;">
                                                <a href="?edit=<?= $patient['id'] ?>" class="btn btn-sm btn-outline" title="Modifier">
                                                    ✏️
                                                </a>
                                                <a href="consultations.php?patient_id=<?= $patient['id'] ?>" class="btn btn-sm btn-outline" title="Historique médical">
                                                    🩺
                                                </a>
                                                <?php if (canAccess(['admin'])): ?>
                                                <form method="POST" style="display: inline;" onsubmit="return confirmAction('Voulez-vous vraiment supprimer ce patient?');">
                                                    <input type="hidden" name="action" value="delete">
                                                    <input type="hidden" name="id" value="<?= $patient['id'] ?>">
                                                    <button type="submit" class="btn btn-sm btn-danger" title="Supprimer">🗑️</button>
                                                </form>
                                                <?php endif; ?>
                                            </div>
                                        </td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Patient Modal -->
            <div class="modal-overlay" id="patientModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title"><?= $patient_edit ? 'Modifier le patient' : 'Nouveau patient' ?></h3>
                        <button class="modal-close" onclick="closeModal('patientModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="<?= $patient_edit ? 'update' : 'save' ?>">
                            <?php if ($patient_edit): ?>
                                <input type="hidden" name="id" value="<?= $patient_edit['id'] ?>">
                            <?php endif; ?>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Nom *</label>
                                    <input type="text" name="nom" class="form-control" required 
                                           value="<?= $patient_edit ? sanitize($patient_edit['nom']) : '' ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Prénom *</label>
                                    <input type="text" name="prenom" class="form-control" required 
                                           value="<?= $patient_edit ? sanitize($patient_edit['prenom']) : '' ?>">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Date de naissance *</label>
                                    <input type="date" name="date_naissance" class="form-control birth-date" required 
                                           value="<?= $patient_edit ? $patient_edit['date_naissance'] : '' ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Sexe *</label>
                                    <select name="sexe" class="form-control form-select" required>
                                        <option value="">Sélectionner</option>
                                        <option value="M" <?= $patient_edit && $patient_edit['sexe'] === 'M' ? 'selected' : '' ?>>Masculin</option>
                                        <option value="F" <?= $patient_edit && $patient_edit['sexe'] === 'F' ? 'selected' : '' ?>>Féminin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Téléphone</label>
                                    <input type="text" name="telephone" class="form-control" 
                                           value="<?= $patient_edit ? sanitize($patient_edit['telephone']) : '' ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Groupe sanguin</label>
                                    <select name="groupe_sanguin" class="form-control form-select">
                                        <option value="Inconnu">Inconnu</option>
                                        <option value="A+" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'A+' ? 'selected' : '' ?>>A+</option>
                                        <option value="A-" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'A-' ? 'selected' : '' ?>>A-</option>
                                        <option value="B+" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'B+' ? 'selected' : '' ?>>B+</option>
                                        <option value="B-" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'B-' ? 'selected' : '' ?>>B-</option>
                                        <option value="AB+" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'AB+' ? 'selected' : '' ?>>AB+</option>
                                        <option value="AB-" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'AB-' ? 'selected' : '' ?>>AB-</option>
                                        <option value="O+" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'O+' ? 'selected' : '' ?>>O+</option>
                                        <option value="O-" <?= $patient_edit && $patient_edit['groupe_sanguin'] === 'O-' ? 'selected' : '' ?>>O-</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Adresse</label>
                                <input type="text" name="adresse" class="form-control" 
                                       value="<?= $patient_edit ? sanitize($patient_edit['adresse']) : '' ?>">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Allergies</label>
                                <textarea name="allergies" class="form-control" rows="2" 
                                          placeholder="Liste des allergies connues"><?= $patient_edit ? sanitize($patient_edit['allergies']) : '' ?></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Antécédents médicaux</label>
                                <textarea name="antecedents" class="form-control" rows="2" 
                                          placeholder="Antécédents médicaux"><?= $patient_edit ? sanitize($patient_edit['antecedents']) : '' ?></textarea>
                            </div>
                            
                            <hr style="margin: 1.5rem 0;">
                            
                            <h4 style="margin-bottom: 1rem;">Contact d'urgence</h4>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Nom du contact</label>
                                    <input type="text" name="contact_urgence_nom" class="form-control" 
                                           value="<?= $patient_edit ? sanitize($patient_edit['contact_urgence_nom']) : '' ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Téléphone du contact</label>
                                    <input type="text" name="contact_urgence_tel" class="form-control" 
                                           value="<?= $patient_edit ? sanitize($patient_edit['contact_urgence_tel']) : '' ?>">
                                </div>
                            </div>
                            
                            <?php if ($patient_edit): ?>
                            <div class="form-group">
                                <label class="form-label">Statut</label>
                                <select name="statut" class="form-control form-select">
                                    <option value="actif" <?= $patient_edit['statut'] === 'actif' ? 'selected' : '' ?>>Actif</option>
                                    <option value="sorti" <?= $patient_edit['statut'] === 'sorti' ? 'selected' : '' ?>>Sorti</option>
                                    <option value="decede" <?= $patient_edit['statut'] === 'decede' ? 'selected' : '' ?>>Décédé</option>
                                </select>
                            </div>
                            <?php endif; ?>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('patientModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

            <?php if ($patient_edit): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    openModal('patientModal');
                });
            </script>
            <?php endif; ?>

<?php include __DIR__ . '/../partials/footer.php'; ?>
