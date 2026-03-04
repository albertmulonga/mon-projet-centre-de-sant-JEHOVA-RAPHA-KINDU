<?php
/**
 * Comptes Patients - Centre Médical Jéhova Rapha de Kindu
 * Gestion des auto-inscriptions patients par l'admin
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traiter les actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $patient_id = (int)$_POST['patient_id'];
    
    if ($_POST['action'] === 'valider') {
        // Récupérer les infos du compte patient
        $stmt = $pdo->prepare("SELECT * FROM comptes_patients WHERE id = ?");
        $stmt->execute([$patient_id]);
        $compte = $stmt->fetch();
        
        if ($compte) {
            // Créer le patient dans la table patients
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM patients");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'PAT-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            $pdo->prepare("
                INSERT INTO patients (code, nom, prenom, date_naissance, sexe, telephone, statut)
                VALUES (?, ?, ?, ?, ?, ?, 'actif')
            ")->execute([$code, $compte['nom'], $compte['prenom'], $compte['date_naissance'], $compte['sexe'], $compte['telephone']]);
            
            $new_patient_id = $pdo->lastInsertId();
            
            // Mettre à jour le compte patient avec le numéro de dossier
            $stmt = $pdo->prepare("
                UPDATE comptes_patients 
                SET statut_compte = 'valide', patient_id = ?, numero_dossier = ?, date_validation = NOW() 
                WHERE id = ?
            ");
            $stmt->execute([$new_patient_id, $code, $patient_id]);
            
            $_SESSION['success'] = "Patient créé avec succès! Numéro de dossier: $code";
        }
    } elseif ($_POST['action'] === 'rejeter') {
        $stmt = $pdo->prepare("UPDATE comptes_patients SET statut_compte = 'rejete', date_validation = NOW() WHERE id = ?");
        $stmt->execute([$patient_id]);
        $_SESSION['error'] = 'Demande de compte rejetée.';
    } elseif ($_POST['action'] === 'desactiver') {
        $stmt = $pdo->prepare("UPDATE comptes_patients SET statut_compte = 'desactive' WHERE id = ?");
        $stmt->execute([$patient_id]);
        $_SESSION['success'] = 'Compte désactivé.';
    } elseif ($_POST['action'] === 'reactiver') {
        $stmt = $pdo->prepare("UPDATE comptes_patients SET statut_compte = 'valide', date_validation = NOW() WHERE id = ?");
        $stmt->execute([$patient_id]);
        $_SESSION['success'] = 'Compte réactivé.';
    } elseif ($_POST['action'] === 'supprimer') {
        $stmt = $pdo->prepare("DELETE FROM comptes_patients WHERE id = ?");
        $stmt->execute([$patient_id]);
        $_SESSION['success'] = 'Compte supprimé définitivement.';
    }
    
    redirect('comptes_patients.php');
}

// Filtrage
$filter = $_GET['filter'] ?? 'all';
$where = "1=1";
if ($filter === 'en_attente') {
    $where .= " AND cp.statut_compte = 'en_attente'";
} elseif ($filter === 'valide') {
    $where .= " AND cp.statut_compte = 'valide'";
} elseif ($filter === 'rejete') {
    $where .= " AND cp.statut_compte = 'rejete'";
} elseif ($filter === 'desactive') {
    $where .= " AND cp.statut_compte = 'desactive'";
}

// Liste des comptes patients
$comptes = $pdo->query("
    SELECT cp.*, p.nom as patient_nom, p.prenom as patient_prenom, p.code as numero_dossier
    FROM comptes_patients cp
    LEFT JOIN patients p ON cp.patient_id = p.id
    WHERE $where
    ORDER BY cp.created_at DESC
")->fetchAll();

// Statistiques
$stats = [
    'en_attente' => $pdo->query("SELECT COUNT(*) as c FROM comptes_patients WHERE statut_compte = 'en_attente'")->fetch()['c'],
    'valide' => $pdo->query("SELECT COUNT(*) as c FROM comptes_patients WHERE statut_compte = 'valide'")->fetch()['c'],
    'rejete' => $pdo->query("SELECT COUNT(*) as c FROM comptes_patients WHERE statut_compte = 'rejete'")->fetch()['c'],
    'desactive' => $pdo->query("SELECT COUNT(*) as c FROM comptes_patients WHERE statut_compte = 'desactive'")->fetch()['c']
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comptes Patients - Centre Médical Jéhova Rapha</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        .stat-card {
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-number {
            font-size: 1.8rem;
            font-weight: bold;
            color: #0ea5e9;
        }
        .stat-label {
            color: #666;
            font-size: 0.85rem;
        }
        .filter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .filter-tab {
            padding: 8px 15px;
            background: #f0f0f0;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            color: #333;
            font-size: 0.9rem;
        }
        .filter-tab:hover { background: #e0e0e0; }
        .filter-tab.active { background: #0ea5e9; color: white; }
        
        .patient-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            margin-bottom: 15px;
            display: grid;
            grid-template-columns: 60px 1fr 1fr auto;
            gap: 15px;
            align-items: center;
        }
        .patient-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0ea5e9, #10b981);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
        }
        .patient-info h4 { margin: 0 0 5px 0; color: #333; }
        .patient-info p { margin: 0; color: #666; font-size: 0.85rem; }
        .patient-status {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        .status-en_attente { background: #fff3cd; color: #856404; }
        .status-valide { background: #d4edda; color: #155724; }
        .status-rejete { background: #f8d7da; color: #721c24; }
        .status-desactive { background: #e2e3e5; color: #383d41; }
    </style>
</head>
<body>
    <div class="page-wrapper">
        <?php include '../dashboard.php'; ?>
        
        <main class="main-content">
            <div class="page-header">
                <h1>🏥 Comptes Patients</h1>
                <p>Gestion des auto-inscriptions des patients</p>
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
                    <div class="stat-number" style="color: #f39c12;"><?= $stats['en_attente'] ?></div>
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
                    <div class="stat-number" style="color: #95a5a6;"><?= $stats['desactive'] ?></div>
                    <div class="stat-label">Désactivés</div>
                </div>
            </div>
            
            <!-- Filtres -->
            <div class="filter-tabs">
                <a href="?filter=all" class="filter-tab <?= $filter === 'all' ? 'active' : '' ?>">Tous</a>
                <a href="?filter=en_attente" class="filter-tab <?= $filter === 'en_attente' ? 'active' : '' ?>">
                    ⏳ En attente (<?= $stats['en_attente'] ?>)
                </a>
                <a href="?filter=valide" class="filter-tab <?= $filter === 'valide' ? 'active' : '' ?>">
                    ✓ Validés (<?= $stats['valide'] ?>)
                </a>
                <a href="?filter=rejete" class="filter-tab <?= $filter === 'rejete' ? 'active' : '' ?>">
                    ✕ Rejetés (<?= $stats['rejete'] ?>)
                </a>
                <a href="?filter=desactive" class="filter-tab <?= $filter === 'desactive' ? 'active' : '' ?>">
                    🚫 Désactivés (<?= $stats['desactive'] ?>)
                </a>
            </div>
            
            <!-- Liste des comptes -->
            <?php if (count($comptes) > 0): ?>
                <?php foreach ($comptes as $compte): ?>
                    <div class="patient-card">
                        <div class="patient-avatar">
                            <?= strtoupper(substr($compte['prenom'], 0, 1)) . strtoupper(substr($compte['nom'], 0, 1)) ?>
                        </div>
                        <div class="patient-info">
                            <h4><?= htmlspecialchars($compte['prenom'] . ' ' . $compte['nom']) ?></h4>
                            <p>📱 <?= htmlspecialchars($compte['telephone']) ?></p>
                            <p>📧 <?= htmlspecialchars($compte['email'] ?? 'Non fourni') ?></p>
                        </div>
                        <div class="patient-info">
                            <p>🎂 <?= date('d/m/Y', strtotime($compte['date_naissance'])) ?> (<?= date('Y') - date('Y', strtotime($compte['date_naissance'])) ?> ans)</p>
                            <p>⚧ <?= $compte['sexe'] === 'M' ? 'Masculin' : 'Féminin' ?></p>
                            <p>📅 Inscrit le: <?= date('d/m/Y', strtotime($compte['created_at'])) ?></p>
                            <?php if ($compte['numero_dossier']): ?>
                                <p>📁 Dossier: <strong><?= htmlspecialchars($compte['numero_dossier']) ?></strong></p>
                            <?php endif; ?>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span class="patient-status status-<?= $compte['statut_compte'] ?>">
                                <?php 
                                    $status_labels = [
                                        'en_attente' => '⏳ En attente',
                                        'valide' => '✓ Validé',
                                        'rejete' => '✕ Rejeté',
                                        'desactive' => '🚫 Désactivé'
                                    ];
                                    echo $status_labels[$compte['statut_compte']] ?? $compte['statut_compte'];
                                ?>
                            </span>
                            <div style="display: flex; gap: 5px; margin-top: 5px;">
                                <?php if ($compte['statut_compte'] === 'en_attente'): ?>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="patient_id" value="<?= $compte['id'] ?>">
                                        <button type="submit" name="action" value="valider" class="btn btn-sm btn-success">✓ Valider</button>
                                    </form>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="patient_id" value="<?= $compte['id'] ?>">
                                        <button type="submit" name="action" value="rejeter" class="btn btn-sm btn-danger">✕ Rejeter</button>
                                    </form>
                                <?php elseif ($compte['statut_compte'] === 'valide'): ?>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="patient_id" value="<?= $compte['id'] ?>">
                                        <button type="submit" name="action" value="desactiver" class="btn btn-sm btn-warning">🚫 Désactiver</button>
                                    </form>
                                <?php elseif ($compte['statut_compte'] === 'desactive'): ?>
                                    <form method="POST" style="display: inline;">
                                        <input type="hidden" name="patient_id" value="<?= $compte['id'] ?>">
                                        <button type="submit" name="action" value="reactiver" class="btn btn-sm btn-info">✓ Réactiver</button>
                                    </form>
                                <?php endif; ?>
                                <?php if ($compte['statut_compte'] !== 'valide'): ?>
                                    <form method="POST" style="display: inline;" onsubmit="return confirm('Supprimer définitivement?');">
                                        <input type="hidden" name="patient_id" value="<?= $compte['id'] ?>">
                                        <button type="submit" name="action" value="supprimer" class="btn btn-sm btn-outline-danger">🗑️</button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div style="text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 3rem;">🏥</p>
                    <p>Aucun compte patient trouvé</p>
                </div>
            <?php endif; ?>
        </main>
    </div>
</body>
</html>
