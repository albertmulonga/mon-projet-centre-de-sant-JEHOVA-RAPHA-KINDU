-- ============================================================
--  BASE DE DONNÉES : Centre Médical Jéhova Rapha de Kindu
--  Fichier SQL pour XAMPP / MySQL 5.7+
--  Créé le : 2024
--  Encodage : UTF-8
-- ============================================================

CREATE DATABASE IF NOT EXISTS jehova_rapha
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jehova_rapha;

-- ============================================================
-- 1. TABLE : utilisateurs
-- ============================================================
CREATE TABLE IF NOT EXISTS utilisateurs (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: USR-001',
  nom           VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt',
  role          ENUM('admin','medecin','infirmier','caissier','laborantin','pharmacien') NOT NULL DEFAULT 'infirmier',
  statut        ENUM('actif','inactif') NOT NULL DEFAULT 'actif',
  derniere_connexion DATETIME NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Comptes utilisateurs du système';

-- Comptes de test (mot de passe: admin123 pour tous)
INSERT INTO utilisateurs (code, nom, email, mot_de_passe, role, statut) VALUES
('USR-001', 'Administrateur', 'admin@jehovarapha.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'actif'),
('USR-002', 'Dr. Mukamba', 'dr.mukamba@jehovarapha.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'medecin', 'actif'),
('USR-003', 'Infirmier Mwamba', 'inf.mwamba@jehovarapha.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'infirmier', 'actif'),
('USR-004', 'Caissier Kasongo', 'caissier.kasongo@jehovarapha.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'caissier', 'actif'),
('USR-005', 'Laborantin Mbuji', 'labo.mbuji@jehovarapha.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'laborantin', 'actif'),
('USR-006', 'Pharmacien Kabongo', 'pharma.kabongo@jehovarapha.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pharmacien', 'actif');


-- ============================================================
-- 2. TABLE : patients
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  nom             VARCHAR(100) NOT NULL,
  prenom          VARCHAR(100) NOT NULL,
  date_naissance  DATE         NOT NULL,
  sexe            ENUM('M','F') NOT NULL,
  adresse         VARCHAR(255) NULL,
  telephone       VARCHAR(30)  NULL,
  groupe_sanguin  ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-','Inconnu') NOT NULL DEFAULT 'Inconnu',
  allergies       TEXT         NULL,
  antecedents     TEXT         NULL,
  contact_urgence_nom  VARCHAR(100) NULL,
  contact_urgence_tel  VARCHAR(30)  NULL,
  statut          ENUM('actif','sorti','decede') NOT NULL DEFAULT 'actif',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nom (nom, prenom),
  INDEX idx_code (code)
) ENGINE=InnoDB COMMENT='Dossiers patients';

-- Patients de test
INSERT INTO patients (code, nom, prenom, date_naissance, sexe, adresse, telephone, groupe_sanguin, allergies, antecedents) VALUES
('PAT-001', 'Kasongo', 'David', '1985-03-15', 'M', 'Kindu, Quartier Plateau', '+243 812 345 678', 'O+', 'Pénicilline', 'Asthme'),
('PAT-002', 'Mwamba', 'Marie', '1990-07-22', 'F', 'Kindu, Avenue du Commerce', '+243 823 456 789', 'A+', NULL, 'Diabète type 2'),
('PAT-003', 'Mbuji', 'Joseph', '1978-11-08', 'M', 'Kindu, Rue de la Paix', '+243 834 567 890', 'B+', 'Aspirine', NULL),
('PAT-004', 'Kabongo', 'Grace', '1995-01-30', 'F', 'Kindu, Quartier Bel kampus', '+243 845 678 901', 'O-', NULL, NULL),
('PAT-005', 'Mutombo', 'Pierre', '1982-09-12', 'M', 'Kindu, Avenue Lumumba', '+243 856 789 012', 'AB+', 'Sulfa', 'Hypertension'),
('PAT-006', 'Tshibangu', 'Claire', '2000-05-18', 'F', 'Kindu, Rue du Marché', '+243 867 890 123', 'A-', NULL, NULL);


-- ============================================================
-- 3. TABLE : consultations
-- ============================================================
CREATE TABLE IF NOT EXISTS consultations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  patient_id      INT UNSIGNED NOT NULL,
  medecin_id      INT UNSIGNED NOT NULL,
  date_consultation DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  motif           VARCHAR(255) NOT NULL,
  symptomes       TEXT         NULL,
  diagnostic      TEXT         NULL,
  traitement      TEXT         NULL,
  observations    TEXT         NULL,
  tension         VARCHAR(20)  NULL,
  temperature     DECIMAL(4,1) NULL,
  poids           DECIMAL(5,2) NULL,
  taille          DECIMAL(5,2) NULL,
  statut          ENUM('en_attente','en_cours','terminee','annulee') NOT NULL DEFAULT 'en_attente',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (medecin_id) REFERENCES utilisateurs(id) ON DELETE RESTRICT,
  INDEX idx_patient (patient_id),
  INDEX idx_date (date_consultation)
) ENGINE=InnoDB COMMENT='Consultations médicales';

-- Consultations de test
INSERT INTO consultations (code, patient_id, medecin_id, date_consultation, motif, symptomes, diagnostic, traitement, tension, temperature, poids, taille, statut) VALUES
('CONS-001', 1, 2, NOW() - INTERVAL 2 DAY, 'Fièvre et fatigue', 'Fièvre depuis 3 jours, fatigue intense', 'Paludisme', 'Coartem 4 comprimés 2x/jour pendant 3 jours', '120/80', 38.5, 75, 175, 'terminee'),
('CONS-002', 2, 2, NOW() - INTERVAL 1 DAY, 'Contrôle diabète', 'Contrôle glycémique mensuel', 'Diabète stable', 'Continuer Glucophage 500mg 2x/jour', '130/85', 37.0, 68, 165, 'terminee'),
('CONS-003', 3, 2, NOW() - INTERVAL 5 DAY, 'Douleurs abdominales', 'Douleurs épigastriques', 'Gastrite', 'Oméprazole 20mg matin et soir', '125/82', 37.2, 82, 178, 'terminee'),
('CONS-004', 4, 2, NOW(), 'Mal de tête', 'Céphalées persistantes', 'Migraine', 'Paracétamol 1g 3x/jour si douleur', '118/75', 36.8, 55, 160, 'terminee');


-- ============================================================
-- 4. TABLE : ordonnances
-- ============================================================
CREATE TABLE IF NOT EXISTS ordonnances (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT UNSIGNED NOT NULL,
  medicament_nom  VARCHAR(150) NOT NULL,
  dosage          VARCHAR(100) NOT NULL,
  frequence       VARCHAR(100) NOT NULL,
  duree           VARCHAR(100) NOT NULL,
  instructions    TEXT         NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
  INDEX idx_consultation (consultation_id)
) ENGINE=InnoDB COMMENT='Ordonnances / prescriptions';


-- ============================================================
-- 5. TABLE : examens_laboratoire
-- ============================================================
CREATE TABLE IF NOT EXISTS examens_laboratoire (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  patient_id      INT UNSIGNED NOT NULL,
  consultation_id INT UNSIGNED NULL,
  laborantin_id   INT UNSIGNED NULL,
  type_examen     VARCHAR(150) NOT NULL,
  date_demande    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_resultat   DATETIME     NULL,
  resultat        TEXT         NULL,
  valeurs_normales TEXT        NULL,
  interpretation  TEXT         NULL,
  statut          ENUM('demande','en_cours','resultat_disponible','annule') NOT NULL DEFAULT 'demande',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id)      REFERENCES patients(id)      ON DELETE RESTRICT,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL,
  FOREIGN KEY (laborantin_id)   REFERENCES utilisateurs(id)  ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_statut (statut)
) ENGINE=InnoDB COMMENT='Examens de laboratoire';

-- Examens de test
INSERT INTO examens_laboratoire (code, patient_id, consultation_id, type_examen, date_demande, date_resultat, resultat, interpretation, statut) VALUES
('LAB-001', 1, 1, 'Test Paludisme (TDR)', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY, 'Positif', 'Paludisme à Plasmodium falciparum', 'resultat_disponible'),
('LAB-002', 2, 2, 'Glycémie', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY, '1.20 g/L', 'Glycémie normale à jeun', 'resultat_disponible'),
('LAB-003', 3, 3, 'NFS', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY, 'GB: 8000, GR: 4500000, Hb: 13.5', 'NFS normale', 'resultat_disponible'),
('LAB-004', 4, 4, 'Test Paludisme (TDR)', NOW(), NULL, NULL, NULL, 'demande');


-- ============================================================
-- 6. TABLE : medicaments
-- ============================================================
CREATE TABLE IF NOT EXISTS medicaments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  nom             VARCHAR(150) NOT NULL,
  forme           ENUM('comprime','sirop','injectable','pommade','capsule','suppositoire','autre') NOT NULL DEFAULT 'comprime',
  dosage          VARCHAR(100) NOT NULL,
  categorie       VARCHAR(100) NULL,
  stock_actuel    INT UNSIGNED NOT NULL DEFAULT 0,
  stock_minimum   INT UNSIGNED NOT NULL DEFAULT 10,
  prix_unitaire   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  date_expiration DATE         NULL,
  fournisseur     VARCHAR(150) NULL,
  statut          ENUM('disponible','rupture','expire') NOT NULL DEFAULT 'disponible',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nom (nom),
  INDEX idx_statut (statut)
) ENGINE=InnoDB COMMENT='Stock médicaments pharmacie';

-- Médicaments de test
INSERT INTO medicaments (code, nom, forme, dosage, categorie, stock_actuel, stock_minimum, prix_unitaire, date_expiration, fournisseur, statut) VALUES
('MED-001', 'Paracétamol 500mg', 'comprime', '500mg', 'Antalgique', 150, 20, 500, '2026-12-31', 'Pharmacie Centrale', 'disponible'),
('MED-002', 'Amoxicilline 500mg', 'capsule', '500mg', 'Antibiotique', 80, 30, 1200, '2026-06-30', 'Pharmacie Centrale', 'disponible'),
('MED-003', 'Coartem', 'comprime', '20/120mg', 'Antipaludéen', 45, 50, 2500, '2025-12-31', 'PSI', 'disponible'),
('MED-004', 'Aspirine 100mg', 'comprime', '100mg', 'Anticoagulant', 5, 20, 300, '2026-09-30', 'Pharmacie Centrale', 'disponible'),
('MED-005', 'Glucophage 500mg', 'comprime', '500mg', 'Antidiabétique', 60, 25, 1800, '2026-08-31', 'Pharmacie Centrale', 'disponible'),
('MED-006', 'Oméprazole 20mg', 'comprime', '20mg', 'Antiulcéreux', 40, 15, 1500, '2026-07-31', 'Pharmacie Centrale', 'disponible'),
('MED-007', 'Sirop amoxicilline', 'sirop', '250mg/5ml', 'Antibiotique', 20, 10, 3500, '2026-05-31', 'Pharmacie Centrale', 'disponible'),
('MED-008', 'Serum physiologique', 'injectable', '0.9%', 'Solution', 10, 5, 800, '2026-03-31', 'Pharmacie Centrale', 'disponible');


-- ============================================================
-- 7. TABLE : mouvements_stock
-- ============================================================
CREATE TABLE IF NOT EXISTS mouvements_stock (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  medicament_id   INT UNSIGNED NOT NULL,
  type_mouvement  ENUM('entree','sortie','ajustement') NOT NULL,
  quantite        INT          NOT NULL,
  motif           VARCHAR(255) NULL,
  patient_id      INT UNSIGNED NULL,
  utilisateur_id  INT UNSIGNED NULL,
  date_mouvement  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicament_id)  REFERENCES medicaments(id)   ON DELETE RESTRICT,
  FOREIGN KEY (patient_id)     REFERENCES patients(id)      ON DELETE SET NULL,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)  ON DELETE SET NULL,
  INDEX idx_medicament (medicament_id),
  INDEX idx_date (date_mouvement)
) ENGINE=InnoDB COMMENT='Mouvements de stock pharmacie';


-- ============================================================
-- 8. TABLE : chambres
-- ============================================================
CREATE TABLE IF NOT EXISTS chambres (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero          VARCHAR(20)  NOT NULL UNIQUE,
  type            ENUM('standard','vip','urgence','pediatrie','maternite') NOT NULL DEFAULT 'standard',
  capacite        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  prix_par_nuit   DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  statut          ENUM('libre','occupee','maintenance') NOT NULL DEFAULT 'libre',
  etage           TINYINT UNSIGNED NULL,
  description     TEXT         NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_statut (statut),
  INDEX idx_type (type)
) ENGINE=InnoDB COMMENT='Chambres d hospitalisation';

-- Chambres de test
INSERT INTO chambres (numero, type, capacite, prix_par_nuit, statut, etage, description) VALUES
('101', 'standard', 1, 15000, 'libre', 1, 'Chambre individuelle standard'),
('102', 'standard', 1, 15000, 'libre', 1, 'Chambre individuelle standard'),
('103', 'standard', 2, 12000, 'libre', 1, 'Chambre double standard'),
('201', 'vip', 1, 35000, 'libre', 2, 'Chambre VIP avec sanitaires privés'),
('202', 'vip', 1, 35000, 'libre', 2, 'Chambre VIP avec sanitaires privés'),
('301', 'urgence', 1, 20000, 'libre', 3, 'Chambre d\'urgence'),
('302', 'urgence', 1, 20000, 'libre', 3, 'Chambre d\'urgence');


-- ============================================================
-- 9. TABLE : hospitalisations
-- ============================================================
CREATE TABLE IF NOT EXISTS hospitalisations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  patient_id      INT UNSIGNED NOT NULL,
  chambre_id      INT UNSIGNED NOT NULL,
  medecin_id      INT UNSIGNED NOT NULL,
  consultation_id INT UNSIGNED NULL,
  date_entree     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_sortie_prevue DATE      NULL,
  date_sortie_reelle DATETIME  NULL,
  motif           VARCHAR(255) NOT NULL,
  diagnostic      TEXT         NULL,
  evolution       TEXT         NULL,
  statut          ENUM('en_cours','sorti','transfere','decede') NOT NULL DEFAULT 'en_cours',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id)      REFERENCES patients(id)      ON DELETE RESTRICT,
  FOREIGN KEY (chambre_id)      REFERENCES chambres(id)      ON DELETE RESTRICT,
  FOREIGN KEY (medecin_id)      REFERENCES utilisateurs(id)  ON DELETE RESTRICT,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_statut (statut)
) ENGINE=InnoDB COMMENT='Hospitalisations';


-- ============================================================
-- 10. TABLE : factures
-- ============================================================
CREATE TABLE IF NOT EXISTS factures (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  patient_id      INT UNSIGNED NOT NULL,
  caissier_id     INT UNSIGNED NULL,
  date_facture    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  montant_total   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  montant_paye    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  montant_restant DECIMAL(12,2) GENERATED ALWAYS AS (montant_total - montant_paye) STORED,
  mode_paiement   ENUM('especes','mobile_money','virement','assurance','autre') NULL,
  statut          ENUM('en_attente','partiel','paye','annule') NOT NULL DEFAULT 'en_attente',
  notes           TEXT         NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id)  REFERENCES patients(id)     ON DELETE RESTRICT,
  FOREIGN KEY (caissier_id) REFERENCES utilisateurs(id) ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_statut (statut),
  INDEX idx_date (date_facture)
) ENGINE=InnoDB COMMENT='Factures et paiements';

-- Factures de test
INSERT INTO factures (code, patient_id, caissier_id, date_facture, montant_total, montant_paye, mode_paiement, statut) VALUES
('FAC-001', 1, 4, NOW() - INTERVAL 2 DAY, 15000, 15000, 'especes', 'paye'),
('FAC-002', 2, 4, NOW() - INTERVAL 1 DAY, 8000, 8000, 'mobile_money', 'paye'),
('FAC-003', 3, 4, NOW() - INTERVAL 5 DAY, 12000, 5000, 'especes', 'partiel');


-- ============================================================
-- 11. TABLE : lignes_facture
-- ============================================================
CREATE TABLE IF NOT EXISTS lignes_facture (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  facture_id      INT UNSIGNED NOT NULL,
  type_prestation ENUM('consultation','laboratoire','medicament','hospitalisation','autre') NOT NULL,
  description     VARCHAR(255) NOT NULL,
  quantite        INT UNSIGNED NOT NULL DEFAULT 1,
  prix_unitaire   DECIMAL(10,2) NOT NULL,
  montant         DECIMAL(12,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
  reference_id    INT UNSIGNED NULL,
  FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE,
  INDEX idx_facture (facture_id)
) ENGINE=InnoDB COMMENT='Lignes de facturation';


-- ============================================================
-- 12. TABLE : bons_sortie
-- ============================================================
CREATE TABLE IF NOT EXISTS bons_sortie (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  patient_id      INT UNSIGNED NOT NULL,
  hospitalisation_id INT UNSIGNED NULL,
  medecin_id      INT UNSIGNED NOT NULL,
  facture_id      INT UNSIGNED NULL,
  date_sortie     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diagnostic_final TEXT        NOT NULL,
  traitement_suivi TEXT        NULL,
  recommandations  TEXT        NULL,
  prochain_rdv    DATE         NULL,
  etat_sortie     ENUM('gueri','ameliore','stationnaire','transfere','contre_avis_medical','decede') NOT NULL DEFAULT 'gueri',
  notes           TEXT         NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id)         REFERENCES patients(id)         ON DELETE RESTRICT,
  FOREIGN KEY (hospitalisation_id) REFERENCES hospitalisations(id) ON DELETE SET NULL,
  FOREIGN KEY (medecin_id)         REFERENCES utilisateurs(id)     ON DELETE RESTRICT,
  FOREIGN KEY (facture_id)         REFERENCES factures(id)         ON DELETE SET NULL,
  INDEX idx_patient (patient_id),
  INDEX idx_date (date_sortie)
) ENGINE=InnoDB COMMENT='Bons de sortie';


-- ============================================================
-- 13. TABLE : tarifs
-- ============================================================
CREATE TABLE IF NOT EXISTS tarifs (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  libelle         VARCHAR(200) NOT NULL,
  categorie       ENUM('consultation','laboratoire','hospitalisation','acte_medical','autre') NOT NULL,
  prix            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  actif           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Grille tarifaire';

INSERT INTO tarifs (code, libelle, categorie, prix) VALUES
('TAR-001', 'Consultation générale', 'consultation', 5000.00),
('TAR-002', 'Consultation spécialisée', 'consultation', 10000.00),
('TAR-003', 'NFS', 'laboratoire', 3000.00),
('TAR-004', 'Glycémie', 'laboratoire', 2000.00),
('TAR-005', 'Test paludisme', 'laboratoire', 2500.00),
('TAR-006', 'Chambre standard (nuit)', 'hospitalisation', 15000.00),
('TAR-007', 'Chambre VIP (nuit)', 'hospitalisation', 35000.00),
('TAR-008', 'Chambre urgence (nuit)', 'hospitalisation', 20000.00);


-- ============================================================
-- 14. TABLE : parametres_systeme
-- ============================================================
CREATE TABLE IF NOT EXISTS parametres_systeme (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cle             VARCHAR(100) NOT NULL UNIQUE,
  valeur          TEXT         NOT NULL,
  description     VARCHAR(255) NULL,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Paramètres de configuration';

INSERT INTO parametres_systeme (cle, valeur, description) VALUES
('nom_hopital', 'Centre Médical Jéhova Rapha', 'Nom de l\'établissement'),
('ville', 'Kindu', 'Ville'),
('province', 'Maniema', 'Province'),
('pays', 'République Démocratique du Congo', 'Pays'),
('telephone', '+243 812 345 678', 'Téléphone principal'),
('email', 'jehovarapha@gmail.com', 'Email de contact'),
('devise', 'FC', 'Devise (Franc Congolais)'),
('taux_tva', '0', 'Taux TVA en %'),
('logo_url', '', 'URL du logo');


-- ============================================================
-- VUES
-- ============================================================
CREATE OR REPLACE VIEW v_patients_resume AS
SELECT
  p.id, p.code, CONCAT(p.prenom, ' ', p.nom) AS nom_complet,
  p.date_naissance, TIMESTAMPDIFF(YEAR, p.date_naissance, CURDATE()) AS age,
  p.sexe, p.telephone, p.groupe_sanguin, p.statut,
  MAX(c.date_consultation) AS derniere_consultation,
  COUNT(c.id) AS nb_consultations
FROM patients p
LEFT JOIN consultations c ON c.patient_id = p.id
GROUP BY p.id;

CREATE OR REPLACE VIEW v_factures_solde AS
SELECT
  f.id, f.code, CONCAT(p.prenom, ' ', p.nom) AS patient,
  f.date_facture, f.montant_total, f.montant_paye, f.montant_restant, f.statut, f.mode_paiement
FROM factures f
JOIN patients p ON p.id = f.patient_id;

CREATE OR REPLACE VIEW v_stock_alertes AS
SELECT id, code, nom, forme, dosage, stock_actuel, stock_minimum, prix_unitaire, date_expiration, statut,
  CASE
    WHEN stock_actuel = 0 THEN 'rupture'
    WHEN stock_actuel <= stock_minimum THEN 'critique'
    WHEN stock_actuel <= stock_minimum * 1.5 THEN 'faible'
    ELSE 'normal'
  END AS niveau_stock
FROM medicaments
WHERE statut != 'expire';

CREATE OR REPLACE VIEW v_occupation_chambres AS
SELECT type, COUNT(*) AS total,
  SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) AS occupees,
  SUM(CASE WHEN statut = 'libre' THEN 1 ELSE 0 END) AS libres,
  ROUND(SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS taux_occupation
FROM chambres
GROUP BY type;


-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
