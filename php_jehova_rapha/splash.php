<?php
/**
 * Splash Screen - Centre Médical Jéhova Rapha de Kindu
 * Écran de démarrage avec animation et logo
 */
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Centre Médical Jéhova Rapha - Kindu</title>
    <style>
        /* Reset */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1a5276 0%, #148f77 50%, #0d6e56 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        /* Splash Container */
        .splash-container {
            text-align: center;
            color: white;
            animation: fadeIn 1s ease-in-out;
        }

        /* Logo Circle */
        .splash-logo {
            width: 180px;
            height: 180px;
            background: rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            animation: pulse 2s infinite, logoScale 0.8s ease-out;
            overflow: hidden;
        }

        .splash-logo img {
            width: 120px;
            height: 120px;
            object-fit: contain;
        }

        .splash-logo .logo-text {
            font-size: 60px;
        }

        /* Hospital Icon Fallback */
        .splash-logo .hospital-icon {
            font-size: 80px;
        }

        /* Title */
        .splash-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            animation: slideUp 0.8s ease-out 0.3s both;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .splash-subtitle {
            font-size: 1.3rem;
            margin-bottom: 40px;
            opacity: 0.9;
            animation: slideUp 0.8s ease-out 0.5s both;
        }

        /* Location */
        .splash-location {
            font-size: 1rem;
            opacity: 0.8;
            animation: slideUp 0.8s ease-out 0.7s both;
        }

        /* Loading Animation */
        .splash-loader {
            margin-top: 50px;
            animation: slideUp 0.8s ease-out 0.9s both;
        }

        .loader-bar {
            width: 200px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin: 0 auto;
            overflow: hidden;
        }

        .loader-progress {
            height: 100%;
            background: white;
            border-radius: 2px;
            animation: loading 2s ease-in-out forwards;
        }

        /* Loading Dots */
        .loading-text {
            margin-top: 15px;
            font-size: 0.9rem;
            opacity: 0.7;
        }

        .loading-dots {
            display: inline-block;
        }

        .loading-dots::after {
            content: '';
            animation: dots 1.5s infinite;
        }

        /* Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes logoScale {
            from { 
                transform: scale(0);
                opacity: 0;
            }
            to { 
                transform: scale(1);
                opacity: 1;
            }
        }

        @keyframes pulse {
            0%, 100% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
            50% {
                box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
            }
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
        }

        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }

        /* Decorative Elements */
        .splash-decoration {
            position: absolute;
            border-radius: 50%;
            opacity: 0.1;
        }

        .decoration-1 {
            width: 300px;
            height: 300px;
            background: white;
            top: -100px;
            left: -100px;
            animation: float 6s ease-in-out infinite;
        }

        .decoration-2 {
            width: 200px;
            height: 200px;
            background: white;
            bottom: -50px;
            right: -50px;
            animation: float 8s ease-in-out infinite reverse;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, 30px); }
        }

        /* Responsive */
        @media (max-width: 480px) {
            .splash-logo {
                width: 140px;
                height: 140px;
            }
            
            .splash-title {
                font-size: 1.8rem;
            }
            
            .splash-subtitle {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <!-- Decorative circles -->
    <div class="splash-decoration decoration-1"></div>
    <div class="splash-decoration decoration-2"></div>

    <div class="splash-container">
        <!-- Logo -->
        <div class="splash-logo">
            <?php 
            // Check if custom logo exists
            $logo_path = 'assets/logo/logo.png';
            if (file_exists($logo_path)): 
            ?>
                <img src="<?php echo $logo_path; ?>" alt="Logo">
            <?php else: ?>
                <span class="hospital-icon">🏥</span>
            <?php endif; ?>
        </div>

        <!-- Title -->
        <h1 class="splash-title">Centre Médical</h1>
        <h2 class="splash-subtitle">Jéhova Rapha</h2>
        
        <!-- Location -->
        <p class="splash-location">📍 Kindu, Maniema - République Démocratique du Congo</p>

        <!-- Loading -->
        <div class="splash-loader">
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
            <p class="loading-text">Chargement<span class="loading-dots"></span></p>
        </div>
    </div>

    <script>
        // Redirect to login after animation
        setTimeout(function() {
            window.location.href = 'login.php';
        }, 3000);
    </script>
</body>
</html>
