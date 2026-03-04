<?php
/**
 * Gestion de l'authentification
 * Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/db.php';

// Fonction de connexion
function login($email, $password) {
    $pdo = getDB();
    
    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ? AND statut = 'actif'");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['mot_de_passe'])) {
        // Mettre à jour la dernière connexion
        $update = $pdo->prepare("UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = ?");
        $update->execute([$user['id']]);
        
        // Stocker les informations en session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_code'] = $user['code'];
        $_SESSION['user_nom'] = $user['nom'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        
        return true;
    }
    
    return false;
}

// Fonction de déconnexion
function logout() {
    session_destroy();
    redirect('login.php');
}

// Fonction pour protéger une page
function requireLogin() {
    if (!isLoggedIn()) {
        redirect('login.php');
    }
}

// Fonction pour protéger selon le rôle
function requireRole($role) {
    requireLogin();
    if (!hasRole($role)) {
        $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
        redirect('dashboard.php');
    }
}

// Fonction pour vérifier les permissions
function canAccess($roles) {
    if (!isLoggedIn()) return false;
    $userRole = getUserRole();
    return in_array($userRole, $roles) || $userRole === 'admin';
}
