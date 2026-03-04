<?php
/**
 * Layout du tableau de bord - Centre Médical Jéhova Rapha de Kindu
 */

require_once 'config/auth.php';
requireLogin();

// Obtenir les informations de l'utilisateur
$user_id = $_SESSION['user_id'];
$user_nom = $_SESSION['user_nom'];
$user_role = $_SESSION['user_role'];
$user_email = $_SESSION['user_email'];

// Fonction pour obtenir le label du rôle
function getRoleLabel($role) {
    $roles = [
        'admin' => 'Administrateur',
        'medecin' => 'Médecin',
        'infirmier' => 'Infirmier',
        'caissier' => 'Caissier',
        'laborantin' => 'Laborantin',
        'pharmacien' => 'Pharmacien'
    ];
    return $roles[$role] ?? $role;
}

// Fonction pour obtenir l'icône du rôle
function getRoleIcon($role) {
    $icons = [
        'admin' => '👑',
        'medecin' => '🩺',
        'infirmier' => '💉',
        'caissier' => '💰',
        'laborantin' => '🔬',
        'pharmacien' => '💊'
    ];
    return $icons[$role] ?? '👤';
}

// Fonction pour vérifier si une page est active
function isActive($page) {
    $current_page = basename($_SERVER['PHP_SELF'], '.php');
    return $current_page === $page ? 'active' : '';
}

// Déconnexion
if (isset($_GET['logout'])) {
    logout();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tableau de bord - Centre Médical Jéhova Rapha</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="page-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <div class="sidebar-logo-icon">🏥</div>
                    <div class="sidebar-logo-text">
                        Jéhova Rapha
                        <div class="sidebar-logo-subtitle">Centre Médical</div>
                    </div>
                </div>
            </div>
            
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <div class="nav-section-title">Principal</div>
                    <a href="dashboard.php" class="nav-item <?= isActive('dashboard') ?>">
                        <span class="nav-icon">📊</span>
                        <span>Tableau de bord</span>
                    </a>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Patients</div>
                    <a href="patients.php" class="nav-item <?= isActive('patients') ?>">
                        <span class="nav-icon">👥</span>
                        <span>Patients</span>
                    </a>
                    <?php if (canAccess(['medecin', 'infirmier'])): ?>
                    <a href="consultations.php" class="nav-item <?= isActive('consultations') ?>">
                        <span class="nav-icon">🩺</span>
                        <span>Consultations</span>
                    </a>
                    <?php endif; ?>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Services</div>
                    <?php if (canAccess(['laborantin'])): ?>
                    <a href="laboratoire.php" class="nav-item <?= isActive('laboratoire') ?>">
                        <span class="nav-icon">🔬</span>
                        <span>Laboratoire</span>
                    </a>
                    <?php endif; ?>
                    
                    <?php if (canAccess(['pharmacien'])): ?>
                    <a href="medicaments.php" class="nav-item <?= isActive('medicaments') ?>">
                        <span class="nav-icon">💊</span>
                        <span>Pharmacie</span>
                    </a>
                    <?php endif; ?>
                    
                    <?php if (canAccess(['medecin', 'infirmier'])): ?>
                    <a href="hospitalisation.php" class="nav-item <?= isActive('hospitalisation') ?>">
                        <span class="nav-icon">🏨</span>
                        <span>Hospitalisation</span>
                    </a>
                    <?php endif; ?>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Communication</div>
                    <a href="messages.php" class="nav-item <?= isActive('messages') ?>">
                        <span class="nav-icon">💬</span>
                        <span>Messages</span>
                    </a>
                    <?php if (canAccess(['admin', 'caissier'])): ?>
                    <a href="notifications_paiements.php" class="nav-item <?= isActive('notifications_paiements') ?>">
                        <span class="nav-icon">💳</span>
                        <span>Paiements</span>
                    </a>
                    <?php endif; ?>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Gestion</div>
                    <?php if (canAccess(['caissier'])): ?>
                    <a href="factures.php" class="nav-item <?= isActive('factures') ?>">
                        <span class="nav-icon">💰</span>
                        <span>Facturation</span>
                    </a>
                    <?php endif; ?>
                    
                    <?php if (canAccess(['medecin'])): ?>
                    <a href="bon-sortie.php" class="nav-item <?= isActive('bon-sortie') ?>">
                        <span class="nav-icon">📋</span>
                        <span>Bons de sortie</span>
                    </a>
                    <?php endif; ?>
                    
                    <?php if (canAccess(['admin'])): ?>
                    <a href="rapports.php" class="nav-item <?= isActive('rapports') ?>">
                        <span class="nav-icon">📈</span>
                        <span>Rapports</span>
                    </a>
                    <?php endif; ?>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Administration</div>
                    <?php if (canAccess(['admin'])): ?>
                    <a href="comptes_patients.php" class="nav-item <?= isActive('comptes_patients') ?>">
                        <span class="nav-icon">🏥</span>
                        <span>Comptes patients</span>
                    </a>
                    <a href="utilisateurs.php" class="nav-item <?= isActive('utilisateurs') ?>">
                        <span class="nav-icon">👤</span>
                        <span>Utilisateurs</span>
                    </a>
                    <a href="parametres.php" class="nav-item <?= isActive('parametres') ?>">
                        <span class="nav-icon">⚙️</span>
                        <span>Paramètres</span>
                    </a>
                    <?php endif; ?>
                </div>
            </nav>
            
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">
                        <?= getRoleIcon($user_role) ?>
                    </div>
                    <div class="user-details">
                        <div class="user-name"><?= sanitize($user_nom) ?></div>
                        <div class="user-role"><?= getRoleLabel($user_role) ?></div>
                    </div>
                    <a href="?logout=1" title="Déconnexion" style="color: white; font-size: 1.25rem;">
                        🚪
                    </a>
                </div>
            </div>
        </aside>
        
        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Header -->
            <header class="top-header">
                <button class="menu-toggle" id="menuToggle">☰</button>
                <div class="header-title">Centre Médical Jéhova Rapha</div>
                <div class="header-actions">
                    <span class="badge badge-primary"><?= getRoleLabel($user_role) ?></span>
                </div>
            </header>
            
            <!-- Messages d'alerte -->
            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert alert-success fade-in">
                    <span>✓</span>
                    <?= $_SESSION['success'] ?>
                </div>
                <?php unset($_SESSION['success']); ?>
            <?php endif; ?>
            
            <?php if (isset($_SESSION['error'])): ?>
                <div class="alert alert-danger fade-in">
                    <span>⚠️</span>
                    <?= $_SESSION['error'] ?>
                </div>
                <?php unset($_SESSION['error']); ?>
            <?php endif; ?>
            
            <!-- Content Area -->
            <div id="contentArea">
