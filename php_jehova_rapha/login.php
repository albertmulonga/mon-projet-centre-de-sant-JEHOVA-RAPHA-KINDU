<?php
/**
 * Page de connexion - Centre Médical Jéhova Rapha de Kindu
 * 
 * Fonctionnalités:
 * - Connexion personnel médical
 * - Auto-inscription patients
 * - Connexion patients
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

// Déterminer l'onglet actif (login, register, patient)
$active_tab = $_GET['tab'] ?? 'login';

// Traitement du formulaire de connexion patient
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login_patient') {
    $telephone = sanitize($_POST['telephone'] ?? '');
    $password = $_POST['password'] ?? '';
    $captcha = $_POST['captcha'] ?? '';
    
    if (!isset($_SESSION['captcha_result']) || $captcha != $_SESSION['captcha_result']) {
        $error = 'Vérification incorrecte. Veuillez réessayer.';
    } elseif (empty($telephone) || empty($password)) {
        $error = 'Veuillez entrer votre numéro de téléphone et mot de passe.';
    } else {
        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT * FROM comptes_patients WHERE telephone = ? AND statut_compte = 'valide'");
        $stmt->execute([$telephone]);
        $patient = $stmt->fetch();
        
        if ($patient && password_verify($password, $patient['mot_de_passe'])) {
            $_SESSION['patient_id'] = $patient['id'];
            $_SESSION['patient_code'] = $patient['code'];
            $_SESSION['patient_nom'] = $patient['prenom'] . ' ' . $patient['nom'];
            $_SESSION['patient_telephone'] = $patient['telephone'];
            $_SESSION['patient_numero_dossier'] = $patient['numero_dossier'];
            
            $success = 'Connexion réussie! Redirection...';
            redirect('patient_dashboard.php');
        } else {
            $error = 'Numéro de téléphone ou mot de passe incorrect.';
        }
    }
    
    $captcha_num1 = rand(1, 10);
    $captcha_num2 = rand(1, 10);
    $captcha_result = $captcha_num1 + $captcha_num2;
    $_SESSION['captcha_result'] = $captcha_result;
}

// Traitement de l'inscription patient
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'register_patient') {
    $nom = sanitize($_POST['nom'] ?? '');
    $prenom = sanitize($_POST['prenom'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $telephone = sanitize($_POST['telephone'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $date_naissance = $_POST['date_naissance'] ?? '';
    $sexe = $_POST['sexe'] ?? '';
    $captcha = $_POST['captcha'] ?? '';
    
    if (!isset($_SESSION['captcha_result']) || $captcha != $_SESSION['captcha_result']) {
        $error = 'Vérification incorrecte. Veuillez réessayer.';
    } elseif (empty($nom) || empty($prenom) || empty($telephone) || empty($password) || empty($date_naissance) || empty($sexe)) {
        $error = 'Veuillez remplir tous les champs obligatoires.';
    } elseif ($password !== $confirm_password) {
        $error = 'Les mots de passe ne correspondent pas.';
    } elseif (strlen($password) < 6) {
        $error = 'Le mot de passe doit contenir au moins 6 caractères.';
    } else {
        $pdo = getDB();
        
        // Vérifier si le téléphone existe déjà
        $stmt = $pdo->prepare("SELECT id FROM comptes_patients WHERE telephone = ?");
        $stmt->execute([$telephone]);
        if ($stmt->fetch()) {
            $error = 'Ce numéro de téléphone est déjà utilisé.';
        } else {
            // Générer le code
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM comptes_patients");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'CPT-' . str_pad($maxId + 1, 4, '0', STR_PAD_LEFT);
            
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO comptes_patients (code, nom, prenom, email, telephone, mot_de_passe, date_naissance, sexe, statut_compte)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'en_attente')
                ");
                $stmt->execute([$code, $nom, $prenom, $email, $telephone, $hashed_password, $date_naissance, $sexe]);
                
                $success = 'Compte créé avec succès! Votre compte sera validé par un administrateur. Vous recevrez un SMS une fois validé.';
                $active_tab = 'patient';
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
    
    $captcha_num1 = rand(1, 10);
    $captcha_num2 = rand(1, 10);
    $captcha_result = $captcha_num1 + $captcha_num2;
    $_SESSION['captcha_result'] = $captcha_result;
}

// Traitement du formulaire de connexion personnel
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'login_staff') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $captcha = $_POST['captcha'] ?? '';
    
    if (!isset($_SESSION['captcha_result']) || $captcha != $_SESSION['captcha_result']) {
        $error = 'Vérification incorrecte. Veuillez réessayer.';
    } elseif (empty($email) || empty($password)) {
        $error = 'Veuillez entrer votre email et mot de passe.';
    } else {
        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE email = ? AND statut = 'actif'");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['mot_de_passe'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_code'] = $user['code'];
            $_SESSION['user_nom'] = $user['nom'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_role'] = $user['role'];
            
            $update = $pdo->prepare("UPDATE utilisateurs SET derniere_connexion = NOW() WHERE id = ?");
            $update->execute([$user['id']]);
            
            $success = 'Connexion réussie! Redirection...';
            redirect('dashboard.php');
        } else {
            $error = 'Email ou mot de passe incorrect.';
        }
    }
    
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
    <style>
        .login-tabs {
            display: flex;
            gap: 0;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            overflow: hidden;
            background: rgba(255,255,255,0.1);
        }
        .login-tab {
            flex: 1;
            padding: 12px 15px;
            background: transparent;
            border: none;
            color: rgba(255,255,255,0.8);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .login-tab.active {
            background: rgba(255,255,255,0.2);
            color: white;
        }
        .login-tab:hover:not(.active) {
            background: rgba(255,255,255,0.1);
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .register-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .register-form .form-group.full-width {
            grid-column: 1 / -1;
        }
    </style>
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
                    
                    <!-- Tabs -->
                    <div class="login-tabs">
                        <button type="button" class="login-tab <?= $active_tab === 'login' ? 'active' : '' ?>>" onclick="switchTab('login')">
                            👨‍⚕️ Personnel
                        </button>
                        <button type="button" class="login-tab <?= $active_tab === 'patient' ? 'active' : '' ?>>" onclick="switchTab('patient')">
                            🏥 Patient
                        </button>
                        <button type="button" class="login-tab <?= $active_tab === 'register' ? 'active' : '' ?>>" onclick="switchTab('register')">
                            📝 S'inscrire
                        </button>
                    </div>
                    
                    <!-- Personnel Login Form -->
                    <div id="tab-login" class="tab-content <?= $active_tab === 'login' ? 'active' : '' ?>">
                        <form method="POST" class="login-form">
                            <input type="hidden" name="action" value="login_staff">
                            
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
                        
                        <div class="login-footer" style="margin-top: 1rem;">
                            <p style="font-size: 0.75rem;">Comptes: admin@jehovarapha.com / admin123</p>
                        </div>
                    </div>
                    
                    <!-- Patient Login Form -->
                    <div id="tab-patient" class="tab-content <?= $active_tab === 'patient' ? 'active' : '' ?>">
                        <form method="POST" class="login-form">
                            <input type="hidden" name="action" value="login_patient">
                            
                            <div class="form-group">
                                <label class="form-label" for="telephone">Numéro de téléphone</label>
                                <input type="tel" id="telephone" name="telephone" class="form-control" 
                                       placeholder="+243 812 345 678" required 
                                       value="<?= sanitize($_POST['telephone'] ?? '') ?>">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label" for="patient_password">Mot de passe</label>
                                <input type="password" id="patient_password" name="password" class="form-control" 
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
                                Se connecter comme patient
                            </button>
                        </form>
                        
                        <div style="text-align: center; margin-top: 1rem;">
                            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.8);">
                                Pas encore de compte? <a href="?tab=register" style="color: white; text-decoration: underline;">Créer un compte</a>
                            </p>
                        </div>
                    </div>
                    
                    <!-- Patient Registration Form -->
                    <div id="tab-register" class="tab-content <?= $active_tab === 'register' ? 'active' : '' ?>">
                        <form method="POST" class="login-form">
                            <input type="hidden" name="action" value="register_patient">
                            
                            <div class="register-form">
                                <div class="form-group">
                                    <label class="form-label" for="nom">Nom *</label>
                                    <input type="text" id="nom" name="nom" class="form-control" 
                                           placeholder="Votre nom" required 
                                           value="<?= sanitize($_POST['nom'] ?? '') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="prenom">Prénom *</label>
                                    <input type="text" id="prenom" name="prenom" class="form-control" 
                                           placeholder="Votre prénom" required 
                                           value="<?= sanitize($_POST['prenom'] ?? '') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="telephone_reg">Téléphone *</label>
                                    <input type="tel" id="telephone_reg" name="telephone" class="form-control" 
                                           placeholder="+243 812 345 678" required 
                                           value="<?= sanitize($_POST['telephone'] ?? '') ?>">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="date_naissance">Date de naissance *</label>
                                    <input type="date" id="date_naissance" name="date_naissance" class="form-control" required>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="sexe">Sexe *</label>
                                    <select id="sexe" name="sexe" class="form-control" required>
                                        <option value="">Sélectionner...</option>
                                        <option value="M">Masculin</option>
                                        <option value="F">Féminin</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label" for="email_reg">Email (optionnel)</label>
                                    <input type="email" id="email_reg" name="email" class="form-control" 
                                           placeholder="exemple@email.com"
                                           value="<?= sanitize($_POST['email'] ?? '') ?>">
                                </div>
                                
                                <div class="form-group full-width">
                                    <label class="form-label" for="password_reg">Mot de passe *</label>
                                    <input type="password" id="password_reg" name="password" class="form-control" 
                                           placeholder="Minimum 6 caractères" required minlength="6">
                                </div>
                                
                                <div class="form-group full-width">
                                    <label class="form-label" for="confirm_password">Confirmer le mot de passe *</label>
                                    <input type="password" id="confirm_password" name="confirm_password" class="form-control" 
                                           placeholder="Confirmer le mot de passe" required>
                                </div>
                                
                                <div class="form-group full-width">
                                    <label class="form-label">Vérification mathématique</label>
                                    <div class="captcha-box">
                                        <div class="captcha-text"><?= $captcha_num1 ?> + <?= $captcha_num2 ?> = ?</div>
                                        <input type="number" name="captcha" class="form-control" 
                                               placeholder="Résultat" required style="max-width: 150px; margin: 0 auto;">
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary login-submit" style="margin-top: 1rem;">
                                Créer mon compte patient
                            </button>
                        </form>
                        
                        <div style="text-align: center; margin-top: 1rem;">
                            <p style="font-size: 0.85rem; color: rgba(255,255,255,0.8);">
                                Déjà inscrit? <a href="?tab=patient" style="color: white; text-decoration: underline;">Se connecter</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="index.php" style="color: white; text-decoration: underline;">← Retour à l'accueil</a>
            </div>
        </div>
        
        <script>
        function switchTab(tab) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(function(content) {
                content.classList.remove('active');
            });
            // Deactivate all tabs
            document.querySelectorAll('.login-tab').forEach(function(tabBtn) {
                tabBtn.classList.remove('active');
            });
            // Show selected tab content
            document.getElementById('tab-' + tab).classList.add('active');
            // Activate clicked tab
            event.target.classList.add('active');
            // Update URL
            history.pushState(null, null, '?tab=' + tab);
        }
        </script>
    </div>
</body>
</html>
