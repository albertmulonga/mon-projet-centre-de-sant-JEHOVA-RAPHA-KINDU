<?php
/**
 * Page d'accueil - Centre Médical Jéhova Rapha de Kindu
 */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Centre Médical Jéhova Rapha - Kindu</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div class="landing-page">
        <!-- Navigation -->
        <nav class="landing-nav">
            <div class="container">
                <div class="landing-logo">
                    <div class="landing-logo-icon">🏥</div>
                    <div>
                        <div>Centre Médical</div>
                        <div style="font-size: 0.875rem; font-weight: 400;">Jéhova Rapha</div>
                    </div>
                </div>
                <div class="landing-nav-links">
                    <a href="#services">Services</a>
                    <a href="#apropos">À propos</a>
                    <a href="#contact">Contact</a>
                    <a href="login.php" class="btn btn-light">Connexion</a>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="landing-hero">
            <div class="container">
                <h1>Centre Médical Jéhova Rapha</h1>
                <p>Votre santé, notre priorité. Nous offrons des soins médicaux de qualité à Kindu, Maniema. Faites confiance à notre équipe professionnelle pour prendre soin de vous et de vos proches.</p>
                <div class="landing-hero-buttons">
                    <a href="login.php" class="btn-light">Accéder au système</a>
                    <a href="#services" class="btn-outline-light">Découvrir nos services</a>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="landing-features" id="services">
            <div class="container">
                <h2>Nos Services</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🩺</div>
                        <h3>Consultations</h3>
                        <p>Consultations médicales générales et spécialisées pour tous les patients.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔬</div>
                        <h3>Laboratoire</h3>
                        <p>Analyses médicales complètes : NFS, glycémie, paludisme, et plus encore.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💊</div>
                        <h3>Pharmacie</h3>
                        <p>Dispensation de médicaments essentiels et suivi du traitement.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🏨</div>
                        <h3>Hospitalisation</h3>
                        <p>Chambres équipées pour les soins intensifs et l'hospitalisation.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">💰</div>
                        <h3>Facturation</h3>
                        <p>Gestion transparente des frais médicaux et assurances.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📋</div>
                        <h3>Dossiers patients</h3>
                        <p>Suivi complet de l'historique médical de chaque patient.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- À propos Section -->
        <section class="landing-contact" id="apropos">
            <div class="container">
                <h2>À propos de nous</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <h3>Notre mission</h3>
                        <p>Offrir des soins médicaux de qualité accessibles à tous les habitants de Kindu et ses environs.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Notre équipe</h3>
                        <p>Des professionnels de santé qualifiés : médecins, infirmiers, laborantins et pharmaciens.</p>
                    </div>
                    <div class="feature-card">
                        <h3>Nos infrastructures</h3>
                        <p>Équipements modernes et locaux adaptés pour garantir les meilleurs soins.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section class="landing-features" id="contact">
            <div class="container">
                <h2>Contactez-nous</h2>
                <div class="contact-info">
                    <div class="contact-item">
                        <span>📍</span>
                        <span>Kindu, Maniema, RDC</span>
                    </div>
                    <div class="contact-item">
                        <span>📞</span>
                        <span>+243 000 000 000</span>
                    </div>
                    <div class="contact-item">
                        <span>📧</span>
                        <span>jehovarapha@gmail.com</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
            <div class="container">
                <p>&copy; <?= date('Y') ?> Centre Médical Jéhova Rapha de Kindu. Tous droits réservés.</p>
                <p>Système de gestion hospitalière</p>
            </div>
        </footer>
    </div>
</body>
</html>
