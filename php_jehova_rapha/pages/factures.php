<?php
/**
 * Gestion de la facturation - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['caissier', 'admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des factures
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'creer_facture') {
        $patient_id = (int)$_POST['patient_id'];
        $type_prestation = $_POST['type_prestation'];
        $description = sanitize($_POST['description'] ?? '');
        $quantite = (int)$_POST['quantite'];
        $prix_unitaire = (float)$_POST['prix_unitaire'];
        
        if (empty($patient_id) || empty($description)) {
            $error = 'Veuillez remplir tous les champs.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM factures");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'FAC-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            $montant_total = $quantite * $prix_unitaire;
            
            $pdo->beginTransaction();
            try {
                // Créer la facture
                $stmt = $pdo->prepare("
                    INSERT INTO factures (code, patient_id, caissier_id, montant_total, montant_paye, statut)
                    VALUES (?, ?, ?, ?, 0, 'en_attente')
                ");
                $stmt->execute([$code, $patient_id, $_SESSION['user_id'], $montant_total]);
                
                $facture_id = $pdo->lastInsertId();
                
                // Ajouter la ligne de facture
                $stmt = $pdo->prepare("
                    INSERT INTO lignes_facture (facture_id, type_prestation, description, quantite, prix_unitaire)
                    VALUES (?, ?, ?, ?, ?)
                ");
                $stmt->execute([$facture_id, $type_prestation, $description, $quantite, $prix_unitaire]);
                
                $pdo->commit();
                $_SESSION['success'] = 'Facture créée avec succès!';
                redirect('factures.php');
            } catch (PDOException $e) {
                $pdo->rollBack();
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
    
    if ($action === 'payer') {
        $id = (int)$_POST['id'];
        $montant_paye = (float)$_POST['montant_paye'];
        $mode_paiement = $_POST['mode_paiement'];
        
        $pdo->beginTransaction();
        try {
            // Mettre à jour la facture
            $stmt = $pdo->prepare("
                UPDATE factures 
                SET montant_paye = montant_paye + ?, mode_paiement = ?, 
                    statut = CASE 
                        WHEN montant_total <= montant_paye + ? THEN 'paye'
                        ELSE 'partiel'
                    END
                WHERE id = ?
            ");
            $stmt->execute([$montant_paye, $mode_paiement, $montant_paye, $id]);
            
            $pdo->commit();
            $_SESSION['success'] = 'Paiement enregistré avec succès!';
            redirect('factures.php');
        } catch (PDOException $e) {
            $pdo->rollBack();
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
}

// Liste des patients
$stmt = $pdo->query("SELECT id, code, nom, prenom FROM patients ORDER BY nom, prenom");
$patients = $stmt->fetchAll();

// Liste des factures
$statut_filter = $_GET['statut'] ?? '';
$query = "
    SELECT f.*, p.code as patient_code, CONCAT(p.prenom, ' ', p.nom) as patient_nom
    FROM factures f
    JOIN patients p ON f.patient_id = p.id
    WHERE 1=1
";
$params = [];

if (!empty($statut_filter)) {
    $query .= " AND f.statut = ?";
    $params[] = $statut_filter;
}

$query .= " ORDER BY f.date_facture DESC";

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$factures = $stmt->fetchAll();

// Statistiques
$stmt = $pdo->query("SELECT 
    COALESCE(SUM(montant_total), 0) as total,
    COALESCE(SUM(montant_paye), 0) as paye,
    COALESCE(SUM(montant_total - montant_paye), 0) as restant
    FROM factures");
$stats = $stmt->fetch();

// Revenus du jour
$stmt = $pdo->query("SELECT COALESCE(SUM(montant_paye), 0) as total FROM factures WHERE DATE(date_facture) = CURDATE()");
$revenus_jour = $stmt->fetch()['total'];
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Facturation</h1>
                    <p class="page-subtitle">Gestion des factures et paiements</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('factureModal')">
                    ➕ Nouvelle facture
                </button>
            </div>

            <!-- Stats -->
            <div class="stats-grid mb-4">
                <div class="stat-card">
                    <div class="stat-icon blue">📋</div>
                    <div class="stat-content">
                        <div class="stat-label">Total des factures</div>
                        <div class="stat-value"><?= formatCurrency($stats['total']) ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">✅</div>
                    <div class="stat-content">
                        <div class="stat-label">Montant payé</div>
                        <div class="stat-value"><?= formatCurrency($stats['paye']) ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">⏳</div>
                    <div class="stat-content">
                        <div class="stat-label">Montant restant</div>
                        <div class="stat-value"><?= formatCurrency($stats['restant']) ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">💵</div>
                    <div class="stat-content">
                        <div class="stat-label">Revenus du jour</div>
                        <div class="stat-value"><?= formatCurrency($revenus_jour) ?></div>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <form method="GET" class="search-bar" style="margin-bottom: 0;">
                        <div class="filter-group">
                            <a href="factures.php" class="filter-btn <?= $statut_filter === '' ? 'active' : '' ?>">Toutes</a>
                            <a href="?statut=en_attente" class="filter-btn <?= $statut_filter === 'en_attente' ? 'active' : '' ?>">En attente</a>
                            <a href="?statut=partiel" class="filter-btn <?= $statut_filter === 'partiel' ? 'active' : '' ?>">Partiel</a>
                            <a href="?statut=paye" class="filter-btn <?= $statut_filter === 'paye' ? 'active' : '' ?>">Payé</a>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Factures List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Factures (<?= count($factures) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <?php if (empty($factures)): ?>
                        <div class="empty-state">
                            <div class="empty-state-icon">💰</div>
                            <h4 class="empty-state-title">Aucune facture</h4>
                            <p class="empty-state-text">Aucune facture trouvée.</p>
                        </div>
                    <?php else: ?>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Patient</th>
                                        <th>Date</th>
                                        <th>Montant</th>
                                        <th>Payé</th>
                                        <th>Restant</th>
                                        <th>Statut</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($factures as $facture): ?>
                                    <tr>
                                        <td><strong><?= sanitize($facture['code']) ?></strong></td>
                                        <td><?= sanitize($facture['patient_nom']) ?></td>
                                        <td><?= formatDateTime($facture['date_facture']) ?></td>
                                        <td><strong><?= formatCurrency($facture['montant_total']) ?></strong></td>
                                        <td class="text-success"><?= formatCurrency($facture['montant_paye']) ?></td>
                                        <td class="text-danger"><?= formatCurrency($facture['montant_restant']) ?></td>
                                        <td>
                                            <?php 
                                            $badges = [
                                                'en_attente' => 'badge-warning',
                                                'partiel' => 'badge-info',
                                                'paye' => 'badge-success',
                                                'annule' => 'badge-danger'
                                            ];
                                            ?>
                                            <span class="badge <?= $badges[$facture['statut']] ?? 'badge-gray' ?>">
                                                <?= str_replace('_', ' ', ucfirst($facture['statut'])) ?>
                                            </span>
                                        </td>
                                        <td>
                                            <?php if ($facture['statut'] !== 'paye'): ?>
                                            <button class="btn btn-sm btn-success" onclick="openModal('paiementModal<?= $facture['id'] ?>')">
                                                Payer
                                            </button>
                                            <?php endif; ?>
                                            <button class="btn btn-sm btn-outline" onclick="printFacture(<?= $facture['id'] ?>)">
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

            <!-- New Facture Modal -->
            <div class="modal-overlay" id="factureModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Nouvelle facture</h3>
                        <button class="modal-close" onclick="closeModal('factureModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="creer_facture">
                            
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
                                <label class="form-label">Type de prestation</label>
                                <select name="type_prestation" class="form-control form-select" required>
                                    <option value="consultation">Consultation</option>
                                    <option value="laboratoire">Laboratoire</option>
                                    <option value="medicament">Médicament</option>
                                    <option value="hospitalisation">Hospitalisation</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Description *</label>
                                <input type="text" name="description" class="form-control" required placeholder="Description de la prestation">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Quantité</label>
                                    <input type="number" name="quantite" class="form-control" value="1" min="1">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Prix unitaire (FC)</label>
                                    <input type="number" name="prix_unitaire" class="form-control" required min="0" value="5000">
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('factureModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Créer la facture</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Paiement Modals -->
            <?php foreach ($factures as $facture): ?>
            <?php if ($facture['statut']'): ?>
            <div class="modal-overlay" id=" !== 'payepaiementModal<?= $facture['id'] ?>">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">Enregistrer un paiement - <?= sanitize($facture['code']) ?></h3>
                        <button class="modal-close" onclick="closeModal('paiementModal<?= $facture['id'] ?>')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="payer">
                            <input type="hidden" name="id" value="<?= $facture['id'] ?>">
                            
                            <p class="mb-3">
                                <strong>Patient:</strong> <?= sanitize($facture['patient_nom']) ?><br>
                                <strong>Montant total:</strong> <?= formatCurrency($facture['montant_total']) ?><br>
                                <strong>Déjà payé:</strong> <?= formatCurrency($facture['montant_paye']) ?><br>
                                <strong>Restant:</strong> <span class="text-danger"><?= formatCurrency($facture['montant_restant']) ?></span>
                            </p>
                            
                            <div class="form-group">
                                <label class="form-label">Montant à payer</label>
                                <input type="number" name="montant_paye" class="form-control" required min="1" max="<?= $facture['montant_restant'] ?>" value="<?= $facture['montant_restant'] ?>">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Mode de paiement</label>
                                <select name="mode_paiement" class="form-control form-select" required>
                                    <option value="especes">Espèces</option>
                                    <option value="mobile_money">Mobile Money</option>
                                    <option value="virement">Virement</option>
                                    <option value="assurance">Assurance</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('paiementModal<?= $facture['id'] ?>')">Annuler</button>
                            <button type="submit" class="btn btn-success">Enregistrer le paiement</button>
                        </div>
                    </form>
                </div>
            </div>
            <?php endif; ?>
            <?php endforeach; ?>

            <script>
                function printFacture(id) {
                    alert('Fonctionnalité d\'impression en cours de développement');
                }
            </script>

<?php include __DIR__ . '/../partials/footer.php'; ?>
