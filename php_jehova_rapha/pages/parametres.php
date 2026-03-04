<?php
/**
 * Paramètres du système - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des paramètres
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'update_params') {
        $params = [
            'nom_hopital' => sanitize($_POST['nom_hopital'] ?? ''),
            'ville' => sanitize($_POST['ville'] ?? ''),
            'province' => sanitize($_POST['province'] ?? ''),
            'pays' => sanitize($_POST['pays'] ?? ''),
            'telephone' => sanitize($_POST['telephone'] ?? ''),
            'email' => sanitize($_POST['email'] ?? ''),
            'devise' => sanitize($_POST['devise'] ?? 'FC'),
        ];
        
        foreach ($params as $cle => $valeur) {
            $stmt = $pdo->prepare("UPDATE parametres_systeme SET valeur = ? WHERE cle = ?");
            $stmt->execute([$valeur, $cle]);
        }
        
        $_SESSION['success'] = 'Paramètres mis à jour avec succès!';
        redirect('parametres.php');
    }
    
    if ($action === 'change_password') {
        $current_password = $_POST['current_password'] ?? '';
        $new_password = $_POST['new_password'] ?? '';
        $confirm_password = $_POST['confirm_password'] ?? '';
        
        // Vérifier le mot de passe actuel
        $stmt = $pdo->prepare("SELECT mot_de_passe FROM utilisateurs WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if (!password_verify($current_password, $user['mot_de_passe'])) {
            $error = 'Mot de passe actuel incorrect.';
        } elseif (strlen($new_password) < 6) {
            $error = 'Le nouveau mot de passe doit contenir au moins 6 caractères.';
        } elseif ($new_password !== $confirm_password) {
            $error = 'Les mots de passe ne correspondent pas.';
        } else {
            $hashed = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE utilisateurs SET mot_de_passe = ? WHERE id = ?");
            $stmt->execute([$hashed, $_SESSION['user_id']]);
            
            $_SESSION['success'] = 'Mot de passe changé avec succès!';
            redirect('parametres.php');
        }
    }
}

// Obtenir les paramètres
$stmt = $pdo->query("SELECT * FROM parametres_systeme");
$params = [];
while ($row = $stmt->fetch()) {
    $params[$row['cle']] = $row['valeur'];
}
?>
            <div class="page-header">
                <div>
                    <h1 class="page-title">Paramètres</h1>
                    <p class="page-subtitle">Configuration du système</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                <!-- Paramètres généraux -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Informations de l'établissement</h3>
                    </div>
                    <form method="POST">
                        <div class="card-body">
                            <input type="hidden" name="action" value="update_params">
                            
                            <div class="form-group">
                                <label class="form-label">Nom de l'établissement</label>
                                <input type="text" name="nom_hopital" class="form-control" 
                                       value="<?= sanitize($params['nom_hopital'] ?? '') ?>">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Ville</label>
                                    <input type="text" name="ville" class="form-control" 
                                           value="<?= sanitize($params['ville'] ?? '') ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Province</label>
                                    <input type="text" name="province" class="form-control" 
                                           value="<?= sanitize($params['province'] ?? '') ?>">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Pays</label>
                                <input type="text" name="pays" class="form-control" 
                                       value="<?= sanitize($params['pays'] ?? '') ?>">
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Téléphone</label>
                                    <input type="text" name="telephone" class="form-control" 
                                           value="<?= sanitize($params['telephone'] ?? '') ?>">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="email" class="form-control" 
                                           value="<?= sanitize($params['email'] ?? '') ?>">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Devise</label>
                                <input type="text" name="devise" class="form-control" 
                                       value="<?= sanitize($params['devise'] ?? 'FC') ?>">
                            </div>
                        </div>
                        <div class="card-footer">
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>

                <!-- Changement de mot de passe -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Changer mon mot de passe</h3>
                    </div>
                    <form method="POST">
                        <div class="card-body">
                            <input type="hidden" name="action" value="change_password">
                            
                            <div class="form-group">
                                <label class="form-label">Mot de passe actuel</label>
                                <input type="password" name="current_password" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Nouveau mot de passe</label>
                                <input type="password" name="new_password" class="form-control" required minlength="6">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Confirmer le mot de passe</label>
                                <input type="password" name="confirm_password" class="form-control" required>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button type="submit" class="btn btn-primary">Changer le mot de passe</button>
                        </div>
                    </form>
                </div>

                <!-- À propos -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">À propos</h3>
                    </div>
                    <div class="card-body">
                        <div style="text-align: center; padding: 1rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🏥</div>
                            <h3 style="margin-bottom: 0.5rem;">Centre Médical Jéhova Rapha</h3>
                            <p class="text-muted" style="margin-bottom: 1rem;">Version 1.0.0</p>
                            <p>Système de gestion hospitalière</p>
                            <p class="text-muted" style="font-size: 0.875rem; margin-top: 1rem;">
                                Développé pour le Centre Médical Jéhova Rapha de Kindu, Maniema, RDC.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

<?php include __DIR__ . '/../partials/footer.php'; ?>
