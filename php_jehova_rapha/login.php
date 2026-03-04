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
