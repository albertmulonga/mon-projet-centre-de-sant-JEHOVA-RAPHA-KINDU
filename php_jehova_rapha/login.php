<?php
/**
 * Page de connexion - Centre Médical Jéhova Rapha de Kindu
 */

require_once 'config/db.php';

// Démarrer la session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Si déjà connecté, rediriger vers le tableau de bord
if (isLoggedIn()) {
    redirect('dashboard.php');
}

$error = '';
$success = '';

// Générer le CAPTCHA
$captcha_num1 = rand(1, 10);
$captcha_num2 = rand(1, 10);
$captcha_result = $captcha_num1 + $captcha_num2;
$_SESSION['captcha_result'] = $captcha_result;

// Traitement du formulaire de connexion
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $captcha = $_POST['captcha'] ?? '';
    
    // Vérifier le CAPTCHA
    if (!isset($_SESSION['captcha_result']) || $captcha != $_SESSION['captcha_result']) {
        $error = 'Vérification incorrecte. Veuillez réessayer.';
    } elseif (empty($email) || empty($password)) {
        $error = 'Veuillez entrer votre email et mot de passe.';
    } else {
        // Vérifier les identifiants
        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ? AND statut = 'actif'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['mot_de_passe'])) {
            // Connexion réussie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_code'] = $user['code'];
            $_SESSION['user_nom'] = $user['nom'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];
            
            // Mettre à jour la dernière connexion
            $update = $pdo->prepare("UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = ?");
            $update->execute([$user['id']]);
            
            $success = 'Connexion réussie! Redirection...';
            redirect('dashboard.php');
        } else {
            $error = 'Email ou mot de passe incorrect.';
        }
    }
    
    // Régénérer le CAPTCHA après une tentative
    $captcha_num1 = rand(1, 10);
    $captcha_num2 = rand(1, 10);
    $captcha_result = $captcha_num1 + $captcha_num2;
    $_SESSION['captcha_result'] = $captcha_result;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Centre Médical Jéhova Rapha</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="login-page">
        <!-- Pharmacy Logo (Green Circle) -->
        <div class="pharmacy-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <!-- Cross/Medical Symbol -->
                <rect x="9" y="2" width="6" height="20" rx="1" fill="white"/>
                <rect x="2" y="9" width="20" height="6" rx="1" fill="white"/>
                <!-- Snake circle -->
                <path d="M12 6 C8 6 6 9 6 12 C6 16 8 19 12 19 C16 19 18 16 18 12 C18 9 16 6 12 6" stroke="white" stroke-width="1.5" fill="none"/>
            </svg>
        </div>
        
        <!-- Microscope Decoration -->
        <svg class="microscope-decoration" viewBox="0 0 100 100" fill="white">
            <ellipse cx="50" cy="15" rx="15" ry="10"/>
            <rect x="47" y="25" width="6" height="20"/>
            <ellipse cx="50" cy="50" rx="25" ry="15"/>
            <rect x="45" y="60" width="10" height="25"/>
            <ellipse cx="50" cy="88" rx="20" ry="5"/>
        </svg>
        
        <div class="login-container">
            <div class="login-card">
                <div class="login-header">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">🏥</div>
                    <h1>Centre Médical Jéhova Rapha</h1>
                    <p>Connectez-vous pour accéder au système</p>
                </div>
                
                <div class="login-body">
                    <?php if ($error): ?>
                        <div class="alert alert-danger">
                            <span>⚠️</span>
                            <?= $error ?>
                        </div>
                    <?php endif; ?>
                    
                    <?php if ($success): ?>
                        <div class="alert alert-success">
                            <span>✓</span>
                            <?= $success ?>
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST" class="login-form">
                        <div class="form-group">
                            <label class="form-label" for="email">Adresse email</label>
                            <input type="email" id="email" name="email" class="form-control" 
                                   placeholder="exemple@email.com" required 
                                   value="<?= sanitize($_POST['email'] ?? '') ?>">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="password">Mot de passe</label>
                            <input type="password" id="password" name="password" class="form-control" 
                                   placeholder="Votre mot de passe" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Vérification mathématique</label>
                            <div class="captcha-box">
                                <div class="captcha-text"><?= $captcha_num1 ?> + <?= $captcha_num2 ?> = ?</div>
                                <input type="number" name="captcha" class="form-control" 
                                       placeholder="Résultat" required style="max-width: 150px; margin: 0 auto;">
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary login-submit">
                            Se connecter
                        </button>
                    </form>
                </div>
                
                <div class="login-footer">
                    <p><strong>Comptes de test:</strong></p>
                    <p>admin@jehovarapha.com / admin123</p>
                    <p style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.7;">
                        Pour modifier le mot de passe, connectez-vous et allez dans Paramètres
                    </p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="index.php" style="color: white; text-decoration: underline;">← Retour à l'accueil</a>
            </div>
        </div>
    </div>
</body>
</html>
