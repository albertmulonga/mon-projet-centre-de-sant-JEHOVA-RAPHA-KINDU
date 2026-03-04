<?php
/**
 * Messages - Centre Médical Jéhova Rapha de Kindu
 * Système de communication interne entre le personnel
 */

require_once __DIR__ . '/../config/auth.php';
requireLogin();

$pdo = getDB();
$user_id = $_SESSION['user_id'];
$user_role = $_SESSION['user_role'];

// Traiter l'envoi de message
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'send_message') {
    $destinataire_id = (int)$_POST['destinataire_id'];
    $destinataire_type = $_POST['destinataire_type'];
    $sujet = sanitize($_POST['sujet'] ?? '');
    $contenu = sanitize($_POST['contenu'] ?? '');
    
    if (empty($sujet) || empty($contenu) || empty($destinataire_id)) {
        $error = 'Veuillez remplir tous les champs.';
    } else {
        // Générer le code
        $stmt = $pdo->query("SELECT MAX(id) as max_id FROM messages");
        $maxId = $stmt->fetch()['max_id'] ?? 0;
        $code = 'MSG-' . str_pad($maxId + 1, 5, '0', STR_PAD_LEFT);
        
        try {
            $stmt = $pdo->prepare("
                INSERT INTO messages (code, expediteur_id, expediteur_type, destinataire_id, destinataire_type, sujet, contenu)
                VALUES (?, ?, 'utilisateur', ?, ?, ?, ?)
            ");
            $stmt->execute([$code, $user_id, $destinataire_id, $destinataire_type, $sujet, $contenu]);
            
            $_SESSION['success'] = 'Message envoyé avec succès!';
            redirect('messages.php');
        } catch (PDOException $e) {
            $error = 'Erreur: ' . $e->getMessage();
        }
    }
}

// Marquer comme lu
if (isset($_GET['mark_read']) && is_numeric($_GET['mark_read'])) {
    $msg_id = (int)$_GET['mark_read'];
    $stmt = $pdo->prepare("UPDATE messages SET lu = 1, date_lecture = NOW() WHERE id = ? AND destinataire_id = ?");
    $stmt->execute([$msg_id, $user_id]);
    redirect('messages.php');
}

// Supprimer un message (émetteur ou destinataire)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete_message') {
    $msg_id = (int)$_POST['message_id'];
    
    // Vérifier si l'utilisateur est l'expéditeur ou le destinataire
    $stmt = $pdo->prepare("SELECT * FROM messages WHERE id = ? AND (expediteur_id = ? OR destinataire_id = ?)");
    $stmt->execute([$msg_id, $user_id, $user_id]);
    $message = $stmt->fetch();
    
    if ($message) {
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->execute([$msg_id]);
        $_SESSION['success'] = 'Message supprimé.';
    }
    redirect('messages.php');
}

// Modifier un message (uniquement si pas encore lu par le destinataire)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'edit_message') {
    $msg_id = (int)$_POST['message_id'];
    $nouveau_contenu = sanitize($_POST['nouveau_contenu'] ?? '');
    
    // Vérifier si l'utilisateur est l'expéditeur et si le message n'est pas encore lu
    $stmt = $pdo->prepare("SELECT * FROM messages WHERE id = ? AND expediteur_id = ? AND lu = 0");
    $stmt->execute([$msg_id, $user_id]);
    $message = $stmt->fetch();
    
    if ($message && !empty($nouveau_contenu)) {
        $stmt = $pdo->prepare("UPDATE messages SET contenu = ? WHERE id = ?");
        $stmt->execute([$nouveau_contenu, $msg_id]);
        $_SESSION['success'] = 'Message modifié.';
    } else {
        $_SESSION['error'] = 'Impossible de modifier ce message (déjà lu ou non autorisé).';
    }
    redirect('messages.php');
}

// Obtenir les utilisateurs pour la liste des destinataires
$users_list = $pdo->query("SELECT id, nom, role FROM utilisateurs WHERE id != $user_id ORDER BY nom")->fetchAll();

// Messages reçus
$received_messages = $pdo->prepare("
    SELECT m.*, u.nom as expediteur_nom, u.role as expediteur_role,
           p.prenom as exp_patient_prenom, p.nom as exp_patient_nom
    FROM messages m
    LEFT JOIN utilisateurs u ON m.expediteur_id = u.id AND m.expediteur_type = 'utilisateur'
    LEFT JOIN comptes_patients p ON m.expediteur_id = p.id AND m.expediteur_type = 'patient'
    WHERE m.destinataire_id = ? AND (m.destinataire_type = 'utilisateur' OR m.destinataire_type = 'admin')
    ORDER BY m.created_at DESC
");
$received_messages->execute([$user_id]);
$received = $received_messages->fetchAll();

// Messages envoyés
$sent_messages = $pdo->prepare("
    SELECT m.*, u.nom as destinataire_nom, u.role as destinataire_role,
           p.prenom as dest_patient_prenom, p.nom as dest_patient_nom
    FROM messages m
    LEFT JOIN utilisateurs u ON m.destinataire_id = u.id AND m.destinataire_type = 'utilisateur'
    LEFT JOIN comptes_patients p ON m.destinataire_id = p.id AND m.destinataire_type = 'patient'
    WHERE m.expediteur_id = ? AND m.expediteur_type = 'utilisateur'
    ORDER BY m.created_at DESC
");
$sent_messages->execute([$user_id]);
$sent = $sent_messages->fetchAll();

// Compter les messages non lus
$unread_count = $pdo->prepare("
    SELECT COUNT(*) as count FROM messages 
    WHERE destinataire_id = ? AND lu = 0 AND (destinataire_type = 'utilisateur' OR destinataire_type = 'admin')
");
$unread_count->execute([$user_id]);
$unread = $unread_count->fetch()['count'];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Messages - Centre Médical Jéhova Rapha</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .messages-container {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 20px;
            min-height: 500px;
        }
        .messages-list {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .messages-list-header {
            background: linear-gradient(135deg, #0ea5e9, #10b981);
            color: white;
            padding: 15px;
            font-weight: bold;
        }
        .message-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.2s;
        }
        .message-item:hover {
            background: #f8f9fa;
        }
        .message-item.unread {
            background: #e3f2fd;
            border-left: 3px solid #0ea5e9;
        }
        .message-item.active {
            background: #e3f2fd;
        }
        .message-sender {
            font-weight: 600;
            color: #333;
            font-size: 0.9rem;
        }
        .message-subject {
            color: #666;
            font-size: 0.85rem;
            margin-top: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .message-time {
            color: #999;
            font-size: 0.75rem;
            margin-top: 3px;
        }
        .message-detail {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
        }
        .message-detail-header {
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 15px;
            margin-bottom: 15px;
        }
        .message-detail-subject {
            font-size: 1.2rem;
            font-weight: bold;
            color: #333;
        }
        .message-detail-meta {
            color: #666;
            font-size: 0.85rem;
            margin-top: 5px;
        }
        .message-detail-content {
            line-height: 1.8;
            color: #444;
            min-height: 150px;
            white-space: pre-wrap;
        }
        .message-actions {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .compose-form {
            background: white;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin-top: 20px;
        }
        .tab-messages {
            display: flex;
            gap: 5px;
            margin-bottom: 15px;
        }
        .tab-message {
            padding: 10px 20px;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            border-radius: 5px 5px 0 0;
            transition: all 0.2s;
        }
        .tab-message.active {
            background: #0ea5e9;
            color: white;
        }
    </style>
</head>
<body>
    <div class="page-wrapper">
        <?php include '../dashboard.php'; ?>
        
        <main class="main-content">
            <div class="page-header">
                <h1>💬 Messages Internes</h1>
                <p>Communication entre le personnel du centre</p>
            </div>
            
            <?php if (isset($error)): ?>
                <div class="alert alert-danger">⚠️ <?= $error ?></div>
            <?php endif; ?>
            
            <?php if (isset($_SESSION['success'])): ?>
                <div class="alert alert-success">✓ <?= $_SESSION['success'] ?></div>
                <?php unset($_SESSION['success']); ?>
            <?php endif; ?>
            
            <div class="tab-messages">
                <button class="tab-message active" onclick="switchMessageTab('received')">
                    📥 Reçus <?php if($unread > 0): ?><span class="badge"><?= $unread ?></span><?php endif; ?>
                </button>
                <button class="tab-message" onclick="switchMessageTab('sent')">📤 Envoyés</button>
                <button class="tab-message" onclick="switchMessageTab('compose')">✏️ Nouveau message</button>
            </div>
            
            <div class="messages-container">
                <!-- Liste des messages -->
                <div class="messages-list">
                    <div class="messages-list-header" id="list-header">
                        Messages reçus
                    </div>
                    <div id="messages-list-content">
                        <?php if ($active_tab === 'sent'): ?>
                            <?php if (count($sent) > 0): ?>
                                <?php foreach ($sent as $msg): ?>
                                    <div class="message-item" onclick="showMessage(<?= $msg['id'] ?>, 'sent')">
                                        <div class="message-sender">
                                            À: <?= htmlspecialchars($msg['destinataire_nom'] ?? $msg['dest_patient_prenom'] . ' ' . $msg['dest_patient_nom'] ?? 'Inconnu') ?>
                                            <span style="font-size: 0.7rem; background: <?= getRoleColor($msg['destinataire_role'] ?? '') ?>; color: white; padding: 2px 6px; border-radius: 3px;">
                                                <?= ucfirst($msg['destinataire_role'] ?? 'patient') ?>
                                            </span>
                                        </div>
                                        <div class="message-subject"><?= htmlspecialchars($msg['sujet']) ?></div>
                                        <div class="message-time"><?= date('d/m/Y H:i', strtotime($msg['created_at'])) ?></div>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div style="padding: 20px; text-align: center; color: #999;">
                                    Aucun message envoyé
                                </div>
                            <?php endif; ?>
                        <?php else: ?>
                            <?php if (count($received) > 0): ?>
                                <?php foreach ($received as $msg): ?>
                                    <div class="message-item <?= $msg['lu'] == 0 ? 'unread' : '' ?>" onclick="showMessage(<?= $msg['id'] ?>, 'received')">
                                        <div class="message-sender">
                                            <?= htmlspecialchars($msg['expediteur_nom'] ?? $msg['exp_patient_prenom'] . ' ' . $msg['exp_patient_nom'] ?? 'Inconnu') ?>
                                            <?php if ($msg['lu'] == 0): ?>
                                                <span style="float: right; background: #e74c3c; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">Nouveau</span>
                                            <?php endif; ?>
                                        </div>
                                        <div class="message-subject"><?= htmlspecialchars($msg['sujet']) ?></div>
                                        <div class="message-time"><?= date('d/m/Y H:i', strtotime($msg['created_at'])) ?></div>
                                    </div>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <div style="padding: 20px; text-align: center; color: #999;">
                                    Aucun message reçu
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </div>
                
                <!-- Détail du message -->
                <div class="message-detail" id="message-detail">
                    <div style="text-align: center; padding: 50px; color: #999;">
                        <p style="font-size: 3rem;">💬</p>
                        <p>Sélectionnez un message pour le lire</p>
                    </div>
                </div>
            </div>
            
            <!-- Formulaire de composition -->
            <div class="compose-form" id="compose-form" style="display: none;">
                <h3 style="margin-top: 0; color: #0ea5e9;">✏️ Nouveau message</h3>
                <form method="POST">
                    <input type="hidden" name="action" value="send_message">
                    
                    <div class="form-group">
                        <label class="form-label">Destinataire *</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                            <select name="destinataire_type" class="form-control" required>
                                <option value="utilisateur">Personnel</option>
                                <option value="admin">Administrateur</option>
                            </select>
                            <select name="destinataire_id" class="form-control" required>
                                <?php foreach ($users_list as $u): ?>
                                    <option value="<?= $u['id'] ?>"><?= htmlspecialchars($u['nom']) ?> (<?= $u['role'] ?>)</option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Sujet *</label>
                        <input type="text" name="sujet" class="form-control" placeholder="Objet du message" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Contenu *</label>
                        <textarea name="contenu" class="form-control" rows="6" placeholder="Votre message..." required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">📤 Envoyer le message</button>
                </form>
            </div>
        </main>
    </div>
    
    <script>
        let currentMessages = {
            <?php foreach ($received as $msg): ?>
                <?= $msg['id'] ?>: {
                    id: <?= $msg['id'] ?>,
                    sujet: "<?= addslashes($msg['sujet']) ?>",
                    contenu: "<?= addslashes($msg['contenu']) ?>",
                    expediteur: "<?= addslashes($msg['expediteur_nom'] ?? $msg['exp_patient_prenom'] . ' ' . $msg['exp_patient_nom'] ?? 'Inconnu') ?>",
                    expediteur_type: "<?= $msg['expediteur_type'] ?>",
                    role: "<?= $msg['expediteur_role'] ?? 'patient' ?>",
                    date: "<?= date('d/m/Y à H:i', strtotime($msg['created_at'])) ?>",
                    lu: <?= $msg['lu'] ?>,
                    editable: true
                },
            <?php endforeach; ?>
            <?php foreach ($sent as $msg): ?>
                <?= $msg['id'] ?>: {
                    id: <?= $msg['id'] ?>,
                    sujet: "<?= addslashes($msg['sujet']) ?>",
                    contenu: "<?= addslashes($msg['contenu']) ?>",
                    expediteur: "Vous",
                    expediteur_type: "utilisateur",
                    destinataire: "<?= addslashes($msg['destinataire_nom'] ?? $msg['dest_patient_prenom'] . ' ' . $msg['dest_patient_nom'] ?? 'Inconnu') ?>",
                    destinataire_type: "<?= $msg['destinataire_type'] ?>",
                    date: "<?= date('d/m/Y à H:i', strtotime($msg['created_at'])) ?>",
                    lu: <?= $msg['lu'] ?>,
                    editable: <?= $msg['lu'] == 0 ? 'true' : 'false' ?>
                },
            <?php endforeach; ?>
        };
        
        function switchMessageTab(tab) {
            document.querySelectorAll('.tab-message').forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');
            
            document.getElementById('message-detail').innerHTML = '<div style="text-align: center; padding: 50px; color: #999;"><p style="font-size: 3rem;">💬</p><p>Sélectionnez un message pour le lire</p></div>';
            document.getElementById('compose-form').style.display = 'none';
            
            if (tab === 'compose') {
                document.getElementById('compose-form').style.display = 'block';
            }
        }
        
        function showMessage(id, type) {
            const msg = currentMessages[id];
            if (!msg) return;
            
            let actions = '';
            
            if (type === 'received' && msg.lu == 0) {
                actions += `<a href="messages.php?mark_read=${id}" class="btn btn-sm btn-info">✓ Marquer comme lu</a>`;
            }
            
            if (msg.editable) {
                actions += `<button class="btn btn-sm btn-warning" onclick="editMessage(${id})">✏️ Modifier</button>`;
            }
            
            actions += `<button class="btn btn-sm btn-danger" onclick="deleteMessage(${id})">🗑️ Supprimer</button>`;
            
            const html = `
                <div class="message-detail-header">
                    <div class="message-detail-subject">${msg.sujet}</div>
                    <div class="message-detail-meta">
                        ${type === 'received' ? 'De: ' + msg.expediteur : 'À: ' + msg.destinataire} 
                        <span style="background: ${getRoleColor(msg.role || msg.destinataire_type)}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.75rem;">
                            ${msg.role || msg.destinataire_type}
                        </span>
                        <br>
                        ${msg.date}
                        ${msg.lu == 0 ? '<span style="color: #e74c3c; font-weight: bold;">(Non lu)</span>' : ''}
                    </div>
                </div>
                <div class="message-detail-content" id="msg-content-${id}">${msg.contenu}</div>
                <div class="message-actions" id="msg-actions-${id}">${actions}</div>
            `;
            
            document.getElementById('message-detail').innerHTML = html;
        }
        
        function getRoleColor(role) {
            const colors = {
                'admin': '#9b59b6',
                'medecin': '#3498db',
                'infirmier': '#1abc9c',
                'caissier': '#f39c12',
                'laborantin': '#e74c3c',
                'pharmacien': '#27ae60',
                'patient': '#95a5a6',
                'admin': '#8e44ad'
            };
            return colors[role] || '#95a5a6';
        }
        
        function editMessage(id) {
            const msg = currentMessages[id];
            const contentDiv = document.getElementById('msg-content-' + id);
            const actionsDiv = document.getElementById('msg-actions-' + id);
            
            contentDiv.innerHTML = `
                <form method="POST" onsubmit="return submitEdit(event, ${id})">
                    <input type="hidden" name="action" value="edit_message">
                    <input type="hidden" name="message_id" value="${id}">
                    <textarea name="nouveau_contenu" class="form-control" rows="6" required>${msg.contenu}</textarea>
                    <button type="submit" class="btn btn-primary btn-sm" style="margin-top: 10px;">💾 Enregistrer</button>
                    <button type="button" class="btn btn-secondary btn-sm" style="margin-top: 10px;" onclick="cancelEdit(${id}, '${msg.contenu.replace(/'/g, "\\'")}')">Annuler</button>
                </form>
            `;
            actionsDiv.innerHTML = '';
        }
        
        function submitEdit(event, id) {
            event.preventDefault();
            event.target.submit();
            return false;
        }
        
        function cancelEdit(id, originalContent) {
            document.getElementById('msg-content-' + id).innerHTML = originalContent;
            showMessage(id, 'sent');
        }
        
        function deleteMessage(id) {
            if (confirm('Êtes-vous sûr de vouloir supprimer ce message?')) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.innerHTML = `
                    <input type="hidden" name="action" value="delete_message">
                    <input type="hidden" name="message_id" value="${id}">
                `;
                document.body.appendChild(form);
                form.submit();
            }
        }
    </script>
</body>
</html>

<?php
function getRoleColor($role) {
    $colors = [
        'admin' => '#9b59b6',
        'medecin' => '#3498db',
        'infirmier' => '#1abc9c',
        'caissier' => '#f39c12',
        'laborantin' => '#e74c3c',
        'pharmacien' => '#27ae60',
        'patient' => '#95a5a6'
    ];
    return $colors[$role] ?? '#95a5a6';
}
?>
