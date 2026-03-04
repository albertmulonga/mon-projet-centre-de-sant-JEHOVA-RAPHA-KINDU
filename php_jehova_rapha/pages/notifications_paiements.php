<?php
/**
 * Notifications Paiements - Centre Médical Jéhova Rapha de Kindu
 * Système de vérification des paiements par les patients
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

// Only admin and caissier can access this page
if (!canAccess(['admin', 'caissier'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();
$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'];

// Traiter la validation/rejet d'un paiement
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $notif_id = (int)$_POST['notif_id'];
    
    if ($_POST['action'] === 'valider') {
        $stmt = $pdo->prepare("
            UPDATE notifications_paiements 
            SET statut = 'valide', valide_par = ?, date_validation = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$user_id, $notif_id]);
        $_SESSION['success'] = 'Paiement validé avec succès!';
    } elseif ($_POST['action'] === 'rejeter') {
        $stmt = $pdo->prepare("
            UPDATE notifications_paiements 
            SET statut = 'rejete', valide_par = ?, date_validation = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$user_id, $notif_id]);
        $_SESSION['error'] = 'Paiement rejeté.';
    }
    redirect('notifications_paiements.php');
}

// Filtrage
$filter = $_GET['filter'] ?? 'en_attente';
$where = "1=1";
if ($filter !== 'all') {
    $where .= " AND np.statut = '" . sanitize($filter) . "'";
}

// Liste des notifications
$notifications = $pdo->query("
    SELECT np.*, p.nom as patient_nom, p.prenom as patient_prenom, p.telephone as patient_tel,
           u.nom as validateur_nom
    FROM notifications_paiements np
    LEFT JOIN patients p ON np.patient_id = p.id
    LEFT JOIN utilisateurs u ON np.valide_par = u.id
    WHERE $where
    ORDER BY np.created_at DESC
")->fetchAll();

// Statistiques
$stats = [
    'en_attente' => $pdo->query("SELECT COUNT(*) as c FROM notifications_paiements WHERE statut = 'en_attente'")->fetch()['c'],
    'valide' => $pdo->query("SELECT COUNT(*) as c FROM notifications_paiements WHERE statut = 'valide'")->fetch()['c'],
    'rejete' => $pdo->query("SELECT COUNT(*) as c FROM notifications_paiements WHERE statut = 'rejete'")->fetch()['c'],
    'total' => $pdo->query("SELECT COUNT(*) as c FROM notifications_paiements")->fetch()['c']
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications Paiements - Centre Médical Jéhova Rapha</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: #0ea5e9;
        }
        .stat-label {
            color: #666;
            font-size: 0.9rem;
        }
        .filter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .filter-tab {
            padding: 10px 20px;
            background: #f0f0f0;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            color: #333;
            transition: all 0.2s;
        }
        .filter-tab:hover {
            background: #e0e0e0;
        }
        .filter-tab.active {
            background: #0ea5e9;
            color: white;
        }
        .payment-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin-bottom: 15px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr auto;
            gap: 15px;
            align-items: center;
        }
        .payment-info h4 {
            margin: 0 0 5px 0;
            color: #333;
        }
        .payment-info p {
            margin: 0;
            color: #666;
            font-size: 0.85rem;
        }
        .payment-amount {
            font-size: 1.3rem;
            font-weight: bold;
            color: #27ae60;
        }
        .payment-status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        .status-en_attente {
            background: #fff3cd;
            color: #856404;
        }
        .status-valide {
            background: #d4edda;
            color: #155724;
        }
        .status-rejete {
            background: #f8d7da;
            color: #721c24;
        }
        .payment-proof {
            max-width: 100px;
            max-height: 100px;
            border-radius: 5px;
            cursor: pointer;
            border: 2px solid #ddd;
        }
        .payment-proof:hover {
            border-color: #0ea5e9;
        }
    </style>
</head>
<body>
    <div class="page-wrapper">
        <?php include '../dashboard.php'; ?>
        
        <main class="main-content">
            <div class="page-header">
                <h1>💳 Notifications de Paiements</h1>
                <p>Vérification des paiements effectués par les patients</p>
            </div>
            
            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert alert-success">✓ <?= $_SESSION['success'] ?></div>
                <?php unset($_SESSION['success']); ?>
            <?php endif; ?>
            
            <?php if (isset($_SESSION['error'])): ?>
                <div class="alert alert-danger">⚠️ <?= $_SESSION['error'] ?></div>
                <?php unset($_SESSION['error']); ?>
            <?php endif; ?>
            
            <!-- Statistiques -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number"><?= $stats['en_attente'] ?></div>
                    <div class="stat-label">En attente</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #27ae60;"><?= $stats['valide'] ?></div>
                    <div class="stat-label">Validés</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #e74c3c;"><?= $stats['rejete'] ?></div>
                    <div class="stat-label">Rejetés</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number"><?= $stats['total'] ?></div>
                    <div class="stat-label">Total</div>
                </div>
            </div>
            
            <!-- Filtres -->
            <div class="filter-tabs">
                <a href="?filter=en_attente" class="filter-tab <?= $filter === 'en_attente' ? 'active' : '' ?>">
                    ⏳ En attente (<?= $stats['en_attente'] ?>)
                </a>
                <a href="?filter=valide" class="filter-tab <?= $filter === 'valide' ? 'active' : '' ?>">
                    ✓ Validés (<?= $stats['valide'] ?>)
                </a>
                <a href="?filter=rejete" class="filter-tab <?= $filter === 'rejete' ? 'active' : '' ?>">
                    ✕ Rejetés (<?= $stats['rejete'] ?>)
                </a>
                <a href="?filter=all" class="filter-tab <?= $filter === 'all' ? 'active' : '' ?>">
                    📋 Tous (<?= $stats['total'] ?>)
                </a>
            </div>
            
            <!-- Liste des notifications -->
            <?php if (count($notifications) > 0): ?>
                <?php foreach ($notifications as $notif): ?>
                    <div class="payment-card">
                        <div class="payment-info">
                            <h4><?= htmlspecialchars($notif['patient_prenom'] . ' ' . $notif['patient_nom']) ?></h4>
                            <p>📱 <?= htmlspecialchars($notif['patient_tel'] ?? 'N/A') ?></p>
                            <p>📅 <?= date('d/m/Y H:i', strtotime($notif['created_at'])) ?></p>
                        </div>
                        <div>
                            <div class="payment-amount"><?= number_format($notif['montant'], 0, ',', ' ') ?> FC</div>
                            <p><strong>Mode:</strong> <?= ucfirst($notif['mode_paiement']) ?></p>
                            <?php if ($notif['numero_transaction']): ?>
                                <p><strong>Ref:</strong> <?= htmlspecialchars($notif['numero_transaction']) ?></p>
                            <?php endif; ?>
                        </div>
                        <div>
                            <span class="payment-status status-<?= $notif['statut'] ?>">
                                <?= $notif['statut'] === 'en_attente' ? '⏳ En attente' : ($notif['statut'] === 'valide' ? '✓ Validé' : '✕ Rejeté') ?>
                            </span>
                            <?php if ($notif['validateur_nom']): ?>
                                <p style="font-size: 0.8rem; color: #666; margin-top: 5px;">
                                    Par: <?= htmlspecialchars($notif['validateur_nom']) ?>
                                </p>
                            <?php endif; ?>
                        </div>
                        <div style="display: flex; gap: 10px; flex-direction: column;">
                            <?php if ($notif['statut'] === 'en_attente'): ?>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="notif_id" value="<?= $notif['id'] ?>">
                                    <button type="submit" name="action" value="valider" class="btn btn-sm btn-success">
                                        ✓ Valider
                                    </button>
                                </form>
                                <form method="POST" style="display: inline;">
                                    <input type="hidden" name="notif_id" value="<?= $notif['id'] ?>">
                                    <button type="submit" name="action" value="rejeter" class="btn btn-sm btn-danger">
                                        ✕ Rejeter
                                    </button>
                                </form>
                            <?php else: ?>
                                <span style="color: #666; font-size: 0.85rem;">
                                    <?= $notif['date_validation'] ? date('d/m/Y', strtotime($notif['date_validation'])) : '' ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div style="text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 3rem;">💳</p>
                    <p>Aucune notification de paiement</p>
                </div>
            <?php endif; ?>
        </main>
    </div>
</body>
</html>
