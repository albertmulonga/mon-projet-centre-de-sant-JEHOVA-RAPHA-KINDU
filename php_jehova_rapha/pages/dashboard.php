<?php
/**
 * Tableau de bord principal - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

$pdo = getDB();

// Obtenir les statistiques
$stats = [];

// Patients total
$stmt = $pdo->query("SELECT COUNT(*) as total FROM patients WHERE statut = 'actif'");
$stats['patients'] = $stmt->fetch()['total'] ?? 0;

// Consultations aujourd'hui
$stmt = $pdo->query("SELECT COUNT(*) as total FROM consultations WHERE DATE(date_consultation) = CURDATE()");
$stats['consultations_today'] = $stmt->fetch()['total'] ?? 0;

// Consultations total
$stmt = $pdo->query("SELECT COUNT(*) as total FROM consultations");
$stats['consultations'] = $stmt->fetch()['total'] ?? 0;

// Patients hospitalisés
$stmt = $pdo->query("SELECT COUNT(*) as total FROM hospitalisations WHERE statut = 'en_cours'");
$stats['hospitalises'] = $stmt->fetch()['total'] ?? 0;

// Chambres occupées
$stmt = $pdo->query("SELECT COUNT(*) as total FROM chambres WHERE statut = 'occupee'");
$stats['chambres_occupyes'] = $stmt->fetch()['total'] ?? 0;

// Chambres totales
$stmt = $pdo->query("SELECT COUNT(*) as total FROM chambres");
$stats['chambres'] = $stmt->fetch()['total'] ?? 0;

// Factures en attente
$stmt = $pdo->query("SELECT COUNT(*) as total FROM factures WHERE statut IN ('en_attente', 'partiel')");
$stats['factures_attente'] = $stmt->fetch()['total'] ?? 0;

// Revenus du mois
$stmt = $pdo->query("SELECT COALESCE(SUM(montant_paye), 0) as total FROM factures WHERE MONTH(date_facture) = MONTH(CURDATE()) AND YEAR(date_facture) = YEAR(CURDATE())");
$stats['revenus_mois'] = $stmt->fetch()['total'] ?? 0;

// Médicaments en rupture
$stmt = $pdo->query("SELECT COUNT(*) as total FROM medicaments WHERE statut = 'rupture' OR stock_actuel <= stock_minimum");
$stats['medicaments_alerte'] = $stmt->fetch()['total'] ?? 0;

// Examens en attente
$stmt = $pdo->query("SELECT COUNT(*) as total FROM examens_laboratoire WHERE statut = 'demande'");
$stats['examens_attente'] = $stmt->fetch()['total'] ?? 0;

// Récents patients
$stmt = $pdo->query("SELECT * FROM patients ORDER BY created_at DESC LIMIT 5");
$patients_recents = $stmt->fetchAll();

// Activités récentes
$activities = [];

// Dernières consultations
$stmt = $pdo->query("
    SELECT c.*, CONCAT(p.prenom, ' ', p.nom) as patient_nom, u.nom as medecin_nom 
    FROM consultations c 
    JOIN patients p ON c.patient_id = p.id 
    JOIN utilisateurs u ON c.medecin_id = u.id 
    ORDER BY c.date_consultation DESC LIMIT 5
");
$consultations_recents = $stmt->fetchAll();
?>
            <div class="page-header">
                <div>
                    <h1 class="page-title">Tableau de bord</h1>
                    <p class="page-subtitle">Bienvenue, <?= sanitize($_SESSION['user_nom']) ?> - <?= date('d/m/Y') ?></p>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-content">
                        <div class="stat-label">Patients actifs</div>
                        <div class="stat-value"><?= $stats['patients'] ?></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon green">🩺</div>
                    <div class="stat-content">
                        <div class="stat-label">Consultations aujourd'hui</div>
                        <div class="stat-value"><?= $stats['consultations_today'] ?></div>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon orange">🏨</div>
                    <div class="stat-content">
                        <div class="stat-label">Hospitalisés</div>
                        <div class="stat-value"><?= $stats['hospitalises'] ?></div>
                        <div class="stat-change"><?= $stats['chambres_occupyes'] ?>/<?= $stats['chambres'] ?> chambres</div>
                    </div>
                </div>
                
                <?php if (canAccess(['caissier', 'admin'])): ?>
                <div class="stat-card">
                    <div class="stat-icon cyan">💰</div>
                    <div class="stat-content">
                        <div class="stat-label">Revenus du mois</div>
                        <div class="stat-value"><?= formatCurrency($stats['revenus_mois']) ?></div>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if (canAccess(['laborantin'])): ?>
                <div class="stat-card">
                    <div class="stat-icon purple">🔬</div>
                    <div class="stat-content">
                        <div class="stat-label">Examens en attente</div>
                        <div class="stat-value"><?= $stats['examens_attente'] ?></div>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if (canAccess(['pharmacien'])): ?>
                <div class="stat-card">
                    <div class="stat-icon red">💊</div>
                    <div class="stat-content">
                        <div class="stat-label">Alertes stock</div>
                        <div class="stat-value"><?= $stats['medicaments_alerte'] ?></div>
                    </div>
                </div>
                <?php endif; ?>
                
                <?php if (canAccess(['caissier'])): ?>
                <div class="stat-card">
                    <div class="stat-icon orange">📋</div>
                    <div class="stat-content">
                        <div class="stat-label">Factures en attente</div>
                        <div class="stat-value"><?= $stats['factures_attente'] ?></div>
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <!-- Quick Actions -->
            <div class="card mb-4">
                <div class="card-header">
                    <h3 class="card-title">Actions rapides</h3>
                </div>
                <div class="card-body">
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <?php if (canAccess(['medecin', 'infirmier'])): ?>
                        <a href="patients.php?action=new" class="btn btn-primary">
                            ➕ Nouveau patient
                        </a>
                        <?php endif; ?>
                        <?php if (canAccess(['medecin'])): ?>
                        <a href="consultations.php?action=new" class="btn btn-secondary">
                            🩺 Nouvelle consultation
                        </a>
                        <?php endif; ?>
                        <?php if (canAccess(['laborantin'])): ?>
                        <a href="laboratoire.php" class="btn btn-outline">
                            🔬 Examens laboratoire
                        </a>
                        <?php endif; ?>
                        <?php if (canAccess(['pharmacien'])): ?>
                        <a href="medicaments.php" class="btn btn-outline">
                            💊 Gestion pharmacie
                        </a>
                        <?php endif; ?>
                        <?php if (canAccess(['caissier'])): ?>
                        <a href="factures.php?action=new" class="btn btn-outline">
                            💰 Nouvelle facture
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Recent Patients & Activities -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                <!-- Recent Patients -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Patients récents</h3>
                        <a href="patients.php" class="btn btn-sm btn-outline">Voir tout</a>
                    </div>
                    <div class="card-body p-0">
                        <?php if (empty($patients_recents)): ?>
                            <div class="empty-state">
                                <div class="empty-state-icon">👥</div>
                                <p>Aucun patient enregistré</p>
                            </div>
                        <?php else: ?>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Code</th>
                                        <th>Nom</th>
                                        <th>Téléphone</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($patients_recents as $patient): ?>
                                    <tr>
                                        <td><?= sanitize($patient['code']) ?></td>
                                        <td><?= sanitize($patient['prenom'] . ' ' . $patient['nom']) ?></td>
                                        <td><?= sanitize($patient['telephone'] ?? '-') ?></td>
                                        <td><?= formatDate($patient['created_at']) ?></td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Recent Consultations -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Consultations récentes</h3>
                        <a href="consultations.php" class="btn btn-sm btn-outline">Voir tout</a>
                    </div>
                    <div class="card-body p-0">
                        <?php if (empty($consultations_recents)): ?>
                            <div class="empty-state">
                                <div class="empty-state-icon">🩺</div>
                                <p>Aucune consultation</p>
                            </div>
                        <?php else: ?>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Motif</th>
                                        <th>Médecin</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($consultations_recents as $consult): ?>
                                    <tr>
                                        <td><?= sanitize($consult['patient_nom']) ?></td>
                                        <td><?= sanitize($consult['motif']) ?></td>
                                        <td><?= sanitize($consult['medecin_nom']) ?></td>
                                        <td><?= formatDateTime($consult['date_consultation']) ?></td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

<?php include __DIR__ . '/../partials/footer.php'; ?>
