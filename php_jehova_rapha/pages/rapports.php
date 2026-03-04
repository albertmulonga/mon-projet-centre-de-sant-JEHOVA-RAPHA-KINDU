<?php
/**
 * Rapports et statistiques - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Statistiques générales
$stats = [];

// Patients
$stmt = $pdo->query("SELECT COUNT(*) as total FROM patients");
$stats['patients'] = $stmt->fetch()['total'];

// Patients par mois
$stmt = $pdo->query("
    SELECT MONTH(created_at) as mois, COUNT(*) as total 
    FROM patients 
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at)
");
$patients_par_mois = $stmt->fetchAll();

// Consultations
$stmt = $pdo->query("SELECT COUNT(*) as total FROM consultations");
$stats['consultations'] = $stmt->fetch()['total'];

// Consultations par jour cette semaine
$stmt = $pdo->query("
    SELECT DATE(date_consultation) as date, COUNT(*) as total 
    FROM consultations 
    WHERE date_consultation >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(date_consultation)
    ORDER BY date
");
$consultations_semaine = $stmt->fetchAll();

// Hospitalisations
$stmt = $pdo->query("SELECT COUNT(*) as total FROM hospitalisations WHERE statut = 'en_cours'");
$stats['hospitalises'] = $stmt->fetch()['total'];

// Revenus
$stmt = $pdo->query("SELECT COALESCE(SUM(montant_paye), 0) as total FROM factures");
$stats['revenus'] = $stmt->fetch()['total'];

// Revenus par mois
$stmt = $pdo->query("
    SELECT MONTH(date_facture) as mois, SUM(montant_paye) as total 
    FROM factures 
    WHERE YEAR(date_facture) = YEAR(CURDATE())
    GROUP BY MONTH(date_facture)
");
$revenus_par_mois = $stmt->fetchAll();

// Top diagnostics
$stmt = $pdo->query("
    SELECT diagnostic, COUNT(*) as total 
    FROM consultations 
    WHERE diagnostic IS NOT NULL AND diagnostic != ''
    GROUP BY diagnostic 
    ORDER BY total DESC 
    LIMIT 5
");
$top_diagnostics = $stmt->fetchAll();

// Examens labo
$stmt = $pdo->query("SELECT COUNT(*) as total FROM examens_laboratoire");
$stats['examens'] = $stmt->fetch()['total'];

// Chambres occupation
$stmt = $pdo->query("
    SELECT type, COUNT(*) as total, 
           SUM(CASE WHEN statut = 'libre' THEN 1 ELSE 0 END) as libres
    FROM chambres 
    GROUP BY type
");
$occupation_chambres = $stmt->fetchAll();
?>
            <div class="page-header">
                <div>
                    <h1 class="page-title">Rapports et statistiques</h1>
                    <p class="page-subtitle">Vue d'ensemble du centre médical</p>
                </div>
                <button class="btn btn-primary" onclick="window.print()">
                    🖨️ Imprimer le rapport
                </button>
            </div>

            <!-- Stats Grid -->
            <div class="stats-grid mb-4">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-content">
                        <div class="stat-label">Total patients</div>
                        <div class="stat-value"><?= $stats['patients'] ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">🩺</div>
                    <div class="stat-content">
                        <div class="stat-label">Consultations</div>
                        <div class="stat-value"><?= $stats['consultations'] ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🏨</div>
                    <div class="stat-content">
                        <div class="stat-label">Hospitalisés</div>
                        <div class="stat-value"><?= $stats['hospitalises'] ?></div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon cyan">💰</div>
                    <div class="stat-content">
                        <div class="stat-label">Revenus totaux</div>
                        <div class="stat-value"><?= formatCurrency($stats['revenus']) ?></div>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                <!-- Top Diagnostics -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Top 5 Diagnostics</h3>
                    </div>
                    <div class="card-body">
                        <?php if (empty($top_diagnostics)): ?>
                            <p class="text-muted">Aucune donnée disponible</p>
                        <?php else: ?>
                            <?php foreach ($top_diagnostics as $i => $diag): ?>
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
                                <span style="font-size: 1.25rem; font-weight: bold; color: var(--primary);"><?= $i + 1 ?></span>
                                <div style="flex: 1;">
                                    <div style="font-weight: 500;"><?= sanitize($diag['diagnostic'] ?: 'Non spécifié') ?></div>
                                    <div class="text-muted" style="font-size: 0.875rem;"><?= $diag['total'] ?> cas</div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Occupation des chambres -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Occupation des chambres</h3>
                    </div>
                    <div class="card-body">
                        <?php if (empty($occupation_chambres)): ?>
                            <p class="text-muted">Aucune chambre enregistrée</p>
                        <?php else: ?>
                            <?php foreach ($occupation_chambres as $ch): ?>
                            <?php $taux = $ch['total'] > 0 ? round(($ch['total'] - $ch['libres']) / $ch['total'] * 100) : 0; ?>
                            <div style="margin-bottom: 1rem;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                                    <span><?= ucfirst($ch['type']) ?></span>
                                    <span><?= $ch['total'] - $ch['libres'] ?>/<?= $ch['total'] ?> (<?= $taux ?>%)</span>
                                </div>
                                <div style="height: 8px; background: var(--light); border-radius: 4px; overflow: hidden;">
                                    <div style="height: 100%; width: <?= $taux ?>%; background: <?= $taux > 80 ? 'var(--danger)' : ($taux > 50 ? 'var(--warning)' : 'var(--success)'); ?>; border-radius: 4px;"></div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Revenus par mois -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Revenus du mois en cours</h3>
                    </div>
                    <div class="card-body">
                        <?php if (empty($revenus_par_mois)): ?>
                            <p class="text-muted">Aucune donnée disponible</p>
                        <?php else: ?>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Mois</th>
                                        <th>Revenus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                    $mois = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                                    foreach ($revenus_par_mois as $rev): ?>
                                    <tr>
                                        <td><?= $mois[$rev['mois']] ?? $rev['mois'] ?></td>
                                        <td><strong><?= formatCurrency($rev['total']) ?></strong></td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Patients par mois -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Nouveaux patients (année en cours)</h3>
                    </div>
                    <div class="card-body">
                        <?php if (empty($patients_par_mois)): ?>
                            <p class="text-muted">Aucune donnée disponible</p>
                        <?php else: ?>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Mois</th>
                                        <th>Patients</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php 
                                    foreach ($patients_par_mois as $pat): ?>
                                    <tr>
                                        <td><?= $mois[$pat['mois']] ?? $pat['mois'] ?></td>
                                        <td><strong><?= $pat['total'] ?></strong></td>
                                    </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Examens summary -->
            <div class="card mt-4">
                <div class="card-header">
                    <h3 class="card-title">Résumé des examens de laboratoire</h3>
                </div>
                <div class="card-body">
                    <?php 
                    $stmt = $pdo->query("
                        SELECT statut, COUNT(*) as total 
                        FROM examens_laboratoire 
                        GROUP BY statut
                    ");
                    $examens_stats = $stmt->fetchAll();
                    ?>
                    <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                        <?php 
                        $badges = [
                            'demande' => 'badge-warning',
                            'en_cours' => 'badge-info',
                            'resultat_disponible' => 'badge-success',
                            'annule' => 'badge-danger'
                        ];
                        foreach ($examens_stats as $stat): ?>
                        <div>
                            <span class="badge <?= $badges[$stat['statut']] ?? 'badge-gray' ?>">
                                <?= str_replace('_', ' ', ucfirst($stat['statut'])) ?>
                            </span>
                            <span style="font-weight: 600; margin-left: 0.5rem;"><?= $stat['total'] ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

<?php include __DIR__ . '/../partials/footer.php'; ?>
