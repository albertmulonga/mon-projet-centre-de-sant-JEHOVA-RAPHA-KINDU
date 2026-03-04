<?php
/**
 * Gestion des utilisateurs - Centre Médical Jéhova Rapha de Kindu
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

if (!canAccess(['admin'])) {
    $_SESSION['error'] = "Vous n'avez pas accès à cette page.";
    redirect('dashboard.php');
}

$pdo = getDB();

// Traitement des utilisateurs
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    if ($action === 'creer') {
        $nom = sanitize($_POST['nom'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $role = $_POST['role'] ?? 'infirmier';
        
        if (empty($nom) || empty($email) || empty($password)) {
            $error = 'Veuillez remplir tous les champs.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM utilisateurs");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'USR-' . str_pad($maxId + 1, 3, '0', STR_PAD_LEFT);
            
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO utilisateurs (code, nom, email, mot_de_passe, role, statut)
                    VALUES (?, ?, ?, ?, ?, 'actif')
                ");
                $stmt->execute([$code, $nom, $email, $hashed_password, $role]);
                
                $_SESSION['success'] = 'Utilisateur créé avec succès!';
                redirect('utilisateurs.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
    
    if ($action === 'update') {
        $id = (int)$_POST['id'];
        $nom = sanitize($_POST['nom'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $role = $_POST['role'] ?? 'infirmier';
        $statut = $_POST['statut'] ?? 'actif';
        
        if (!empty($_POST['password'])) {
            $hashed_password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE utilisateurs SET nom = ?, email = ?, mot_de_passe = ?, role = ?, statut = ? WHERE id = ?");
            $stmt->execute([$nom, $email, $hashed_password, $role, $statut, $id]);
        } else {
            $stmt = $pdo->prepare("UPDATE utilisateurs SET nom = ?, email = ?, role = ?, statut = ? WHERE id = ?");
            $stmt->execute([$nom, $email, $role, $statut, $id]);
        }
        
        $_SESSION['success'] = 'Utilisateur mis à jour avec succès!';
        redirect('utilisateurs.php');
    }
    
    if ($action === 'delete') {
        $id = (int)$_POST['id'];
        
        // Empêcher la suppression de son propre compte
        if ($id == $_SESSION['user_id']) {
            $error = 'Vous ne pouvez pas supprimer votre propre compte.';
        } else {
            try {
                $stmt = $pdo->prepare("DELETE FROM utilisateurs WHERE id = ?");
                $stmt->execute([$id]);
                
                $_SESSION['success'] = 'Utilisateur supprimé!';
                redirect('utilisateurs.php');
            } catch (PDOException $e) {
                $error = 'Erreur: ' . $e->getMessage();
            }
        }
    }
}

// Liste des utilisateurs
$stmt = $pdo->query("SELECT * FROM utilisateurs ORDER BY created_at DESC");
$utilisateurs = $stmt->fetchAll();

// Utilisateur à modifier
$user_edit = null;
if (isset($_GET['edit'])) {
    $stmt = $pdo->prepare("SELECT * FROM utilisateurs WHERE id = ?");
    $stmt->execute([(int)$_GET['edit']]);
    $user_edit = $stmt->fetch();
}
?>
            <div class="page-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h1 class="page-title">Gestion des utilisateurs</h1>
                    <p class="page-subtitle">Administration des comptes utilisateurs</p>
                </div>
                <button class="btn btn-primary" onclick="openModal('userModal')">
                    ➕ Nouvel utilisateur
                </button>
            </div>

            <!-- Users List -->
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Liste des utilisateurs (<?= count($utilisateurs) ?>)</h3>
                </div>
                <div class="card-body p-0">
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th>Dernière connexion</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($utilisateurs as $user): ?>
                                <?php 
                                $role_badges = [
                                    'admin' => 'badge-primary',
                                    'medecin' => 'badge-success',
                                    'infirmier' => 'badge-info',
                                    'caissier' => 'badge-warning',
                                    'laborantin' => 'badge-secondary',
                                    'pharmacien' => 'badge-secondary'
                                ];
                                $role_labels = [
                                    'admin' => 'Administrateur',
                                    'medecin' => 'Médecin',
                                    'infirmier' => 'Infirmier',
                                    'caissier' => 'Caissier',
                                    'laborantin' => 'Laborantin',
                                    'pharmacien' => 'Pharmacien'
                                ];
                                ?>
                                <tr>
                                    <td><strong><?= sanitize($user['code']) ?></strong></td>
                                    <td><?= sanitize($user['nom']) ?></td>
                                    <td><?= sanitize($user['email']) ?></td>
                                    <td>
                                        <span class="badge <?= $role_badges[$user['role']] ?? 'badge-gray' ?>">
                                            <?= $role_labels[$user['role']] ?? $user['role'] ?>
                                        </span>
                                    </td>
                                    <td>
                                        <span class="badge <?= $user['statut'] === 'actif' ? 'badge-success' : 'badge-danger' ?>">
                                            <?= ucfirst($user['statut']) ?>
                                        </span>
                                    </td>
                                    <td><?= $user['derniere_connexion'] ? formatDateTime($user['derniere_connexion']) : 'Jamais' ?></td>
                                    <td>
                                        <div style="display: flex; gap: 0.5rem;">
                                            <a href="?edit=<?= $user['id'] ?>" class="btn btn-sm btn-outline" title="Modifier">✏️</a>
                                            <?php if ($user['id'] != $_SESSION['user_id']): ?>
                                            <form method="POST" style="display: inline;" onsubmit="return confirmAction('Voulez-vous vraiment supprimer cet utilisateur?');">
                                                <input type="hidden" name="action" value="delete">
                                                <input type="hidden" name="id" value="<?= $user['id'] ?>">
                                                <button type="submit" class="btn btn-sm btn-danger" title="Supprimer">🗑️</button>
                                            </form>
                                            <?php endif; ?>
                                        </div>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- New/Edit User Modal -->
            <div class="modal-overlay" id="userModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title"><?= $user_edit ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' ?></h3>
                        <button class="modal-close" onclick="closeModal('userModal')">&times;</button>
                    </div>
                    <form method="POST">
                        <div class="modal-body">
                            <input type="hidden" name="action" value="<?= $user_edit ? 'update' : 'creer' ?>">
                            <?php if ($user_edit): ?>
                                <input type="hidden" name="id" value="<?= $user_edit['id'] ?>">
                            <?php endif; ?>
                            
                            <div class="form-group">
                                <label class="form-label">Nom complet *</label>
                                <input type="text" name="nom" class="form-control" required 
                                       value="<?= $user_edit ? sanitize($user_edit['nom']) : '' ?>">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Email *</label>
                                <input type="email" name="email" class="form-control" required 
                                       value="<?= $user_edit ? sanitize($user_edit['email']) : '' ?>">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Mot de passe <?= $user_edit ? '(laisser vide pour garder l\'actuel)' : '*' ?></label>
                                <input type="password" name="password" class="form-control" <?= $user_edit ? '' : 'required' ?>>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Rôle *</label>
                                    <select name="role" class="form-control form-select" required>
                                        <option value="admin" <?= $user_edit && $user_edit['role'] === 'admin' ? 'selected' : '' ?>>Administrateur</option>
                                        <option value="medecin" <?= $user_edit && $user_edit['role'] === 'medecin' ? 'selected' : '' ?>>Médecin</option>
                                        <option value="infirmier" <?= $user_edit && $user_edit['role'] === 'infirmier' ? 'selected' : '' ?>>Infirmier</option>
                                        <option value="caissier" <?= $user_edit && $user_edit['role'] === 'caissier' ? 'selected' : '' ?>>Caissier</option>
                                        <option value="laborantin" <?= $user_edit && $user_edit['role'] === 'laborantin' ? 'selected' : '' ?>>Laborantin</option>
                                        <option value="pharmacien" <?= $user_edit && $user_edit['role'] === 'pharmacien' ? 'selected' : '' ?>>Pharmacien</option>
                                    </select>
                                </div>
                                
                                <?php if ($user_edit): ?>
                                <div class="form-group">
                                    <label class="form-label">Statut</label>
                                    <select name="statut" class="form-control form-select">
                                        <option value="actif" <?= $user_edit['statut'] === 'actif' ? 'selected' : '' ?>>Actif</option>
                                        <option value="inactif" <?= $user_edit['statut'] === 'inactif' ? 'selected' : '' ?>>Inactif</option>
                                    </select>
                                </div>
                                <?php endif; ?>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline" onclick="closeModal('userModal')">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>

            <?php if ($user_edit): ?>
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    openModal('userModal');
                });
            </script>
            <?php endif; ?>

<?php include __DIR__ . '/../partials/footer.php'; ?>
