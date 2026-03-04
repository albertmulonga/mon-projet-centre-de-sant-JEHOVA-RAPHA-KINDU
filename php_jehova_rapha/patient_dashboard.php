<?php
/**
 * Dashboard Patient - Centre Médical Jéhova Rapha de Kindu
 * Interface pour les patients connectés
 */

require_once 'config/db.php';

// Démarrer la session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Vérifier si c'est un patient connecté
if (!isset($_SESSION['patient_id'])) {
    redirect('login.php?tab=patient');
}

$patient_id = $_SESSION['patient_id'];
$patient_nom = $_SESSION['patient_nom'];
$patient_numero = $_SESSION['patient_numero_dossier'];

$pdo = getDB();

// Traiter les actions
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    
    // Prendre rendez-vous
    if ($_POST['action'] === 'prendre_rdv') {
        $date_rdv = $_POST['date_rdv'] ?? '';
        $motif = sanitize($_POST['motif'] ?? '');
        
        if (empty($date_rdv) || empty($motif)) {
            $error = 'Veuillez remplir tous les champs.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM rendez_vous");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'RDV-' . str_pad($maxId + 1, 5, '0', STR_PAD_LEFT);
            
            $pdo->prepare("
                INSERT INTO rendez_vous (code, patient_id, date_rdv, motif, statut)
                VALUES (?, ?, ?, ?, 'en_attente')
            ")->execute([$code, $patient_id, $date_rdv, $motif]);
            
            $success = 'Rendez-vous demandé avec succès! Vous recevrez une confirmation.';
        }
    }
    
    // Commander un médicament
    if ($_POST['action'] === 'commander_medicament') {
        $medicament_id = (int)$_POST['medicament_id'];
        $quantite = (int)$_POST['quantite'];
        
        // Vérifier la disponibilité
        $med = $pdo->prepare("SELECT * FROM medicaments WHERE id = ? AND stock_actuel >= ? AND statut = 'disponible'");
        $med->execute([$medicament_id, $quantite]);
        $medicament = $med->fetch();
        
        if ($medicament) {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM commandes_medicaments");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'CMD-' . str_pad($maxId + 1, 5, '0', STR_PAD_LEFT);
            $prix_total = $medicament['prix_unitaire'] * $quantite;
            
            $pdo->prepare("
                INSERT INTO commandes_medicaments (code, patient_id, medicament_id, quantite, prix_total, statut)
                VALUES (?, ?, ?, ?, ?, 'en_attente')
            ")->execute([$code, $patient_id, $medicament_id, $quantite, $prix_total]);
            
            $success = 'Commande passée! Venez retirer vos médicaments à la pharmacie.';
        } else {
            $error = 'Médicament non disponible en quantité suffisante.';
        }
    }
    
    // Envoyer preuve de paiement
    if ($_POST['action'] === 'envoyer_paiement') {
        $montant = (float)$_POST['montant'];
        $mode_paiement = $_POST['mode_paiement'];
        $numero_transaction = sanitize($_POST['numero_transaction'] ?? '');
        $description = sanitize($_POST['description'] ?? '');
        
        if (empty($montant) || empty($mode_paiement)) {
            $error = 'Veuillez remplir les champs obligatoires.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM notifications_paiements");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'PAI-' . str_pad($maxId + 1, 5, '0', STR_PAD_LEFT);
            
            $pdo->prepare("
                INSERT INTO notifications_paiements (code, patient_id, montant, mode_paiement, numero_transaction, description, statut)
                VALUES (?, ?, ?, ?, ?, ?, 'en_attente')
            ")->execute([$code, $patient_id, $montant, $mode_paiement, $numero_transaction, $description]);
            
            $success = 'Preuve de paiement envoyée! Un caissier va la vérifier.';
        }
    }
    
    // Envoyer message au réceptionniste
    if ($_POST['action'] === 'envoyer_message') {
        $sujet = sanitize($_POST['sujet'] ?? '');
        $contenu = sanitize($_POST['contenu'] ?? '');
        
        if (empty($sujet) || empty($contenu)) {
            $error = 'Veuillez remplir tous les champs.';
        } else {
            $stmt = $pdo->query("SELECT MAX(id) as max_id FROM messages");
            $maxId = $stmt->fetch()['max_id'] ?? 0;
            $code = 'MSG-' . str_pad($maxId + 1, 5, '0', STR_PAD_LEFT);
            
            // Trouver l'admin ou le réceptionniste (premier utilisateur admin)
            $admin = $pdo->query("SELECT id FROM utilisateurs WHERE role = 'admin' LIMIT 1")->fetch();
            $dest_id = $admin['id'] ?? 1;
            
            $pdo->prepare("
                INSERT INTO messages (code, expediteur_id, expediteur_type, destinataire_id, destinataire_type, sujet, contenu)
                VALUES (?, ?, 'patient', ?, 'utilisateur', ?, ?)
            ")->execute([$code, $patient_id, $dest_id, $sujet, $contenu]);
            
            $success = 'Message envoyé au réceptionniste!';
        }
    }
}

// Obtenir les infos du patient
$patient = $pdo->prepare("SELECT * FROM comptes_patients WHERE id = ?");
$patient->execute([$patient_id]);
$patient_info = $patient->fetch();

// Obtenir les rendez-vous
$rdvs = $pdo->prepare("
    SELECT r.*, u.nom as medecin_nom
    FROM rendez_vous r
    LEFT JOIN utilisateurs u ON r.medecin_id = u.id
    WHERE r.patient_id = ?
    ORDER BY r.date_rdv DESC LIMIT 5
");
$rdvs->execute([$patient_id]);
$liste_rdv = $rdvs->fetchAll();

// Obtenir les commandes médicaments
$commandes = $pdo->prepare("
    SELECT c.*, m.nom as medicament_nom, m.dosage
    FROM commandes_medicaments c
    JOIN medicaments m ON c.medicament_id = m.id
    WHERE c.patient_id = ?
    ORDER BY c.created_at DESC LIMIT 5
");
$commandes->execute([$patient_id]);
$liste_commandes = $commandes->fetchAll();

// Obtenir les messages du réceptionniste
$messages = $pdo->prepare("
    SELECT * FROM messages 
    WHERE expediteur_type = 'utilisateur' AND destinataire_id = ? AND destinataire_type = 'patient'
    ORDER BY created_at DESC LIMIT 5
");
$messages->execute([$patient_id]);
$liste_messages = $messages->fetchAll();

// Liste des médicaments disponibles pour commande
$medicaments = $pdo->query("SELECT id, nom, dosage, forme, prix_unitaire, stock_actuel FROM medicaments WHERE statut = 'disponible' AND stock_actuel > 0 ORDER BY nom")->fetchAll();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Espace Patient - Centre Médical Jéhova Rapha</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .patient-dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        .patient-sidebar {
            background: linear-gradient(135deg, #0ea5e9, #10b981);
            color: white;
            padding: 20px;
        }
        .patient-avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin: 0 auto 15px;
        }
        .patient-name {
            text-align: center;
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .patient-number {
            text-align: center;
            font-size: 0.85rem;
            opacity: 0.8;
            margin-bottom: 20px;
        }
        .patient-nav {
            list-style: none;
            padding: 0;
        }
        .patient-nav li {
            margin-bottom: 5px;
        }
        .patient-nav a {
            display: block;
            padding: 12px 15px;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: background 0.2s;
        }
        .patient-nav a:hover, .patient-nav a.active {
            background: rgba(255,255,255,0.2);
        }
        .patient-content {
            padding: 30px;
            background: #f5f7fa;
        }
        .patient-header {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .patient-section {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .patient-section h3 {
            margin: 0 0 15px 0;
            color: #0ea5e9;
            border-bottom: 2px solid #0ea5e9;
            padding-bottom: 10px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        .info-item {
            padding: 10px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .info-label {
            font-size: 0.8rem;
            color: #666;
        }
        .info-value {
            font-size: 1rem;
            font-weight: 600;
            color: #333;
        }
        .rdv-card, .commande-card, .message-card {
            padding: 15px;
            border: 1px solid #eee;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .rdv-card h4, .commande-card h4 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .status-en_attente { background: #fff3cd; color: #856404; }
        .status-confirme { background: #d4edda; color: #155724; }
        .status-annule { background: #f8d7da; color: #721c24; }
        .status-termine { background: #d1ecf1; color: #0c5460; }
        .status-pret { background: #d4edda; color: #155724; }
        .status-retire { background: #cce5ff; color: #004085; }
    </style>
</head>
<body>
    <div class="patient-dashboard">
        <!-- Sidebar -->
        <aside class="patient-sidebar">
            <div class="patient-avatar">
                <?= strtoupper(substr($patient_info['prenom'], 0, 1)) . strtoupper(substr($patient_info['nom'], 0, 1)) ?>
            </div>
            <div class="patient-name"><?= htmlspecialchars($patient_info['prenom'] . ' ' . $patient_info['nom']) ?></div>
            <div class="patient-number">Dossier: <?= htmlspecialchars($patient_info['numero_dossier'] ?? 'En attente') ?></div>
            
            <ul class="patient-nav">
                <li><a href="#accueil" class="active" onclick="showSection('accueil')">🏠 Accueil</a></li>
                <li><a href="#rendezvous" onclick="showSection('rendezvous')">📅 Rendez-vous</a></li>
                <li><a href="#medicaments" onclick="showSection('medicaments')">💊 Médicaments</a></li>
                <li><a href="#paiement" onclick="showSection('paiement')">💳 Paiement</a></li>
                <li><a href="#messages" onclick="showSection('messages')">💬 Messages</a></li>
                <li><a href="login.php?logout=1" style="background: rgba(255,255,255,0.1); margin-top: 20px;">🚪 Déconnexion</a></li>
            </ul>
        </aside>
        
        <!-- Content -->
        <main class="patient-content">
            <?php if (isset($error)): ?>
                <div class="alert alert-danger">⚠️ <?= $error ?></div>
            <?php endif; ?>
            
            <?php if (isset($success)): ?>
                <div class="alert alert-success">✓ <?= $success ?></div>
            <?php endif; ?>
            
            <!-- Section Accueil -->
            <div id="section-accueil">
                <div class="patient-header">
                    <div>
                        <h1 style="margin: 0; color: #0ea5e9;">Bienvenue, <?= htmlspecialchars($patient_info['prenom']) ?>!</h1>
                        <p style="margin: 5px 0 0; color: #666;">Centre Médical Jéhova Rapha de Kindu</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="margin: 0; color: #666;"><?= date('d/m/Y') ?></p>
                        <p style="margin: 0; color: #666;"><?= date('H:i') ?></p>
                    </div>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Numéro de dossier</div>
                        <div class="info-value"><?= htmlspecialchars($patient_info['numero_dossier'] ?? 'En attente de validation') ?></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Téléphone</div>
                        <div class="info-value"><?= htmlspecialchars($patient_info['telephone']) ?></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email</div>
                        <div class="info-value"><?= htmlspecialchars($patient_info['email'] ?? 'Non fourni') ?></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Statut du compte</div>
                        <div class="info-value" style="color: <?= $patient_info['statut_compte'] === 'valide' ? '#27ae60' : '#f39c12' ?>;">
                            <?= ucfirst($patient_info['statut_compte']) ?>
                        </div>
                    </div>
                </div>
                
                <div class="patient-section" style="margin-top: 20px;">
                    <h3>📋 Mes dernières activités</h3>
                    <?php if (count($liste_rdv) > 0 || count($liste_commandes) > 0): ?>
                        <?php foreach ($liste_rdv as $rdv): ?>
                            <div class="rdv-card">
                                <h4>📅 <?= date('d/m/Y H:i', strtotime($rdv['date_rdv'])) ?></h4>
                                <p><?= htmlspecialchars($rdv['motif']) ?></p>
                                <span class="status-badge status-<?= $rdv['statut'] ?>"><?= ucfirst($rdv['statut']) ?></span>
                            </div>
                        <?php endforeach; ?>
                        <?php foreach ($liste_commandes as $cmd): ?>
                            <div class="commande-card">
                                <h4>💊 <?= htmlspecialchars($cmd['medicament_nom']) ?> (<?= $cmd['quantite'] ?>)</h4>
                                <p>Prix: <?= number_format($cmd['prix_total'], 0, ',', ' ') ?> FC</p>
                                <span class="status-badge status-<?= $cmd['statut'] ?>"><?= ucfirst($cmd['statut']) ?></span>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p style="color: #666; text-align: center; padding: 20px;">Aucune activité récente</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Section Rendez-vous -->
            <div id="section-rendezvous" style="display: none;">
                <div class="patient-section">
                    <h3>📅 Prendre un rendez-vous</h3>
                    <form method="POST">
                        <input type="hidden" name="action" value="prendre_rdv">
                        <div class="form-group">
                            <label class="form-label">Date et heure souhaitées *</label>
                            <input type="datetime-local" name="date_rdv" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Motif de la consultation *</label>
                            <textarea name="motif" class="form-control" rows="3" placeholder="Décrivez votre motif de consultation..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Demander un rendez-vous</button>
                    </form>
                </div>
                
                <div class="patient-section">
                    <h3>📋 Mes rendez-vous</h3>
                    <?php if (count($liste_rdv) > 0): ?>
                        <?php foreach ($liste_rdv as $rdv): ?>
                            <div class="rdv-card">
                                <h4>📅 <?= date('d/m/Y à H:i', strtotime($rdv['date_rdv'])) ?></h4>
                                <p><strong>Motif:</strong> <?= htmlspecialchars($rdv['motif']) ?></p>
                                <?php if ($rdv['medecin_nom']): ?>
                                    <p><strong>Médecin:</strong> <?= htmlspecialchars($rdv['medecin_nom']) ?></p>
                                <?php endif; ?>
                                <span class="status-badge status-<?= $rdv['statut'] ?>"><?= ucfirst($rdv['statut']) ?></span>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p style="color: #666; text-align: center;">Aucun rendez-vous</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Section Médicaments -->
            <div id="section-medicaments" style="display: none;">
                <div class="patient-section">
                    <h3>💊 Commander des médicaments</h3>
                    <form method="POST">
                        <input type="hidden" name="action" value="commander_medicament">
                        <div class="form-group">
                            <label class="form-label">Médicament *</label>
                            <select name="medicament_id" class="form-control" required>
                                <option value="">Sélectionner un médicament...</option>
                                <?php foreach ($medicaments as $med): ?>
                                    <option value="<?= $med['id'] ?>">
                                        <?= htmlspecialchars($med['nom']) ?> - <?= htmlspecialchars($med['dosage']) ?> 
                                        (<?= $med['stock_actuel'] ?> en stock) - <?= number_format($med['prix_unitaire'], 0, ',', ' ') ?> FC
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Quantité *</label>
                            <input type="number" name="quantite" class="form-control" min="1" value="1" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Commander</button>
                    </form>
                </div>
                
                <div class="patient-section">
                    <h3>📦 Mes commandes</h3>
                    <?php if (count($liste_commandes) > 0): ?>
                        <?php foreach ($liste_commandes as $cmd): ?>
                            <div class="commande-card">
                                <h4>💊 <?= htmlspecialchars($cmd['medicament_nom']) ?></h4>
                                <p>Quantité: <?= $cmd['quantite'] ?> | Prix: <?= number_format($cmd['prix_total'], 0, ',', ' ') ?> FC</p>
                                <p>Date: <?= date('d/m/Y', strtotime($cmd['created_at'])) ?></p>
                                <span class="status-badge status-<?= $cmd['statut'] ?>"><?= ucfirst($cmd['statut']) ?></span>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p style="color: #666; text-align: center;">Aucune commande</p>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Section Paiement -->
            <div id="section-paiement" style="display: none;">
                <div class="patient-section">
                    <h3>💳 Envoyer une preuve de paiement</h3>
                    <form method="POST">
                        <input type="hidden" name="action" value="envoyer_paiement">
                        <div class="form-group">
                            <label class="form-label">Montant (FC) *</label>
                            <input type="number" name="montant" class="form-control" placeholder="Montant en Francs Congolais" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Mode de paiement *</label>
                            <select name="mode_paiement" class="form-control" required>
                                <option value="">Sélectionner...</option>
                                <option value="mobile_money">Mobile Money</option>
                                <option value="virement">Virement bancaire</option>
                                <option value="especes">Espèces</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Numéro de transaction (optionnel)</label>
                            <input type="text" name="numero_transaction" class="form-control" placeholder="Numéro de transaction ou référence">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description (optionnel)</label>
                            <textarea name="description" class="form-control" rows="2" placeholder="Description du paiement..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Envoyer la preuve de paiement</button>
                    </form>
                </div>
            </div>
            
            <!-- Section Messages -->
            <div id="section-messages" style="display: none;">
                <div class="patient-section">
                    <h3>💬 Contacter le réceptionniste</h3>
                    <form method="POST">
                        <input type="hidden" name="action" value="envoyer_message">
                        <div class="form-group">
                            <label class="form-label">Sujet *</label>
                            <input type="text" name="sujet" class="form-control" placeholder="Objet de votre message" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Message *</label>
                            <textarea name="contenu" class="form-control" rows="5" placeholder="Votre message au réceptionniste..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Envoyer</button>
                    </form>
                </div>
                
                <div class="patient-section">
                    <h3>📩 Messages du centre</h3>
                    <?php if (count($liste_messages) > 0): ?>
                        <?php foreach ($liste_messages as $msg): ?>
                            <div class="message-card">
                                <h4><?= htmlspecialchars($msg['sujet']) ?></h4>
                                <p><?= nl2br(htmlspecialchars($msg['contenu'])) ?></p>
                                <small style="color: #999;"><?= date('d/m/Y H:i', strtotime($msg['created_at'])) ?></small>
                            </div>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <p style="color: #666; text-align: center;">Aucun message</p>
                    <?php endif; ?>
                </div>
            </div>
        </main>
    </div>
    
    <script>
    function showSection(section) {
        document.querySelectorAll('.patient-nav a').forEach(a => a.classList.remove('active'));
        event.target.classList.add('active');
        
        document.getElementById('section-accueil').style.display = 'none';
        document.getElementById('section-rendezvous').style.display = 'none';
        document.getElementById('section-medicaments').style.display = 'none';
        document.getElementById('section-paiement').style.display = 'none';
        document.getElementById('section-messages').style.display = 'none';
        
        document.getElementById('section-' + section).style.display = 'block';
    }
    </script>
</body>
</html>
