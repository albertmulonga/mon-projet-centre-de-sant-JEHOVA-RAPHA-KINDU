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
    <style>
        /* Gallery Styles */
        .gallery-section {
            background: linear-gradient(135deg, #1a5276 0%, #148f77 100%);
            padding: 80px 0;
        }
        
        .gallery-title {
            color: white;
            text-align: center;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .gallery-subtitle {
            color: rgba(255,255,255,0.8);
            text-align: center;
            margin-bottom: 3rem;
            font-size: 1.1rem;
        }
        
        .gallery-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            position: relative;
            overflow: hidden;
        }
        
        .gallery-track {
            display: flex;
            transition: transform 0.5s ease-in-out;
        }
        
        .gallery-slide {
            min-width: 300px;
            margin: 0 15px;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            position: relative;
        }
        
        .gallery-slide img {
            width: 100%;
            height: 280px;
            object-fit: cover;
            display: block;
        }
        
        .gallery-caption {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0,0,0,0.8));
            color: white;
            padding: 60px 20px 20px;
            font-weight: 500;
        }
        
        .gallery-nav {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
        }
        
        .gallery-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.4);
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .gallery-dot.active {
            background: #2ecc71;
            transform: scale(1.3);
        }
        
        /* Location Section */
        .location-section {
            padding: 80px 0;
            background: #f8f9fa;
        }
        
        .location-title {
            text-align: center;
            color: #1a5276;
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        
        .location-subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 3rem;
            font-size: 1.1rem;
        }
        
        .map-container {
            max-width: 1000px;
            margin: 0 auto;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        
        .map-frame {
            width: 100%;
            height: 450px;
            border: none;
        }
        
        .address-box {
            max-width: 1000px;
            margin: 30px auto 0;
            background: white;
            padding: 30px;
            border-radius: 15px;
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            gap: 20px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .address-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .address-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #1a5276, #148f77);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
    </style>
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
                    <a href="#galerie">Galerie</a>
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

        <!-- Photo Gallery Section -->
        <section class="gallery-section" id="galerie">
            <h2 class="gallery-title">Notre Équipe & Infrastructures</h2>
            <p class="gallery-subtitle">Des professionnels dévoués à votre service</p>
            
            <div class="gallery-container">
                <div class="gallery-track" id="galleryTrack">
                    <div class="gallery-slide">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231a5276' width='400' height='300'/%3E%3Ccircle cx='200' cy='120' r='50' fill='white'/%3E%3Crect x='150' y='170' width='100' height='80' fill='white'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EMédecin en consultation%3C/text%3E%3C/svg%3E" alt="Médecin">
                        <div class="gallery-caption">Dr. Mukamba - Médecin Chef</div>
                    </div>
                    <div class="gallery-slide">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23148777' width='400' height='300'/%3E%3Cellipse cx='200' cy='100' rx='60' ry='40' fill='white'/%3E%3Crect x='160' y='140' width='80' height='100' fill='white'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EInfirmière qualifiée%3C/text%3E%3C/svg%3E" alt="Infirmière">
                        <div class="gallery-caption">Inf. Mwamba - Infirmière en chef</div>
                    </div>
                    <div class="gallery-slide">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%232ecc71' width='400' height='300'/%3E%3Ccircle cx='200' cy='150' r='70' fill='%23f8f9fa'/%3E%3Cellipse cx='170' cy='140' rx='20' ry='30' fill='%23333'/%3E%3Cellipse cx='230' cy='140' rx='20' ry='30' fill='%23333'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3ELaborantin au microscope%3C/text%3E%3C/svg%3E" alt="Laboratoire">
                        <div class="gallery-caption">Labo. Mbuji - Responsable Laboratoire</div>
                    </div>
                    <div class="gallery-slide">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%231a5276' width='400' height='300'/%3E%3Ccircle cx='200' cy='120' r='50' fill='white'/%3E%3Crect x='150' y='170' width='100' height='80' fill='white'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EChirurgien%3C/text%3E%3C/svg%3E" alt="Chirurgien">
                        <div class="gallery-caption">Équipe chirurgicale</div>
                    </div>
                    <div class="gallery-slide">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23e74c3c' width='400' height='300'/%3E%3Crect x='120' y='80' width='160' height='140' rx='10' fill='%23f8f9fa'/%3E%3Ccircle cx='200' cy='150' r='40' fill='%23333'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EMicroscope de laboratoire%3C/text%3E%3C/svg%3E" alt="Microscope">
                        <div class="gallery-caption">Équipements modernes</div>
                    </div>
                    <div class="gallery-slide">
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23148777' width='400' height='300'/%3E%3Ccircle cx='200' cy='120' r='50' fill='white'/%3E%3Crect x='150' y='170' width='100' height='80' fill='white'/%3E%3Ctext x='200' y='280' text-anchor='middle' fill='white' font-family='Arial' font-size='14'%3EPharmacien%3C/text%3E%3C/svg%3E" alt="Pharmacien">
                        <div class="gallery-caption">Pharma. Kabongo - Pharmacien</div>
                    </div>
                </div>
                
                <div class="gallery-nav" id="galleryNav">
                    <div class="gallery-dot active" data-index="0"></div>
                    <div class="gallery-dot" data-index="1"></div>
                    <div class="gallery-dot" data-index="2"></div>
                    <div class="gallery-dot" data-index="3"></div>
                    <div class="gallery-dot" data-index="4"></div>
                    <div class="gallery-dot" data-index="5"></div>
                </div>
            </div>
        </section>

        <!-- Location Section -->
        <section class="location-section">
            <h2 class="location-title">📍 Notre Localisation</h2>
            <p class="location-subtitle">Découvrez où nous sommes situés à Kindu</p>
            
            <div class="map-container">
                <iframe 
                    class="map-frame"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.856742574818!2d25.9487!3d-2.9337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1979aebf6f4d3e1%3A0x8c0c0c0c0c0c0c0c!2sKindu%2C%20Maniema%2C%20RDC!5e0!3m2!1sfr!2s!4v1699999999999!5m2!1sfr!2s"
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                </iframe>
            </div>
            
            <div class="address-box">
                <div class="address-item">
                    <div class="address-icon">📍</div>
                    <div>
                        <strong>Adresse</strong>
                        <p>Quartier Basoko, Avenue des Jeunes<br>Kindu, Province du Maniema, RDC</p>
                    </div>
                </div>
                <div class="address-item">
                    <div class="address-icon">📞</div>
                    <div>
                        <strong>Téléphone</strong>
                        <p>+243 000 000 000</p>
                    </div>
                </div>
                <div class="address-item">
                    <div class="address-icon">🕐</div>
                    <div>
                        <strong>Horaires</strong>
                        <p>24h/24 - 7j/7</p>
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

    <script>
        // Gallery Auto-Slide
        const track = document.getElementById('galleryTrack');
        const dots = document.querySelectorAll('.gallery-dot');
        let currentSlide = 0;
        const totalSlides = 6;
        
        function updateGallery() {
            track.style.transform = `translateX(-${currentSlide * 330}px)`;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
        
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateGallery();
        }, 3000);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateGallery();
            });
        });
    </script>
</body>
</html>
