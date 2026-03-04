<?php
/**
 * Configuration de la base de données
 * Centre Médical Jéhova Rapha de Kindu
 */

// Paramètres de connexion (XAMPP par défaut)
define('DB_HOST', 'localhost');
define('DB_NAME', 'jehova_rapha');
define('DB_USER', 'root');
define('DB_PASS', '');  // XAMPP: mot de passe vide par défaut

// Fuseau horaire
date_default_timezone_set('Africa/Lubumbashi');

// Activer l'affichage des erreurs en développement
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connexion à la base de données
function getDB() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }
    
    return $pdo;
}

// Fonction pour vérifier si l'utilisateur est connecté
function isLoggedIn() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

// Fonction pour vérifier le rôle de l'utilisateur
function hasRole($role) {
    if (!isLoggedIn()) return false;
    return $_SESSION['user_role'] === $role || $_SESSION['user_role'] === 'admin';
}

// Fonction pour obtenir le rôle de l'utilisateur
function getUserRole() {
    return $_SESSION['user_role'] ?? null;
}

// Fonction pour générer un code unique
function generateCode($prefix) {
    $pdo = getDB();
    $stmt = $pdo->query("SELECT MAX(id) as max_id FROM " . strtolower($prefix));
    $result = $stmt->fetch();
    $num = ($result['max_id'] ?? 0) + 1;
    return $prefix . '-' . str_pad($num, 3, '0', STR_PAD_LEFT);
}

// Fonction pour formater la devise
function formatCurrency($amount) {
    return number_format($amount, 0, ',', ' ') . ' FC';
}

// Fonction pour formater la date
function formatDate($date, $format = 'd/m/Y') {
    if (empty($date)) return '-';
    $dateObj = new DateTime($date);
    return $dateObj->format($format);
}

// Fonction pour formater la date et l'heure
function formatDateTime($date, $format = 'd/m/Y H:i') {
    if (empty($date)) return '-';
    $dateObj = new DateTime($date);
    return $dateObj->format($format);
}

// Fonction pour calculer l'âge
function calculateAge($date_naissance) {
    $birth = new DateTime($date_naissance);
    $today = new DateTime('today');
    return $birth->diff($today)->y;
}

// Fonction pour rediriger
function redirect($url) {
    header("Location: $url");
    exit;
}

// Fonction pour sanitize les entrées
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Démarrer la session si pas encore démarrée
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
