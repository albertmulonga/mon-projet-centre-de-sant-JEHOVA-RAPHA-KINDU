# Centre Médical Jéhova Rapha de Kindu
## Système de Gestion Hospitalière

### Installation

1. **Copier le projet vers XAMPP**
   - Copiez le dossier `php_jehova_rapha` dans le dossier `htdocs` de XAMPP:
   ```
   C:\xampp\htdocs\php_jehova_rapha
   ```

2. **Importer la base de données**
   - Ouvrez phpMyAdmin (http://localhost/phpmyadmin)
   - Cliquez sur "Importer"
   - Sélectionnez le fichier `jehova_rapha.sql`
   - Cliquez sur "Exécuter"

3. **Configurer la connexion**
   - Le fichier `config/db.php` est déjà configuré pour XAMPP par défaut:
     - Host: localhost
     - Database: jehova_rapha
     - User: root
     - Password: (vide)

4. **Lancer l'application**
   - Ouvrez votre navigateur et allez sur: http://localhost/php_jehova_rapha/

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Administrateur | admin@jehovarapha.com | admin123 |
| Médecin | dr.mukamba@jehovarapha.com | admin123 |
| Infirmier | inf.mwamba@jehovarapha.com | admin123 |
| Caissier | caissier.kasongo@jehovarapha.com | admin123 |
| Laborantin | labo.mbuji@jehovarapha.com | admin123 |
| Pharmacien | pharma.kabongo@jehovarapha.com | admin123 |

### Fonctionnalités

- **Patients**: Enregistrement et gestion des dossiers patients
- **Consultations**: Consultations médicales avec ordonnances
- **Laboratoire**: Demandes et résultats d'examens
- **Pharmacie**: Gestion du stock de médicaments
- **Hospitalisation**: Gestion des chambres et admissions
- **Facturation**: Création de factures et paiements
- **Bons de sortie**: Résumés de sortie médicaux
- **Rapports**: Statistiques et analyses
- **Utilisateurs**: Gestion des comptes
- **Paramètres**: Configuration du système

### Changement du mot de passe admin

1. Connectez-vous avec le compte administrateur
2. Allez dans "Paramètres"
3. Changez votre mot de passe

### Support

Pour toute question ou problème, contactez: jehovarapha@gmail.com

---
© 2024 Centre Médical Jéhova Rapha de Kindu
