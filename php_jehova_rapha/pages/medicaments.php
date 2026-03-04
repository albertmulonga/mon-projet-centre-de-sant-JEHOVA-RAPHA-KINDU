<?php
/**
 * Gestion de la pharmacie - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['pharmacien', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des médicaments
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'save_medicament') {
        $nom = sanitize($_POST['nom'] ?? '');
        $forme = $_POST['forme'] ?? 'comprime';
        $dosage = sanitize($_POST['dosage'] ?? '');
        $categorie = sanitize($_POST['categorie'] ?? '');
        $stock_actuel = (int)$_POST['stock_actuel'];
        $stock_minimum = (int)$_POST['stock_minimum'];
        $prix_unitaire = (float)$_POST['prix_unitaire'];
        $date_expiration = $_POST['date_expiration'] ?: null;
        $fournisseur = sanitize($_POST['fournisseur'] ?? '');
        
        if (empty($nom) || empty($dosage)) {
            $error = 'Veuillez remplir les champs obligatoires.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM medicaments");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'MED-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            $statut = $stock_actuel == 0 ? 'rupture' : 'disponible';
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO medicaments (code, nom, forme, dosage, categorie, stock_actuel, stock_minimum, prix_unitaire, date_expiration, fournisseur, statut)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([$code, $nom, $forme, $dosage, $categorie, $stock_actuel, $stock_minimum, $prix_unitaire, $date_expiration, $fournisseur, $statut]);
                
                $_SESSION['success'] = 'Médicament enregistré avec succès!';
                redirect('medicaments.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
    
    if ($action === 'mouvement') {
        $medicament_id = (int)$_POST['medicament_id'];
        $type_mouvement = $_POST['type_mouvement'];
        $quantite = (int)$_POST['quantite'];
        $motif = sanitize($_POST['motif'] ?? '');
        
        $pdo->beginTransaction();
        try {
            // Ajouter le mouvement
            $stmt = $pdo->prepare("
                INSERT INTO mouvements_stock (medicament_id, type_mouvement, quantite, motif, utilisateur_id)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$medicament_id, $type_mouvement, $quantite, $motif, $_SESSION['user_id']]);
            
            // Mettre à jour le stock
            $operator = $type_mouvement === 'entree' ? '+' : '-';
            $stmt = $pdo->prepare("UPDATE medicaments SET stock_actuel = stock_actuel $operator ? WHERE id = ?");
            $stmt->execute([$quantite, $medicament_id]);
            
            // Vérifier le statut
            $stmt = $pdo->prepare("SELECT stock_actuel, stock_minimum FROM medicaments WHERE id = ?");
            $stmt->execute([$medicament_id]);
            $med = $stmt->fetch();
            
            $new_statut = 'disponible';
            if ($med['stock_actuel'] == 0) $new_statut = 'rupture';
            elseif ($med['stock_actuel'] <= $med['stock_minimum']) $new_statut = 'disponible'; // Warning handled in view
            
            $stmt = $pdo->prepare("UPDATE medicaments SET statut = ? WHERE id = ?");
            $stmt->execute([$new_statut, $medicament_id]);
            
            $pdo->commit();
            $_SESSION['success'] = 'Mouvement de stock enregistré!';
            redirect('medicaments.php');
        } catch (PDOException $e) {
            $pdo->rollBack();
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
    
    if ($action === 'delete') {
        $id = (int)$_POST['id'];
        
        try {
            $stmt = $pdo->prepare("DELETE FROM medicaments WHERE id = ?");
            $stmt->execute([$id]);
            
            $_SESSION['success'] = 'Médicament supprimé!';
            redirect('medicaments.php');
        } catch (PDOException $e) {
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
}

// Liste des médicaments
$search = $_GET['search'] ?? '';
$statut_filter = $_GET['statut'] ?? '';

$query = "SELECT * FROM medicaments WHERE 1=1";
$params = [];

if (!empty($search)) {
    $query .= " AND (nom LIKE ? OR code LIKE ? OR categorie LIKE ?)";
    $search_param = "%$search%";
    $params[] = $search_param;
    $params[] = $search_param;
    $params[] = $search_param;
}

if (!empty($statut_filter)) {
    $query .= " AND statut = ?";
    $params[] = $statut_filter;
}

$query .= " ORDER BY nom ASC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$medicaments = $stmt->fetchAll();

// Alertes de stock
$stmt = $pdo->query("SELECT * FROM v_stock_alertes WHERE niveau_stock IN ('rupture', 'critique')");
$alertes = $stmt->fetchAll();
?>

<!-- Pharmacy Loading Overlay -->
<div id="pharmacyLoader" style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a5276 0%, #148f77 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease-out;
">
    <div style="
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse 1.5s ease-in-out infinite;
    ">
        <!-- Pharmacy Cross with Green Circle -->
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
            <!-- Green circle background -->
            <circle cx="12" cy="12" r="11" fill="#2ecc71"/>
            <!-- White cross -->
            <rect x="9" y="4" width="6" height="16" rx="1" fill="white"/>
            <rect x="4" y="9" width="16" height="6" rx="1" fill="white"/>
            <!-- Snake -->
            <path d="M12 7 C10 7 8 9 8 11 C8 13 9 14 10 15 C11 16 12 16 12 16" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </svg>
    </div>
    <h2 style="color: white; margin-top: 20px; font-size: 1.5rem;">Pharmacie</h2>
    <p style="color: rgba(255,255,255,0.8); margin-top: 10px;">Chargement en cours...</p>
</div>

<style>
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}
</style>

<script>
// Hide loader after 5 seconds
setTimeout(function() {
    const loader = document.getElementById('pharmacyLoader');
    loader.style.opacity = '0';
    setTimeout(function() {
        loader.style.display = 'none';
    }, 500);
}, 5000);
</script>

            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Pharmacie</h1>
                    <p class="page-subtitle">Gestion des médicaments et du stock</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('medicamentModal')">
                    ➕ Nouveau médicament
                </button>
            </div>

            <!-- Alertes de stock -->
            <?php if (!empty($alertes)): ?>
            <div class="alert alert-danger mb-4">
                <span>⚠️</span>
                <div>
                    <strong>Alertes de stock!</strong>
                    <ul style="margin: 0.5rem 0 0 1rem;">
                        <?php foreach ($alertes as $alerte): ?>
                        <li><?= sanitize($alerte['nom']) ?> - <?= $alerte['stock_actuel'] ?> unités (minimum: <?= $alerte['stock_minimum'] ?>)</li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            </div>
            <?php endif; ?>

            <!-- Search & Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="search-bar" style="margin-bottom: 0;">
                        <div class="search-input" style="flex: 2;">
                            <input type="text" name="search" placeholder="Rechercher un médicament..." 
                                   value="<?= sanitize($search) ?>">
                        </div>
                        <div class="filter-group">
                            <select name="statut" class="form-control form-select" style="width: auto;">
                                <option value="">Tous</option>
                                <option value="disponible" <?= $statut_filter === 'disponible' ? 'selected' : '' ?>>Disponible</option>
                                <option value="rupture" <?= $statut_filter === 'rupture' ? 'selected' : '' ?>>Rupture</option>
                                <option value="expire" <?= $statut_filter === 'expire' ? 'selected' : '' ?>>Expiré</option>
                            </select>
                            <button type="submit" class="btn btn-primary">Filtrer</button>
                            <a href="medicaments.php" class="btn btn-outline">Réinitialiser</a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Médicaments List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Médicaments (<?= count($medicaments) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($medicaments)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">💊</div>
                            <h4 class="empty-state-title">Aucun médicament</h4>
                            <p class="empty-state-text">Commencez par ajouter des médicaments au stock.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Médicament</th>
                                        <th>Forme</th>
                                        <th>Dosage</th>
                                        <th>Stock</th>
                                        <th>Prix</th>
                                        <th>Expiration</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($medicaments as $med): ?>
                                    <tr>
                                        <td><strong><?= sanitize($med['code']) ?></strong></td>
                                        <td><?= sanitize($med['nom']) ?></td>
                                        <td><?= ucfirst($med['forme']) ?></td>
                                        <td><?= sanitize($med['dosage']) ?></td>
                                        <td>
                                            <?php 
                                            $stock_class = '';
                                            if ($med['stock_actuel'] == 0) $stock_class = 'text-danger';
                                            elseif ($med['stock_actuel'] <= $med['stock_minimum']) $stock_class = 'text-warning';
                                            ?>
                                            <span class="<?= $stock_class ?>"><strong><?= $med['stock_actuel'] ?></strong></span>
                                            <small class="text-muted">/ min: <?= $med['stock_minimum'] ?></small>
                                        </td>
                                        <td><?= formatCurrency($med['prix_unitaire']) ?></td>
                                        <td><?= $med['date_expiration'] ? formatDate($med['date_expiration']) : '-' ?></td>
                                        <td>
                                            <?php 
                                            $badges = [
                                                'disponible' => 'badge-success',
                                                'rupture' => 'badge-danger',
                                                'expire' => 'badge-warning'
                                            ];
                                            ?>
                                            <span class="badge <?= $badges[$med['statut']] ?? 'badge-gray' ?>">
                                                <?= ucfirst($med['statut']) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-outline" onclick="openModal('mouvementModal<?= $med['id'] ?>')" title="Mouvement de stock">
                                                📦
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

            <!-- New Medicament Modal -->
            <div class="modal-overlay" id="medicamentModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Nouveau médicament</h3>
                        <button class="modal-close" onclick="closeModal('medicamentModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="save_medicament">
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Nom *</label>
                                    <input type="text" name="nom" class="form-control" required placeholder="Nom du médicament">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Forme *</label>
                                    <select name="forme" class="form-control form-select" required>
                                        <option value="comprime">Comprimé</option>
                                        <option value="sirop">Sirop</option>
                                        <option value="injectable">Injectable</option>
                                        <option value="pommade">Pommade</option>
                                        <option value="capsule">Capsule</option>
                                        <option value="suppositoire">Suppositoire</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Dosage *</label>
                                    <input type="text" name="dosage" class="form-control" required placeholder="Ex: 500mg">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Catégorie</label>
                                    <input type="text" name="categorie" class="form-control" placeholder="Ex: Antibiotique">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Stock actuel</label>
                                    <input type="number" name="stock_actuel" class="form-control" value="0" min="0">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Stock minimum</label>
                                    <input type="number" name="stock_minimum" class="form-control" value="10" min="0">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Prix unitaire (FC)</label>
                                    <input type="number" name="prix_unitaire" class="form-control" value="0" min="0" step="0.01">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Date expiration</label>
                                    <input type="date" name="date_expiration" class="form-control">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Fournisseur</label>
                                <input type="text" name="fournisseur" class="form-control" placeholder="Nom du fournisseur">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('medicamentModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Mouvement Modals -->
            <?php foreach ($medicaments as $med): ?>
            <div class="modal-overlay" id="mouvementModal<?= $med['id'] ?>">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Mouvement de stock - <?= sanitize($med['nom']) ?></h3>
                        <button class="modal-close" onclick="closeModal('mouvementModal<?= $med['id'] ?>')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="mouvement">
                            <input type="hidden" name="medicament_id" value="<?= $med['id'] ?>">
                            
                            <p class="mb-3"><strong>Stock actuel:</strong> <?= $med['stock_actuel'] ?> unités</p>
                            
                            <div class="form-group">
                                <label class="form-label">Type de mouvement</label>
                                <select name="type_mouvement" class="form-control form-select" required>
                                    <option value="entree">Entrée (Réapprovisionnement)</option>
                                    <option value="sortie">Sortie (Dispensation)</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Quantité</label>
                                <input type="number" name="quantite" class="form-control" required min="1" value="1">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Motif</label>
                                <input type="text" name="motif" class="form-control" placeholder="Raison du mouvement">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('mouvementModal<?= $med['id'] ?>')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
            <?php endforeach; ?>

<?php include __DIR__ . '/../partials/footer.php'; ?>
