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
--    Gestion des comptes du personnel médical
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

-- Compte administrateur par défaut (mot de passe: admin.com — à changer en production)
INSERT INTO utilisateurs (code, nom, email, mot_de_passe, role, statut)
VALUES ('USR-001', 'Administrateur', 'jehovarapha@gmail.com',
        '$2b$10$placeholder_hash_change_in_production', 'admin', 'actif');


-- ============================================================
-- 2. TABLE : patients
--    Dossiers des patients
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: PAT-001',
  nom             VARCHAR(100) NOT NULL,
  prenom          VARCHAR(100) NOT NULL,
  date_naissance  DATE         NOT NULL,
  sexe            ENUM('M','F') NOT NULL,
  adresse         VARCHAR(255) NULL,
  telephone       VARCHAR(30)  NULL,
  groupe_sanguin  ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-','Inconnu') NOT NULL DEFAULT 'Inconnu',
  allergies       TEXT         NULL,
  antecedents     TEXT         NULL COMMENT 'Antécédents médicaux',
  contact_urgence_nom  VARCHAR(100) NULL,
  contact_urgence_tel  VARCHAR(30)  NULL,
  statut          ENUM('actif','sorti','decede') NOT NULL DEFAULT 'actif',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nom (nom, prenom),
  INDEX idx_code (code)
) ENGINE=InnoDB COMMENT='Dossiers patients';


-- ============================================================
-- 3. TABLE : consultations
--    Consultations médicales
-- ============================================================
CREATE TABLE IF NOT EXISTS consultations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: CONS-001',
  patient_id      INT UNSIGNED NOT NULL,
  medecin_id      INT UNSIGNED NOT NULL COMMENT 'Référence utilisateurs (rôle médecin)',
  date_consultation DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  motif           VARCHAR(255) NOT NULL,
  symptomes       TEXT         NULL,
  diagnostic      TEXT         NULL,
  traitement      TEXT         NULL,
  observations    TEXT         NULL,
  tension         VARCHAR(20)  NULL COMMENT 'Ex: 120/80',
  temperature     DECIMAL(4,1) NULL COMMENT 'En °C',
  poids           DECIMAL(5,2) NULL COMMENT 'En kg',
  taille          DECIMAL(5,2) NULL COMMENT 'En cm',
  statut          ENUM('en_attente','en_cours','terminee','annulee') NOT NULL DEFAULT 'en_attente',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (medecin_id) REFERENCES utilisateurs(id) ON DELETE RESTRICT,
  INDEX idx_patient (patient_id),
  INDEX idx_date (date_consultation)
) ENGINE=InnoDB COMMENT='Consultations médicales';


-- ============================================================
-- 4. TABLE : ordonnances
--    Prescriptions médicales liées aux consultations
-- ============================================================
CREATE TABLE IF NOT EXISTS ordonnances (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  consultation_id INT UNSIGNED NOT NULL,
  medicament_nom  VARCHAR(150) NOT NULL,
  dosage          VARCHAR(100) NOT NULL COMMENT 'Ex: 500mg',
  frequence       VARCHAR(100) NOT NULL COMMENT 'Ex: 3 fois/jour',
  duree           VARCHAR(100) NOT NULL COMMENT 'Ex: 7 jours',
  instructions    TEXT         NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (consultation_id) REFERENCES consultations(id) ON DELETE CASCADE,
  INDEX idx_consultation (consultation_id)
) ENGINE=InnoDB COMMENT='Ordonnances / prescriptions';


-- ============================================================
-- 5. TABLE : examens_laboratoire
--    Demandes et résultats d'examens biologiques
-- ============================================================
CREATE TABLE IF NOT EXISTS examens_laboratoire (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: LAB-001',
  patient_id      INT UNSIGNED NOT NULL,
  consultation_id INT UNSIGNED NULL,
  laborantin_id   INT UNSIGNED NULL COMMENT 'Référence utilisateurs (rôle laborantin)',
  type_examen     VARCHAR(150) NOT NULL COMMENT 'Ex: NFS, Glycémie, Paludisme...',
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


-- ============================================================
-- 6. TABLE : medicaments
--    Stock de la pharmacie
-- ============================================================
CREATE TABLE IF NOT EXISTS medicaments (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: MED-001',
  nom             VARCHAR(150) NOT NULL,
  forme           ENUM('comprime','sirop','injectable','pommade','capsule','suppositoire','autre') NOT NULL DEFAULT 'comprime',
  dosage          VARCHAR(100) NOT NULL COMMENT 'Ex: 500mg',
  categorie       VARCHAR(100) NULL COMMENT 'Ex: Antibiotique, Antipaludéen...',
  stock_actuel    INT UNSIGNED NOT NULL DEFAULT 0,
  stock_minimum   INT UNSIGNED NOT NULL DEFAULT 10 COMMENT 'Seuil d alerte',
  prix_unitaire   DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'En Francs Congolais',
  date_expiration DATE         NULL,
  fournisseur     VARCHAR(150) NULL,
  statut          ENUM('disponible','rupture','expire') NOT NULL DEFAULT 'disponible',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nom (nom),
  INDEX idx_statut (statut)
) ENGINE=InnoDB COMMENT='Stock médicaments pharmacie';


-- ============================================================
-- 7. TABLE : mouvements_stock
--    Entrées et sorties de médicaments
-- ============================================================
CREATE TABLE IF NOT EXISTS mouvements_stock (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  medicament_id   INT UNSIGNED NOT NULL,
  type_mouvement  ENUM('entree','sortie','ajustement') NOT NULL,
  quantite        INT          NOT NULL COMMENT 'Positif = entrée, négatif = sortie',
  motif           VARCHAR(255) NULL COMMENT 'Ex: Dispensation patient, Réapprovisionnement...',
  patient_id      INT UNSIGNED NULL COMMENT 'Si dispensation à un patient',
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
--    Chambres d'hospitalisation
-- ============================================================
CREATE TABLE IF NOT EXISTS chambres (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  numero          VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: CH-101',
  type            ENUM('standard','vip','urgence','pediatrie','maternite') NOT NULL DEFAULT 'standard',
  capacite        TINYINT UNSIGNED NOT NULL DEFAULT 1,
  prix_par_nuit   DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'En FC',
  statut          ENUM('libre','occupee','maintenance') NOT NULL DEFAULT 'libre',
  etage           TINYINT UNSIGNED NULL,
  description     TEXT         NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_statut (statut),
  INDEX idx_type (type)
) ENGINE=InnoDB COMMENT='Chambres d hospitalisation';


-- ============================================================
-- 9. TABLE : hospitalisations
--    Séjours d'hospitalisation
-- ============================================================
CREATE TABLE IF NOT EXISTS hospitalisations (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: HOSP-001',
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
--     Facturation des prestations
-- ============================================================
CREATE TABLE IF NOT EXISTS factures (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: FAC-001',
  patient_id      INT UNSIGNED NOT NULL,
  caissier_id     INT UNSIGNED NULL COMMENT 'Référence utilisateurs (rôle caissier)',
  date_facture    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  montant_total   DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'En FC',
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


-- ============================================================
-- 11. TABLE : lignes_facture
--     Détail des prestations facturées
-- ============================================================
CREATE TABLE IF NOT EXISTS lignes_facture (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  facture_id      INT UNSIGNED NOT NULL,
  type_prestation ENUM('consultation','laboratoire','medicament','hospitalisation','autre') NOT NULL,
  description     VARCHAR(255) NOT NULL,
  quantite        INT UNSIGNED NOT NULL DEFAULT 1,
  prix_unitaire   DECIMAL(10,2) NOT NULL,
  montant         DECIMAL(12,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED,
  reference_id    INT UNSIGNED NULL COMMENT 'ID de la prestation liée (consultation, examen...)',
  FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE,
  INDEX idx_facture (facture_id)
) ENGINE=InnoDB COMMENT='Lignes de facturation';


-- ============================================================
-- 12. TABLE : bons_sortie
--     Bons de sortie / résumés de séjour
-- ============================================================
CREATE TABLE IF NOT EXISTS bons_sortie (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE COMMENT 'Ex: BS-001',
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
--     Grille tarifaire des prestations
-- ============================================================
CREATE TABLE IF NOT EXISTS tarifs (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(20)  NOT NULL UNIQUE,
  libelle         VARCHAR(200) NOT NULL,
  categorie       ENUM('consultation','laboratoire','hospitalisation','acte_medical','autre') NOT NULL,
  prix            DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'En FC',
  actif           TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Grille tarifaire';

-- Tarifs de base
INSERT INTO tarifs (code, libelle, categorie, prix) VALUES
  ('TAR-001', 'Consultation générale',          'consultation',    5000.00),
  ('TAR-002', 'Consultation spécialisée',       'consultation',   10000.00),
  ('TAR-003', 'Numération Formule Sanguine (NFS)', 'laboratoire',  3000.00),
  ('TAR-004', 'Glycémie',                       'laboratoire',    2000.00),
  ('TAR-005', 'Test paludisme (TDR)',            'laboratoire',    2500.00),
  ('TAR-006', 'Chambre standard (par nuit)',     'hospitalisation',15000.00),
  ('TAR-007', 'Chambre VIP (par nuit)',          'hospitalisation',35000.00),
  ('TAR-008', 'Chambre urgence (par nuit)',      'hospitalisation',20000.00);


-- ============================================================
-- 14. TABLE : parametres_systeme
--     Configuration générale du système
-- ============================================================
CREATE TABLE IF NOT EXISTS parametres_systeme (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cle             VARCHAR(100) NOT NULL UNIQUE,
  valeur          TEXT         NOT NULL,
  description     VARCHAR(255) NULL,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB COMMENT='Paramètres de configuration';

INSERT INTO parametres_systeme (cle, valeur, description) VALUES
  ('nom_hopital',    'Centre Médical Jéhova Rapha',  'Nom de l établissement'),
  ('ville',          'Kindu',                         'Ville'),
  ('province',       'Maniema',                       'Province'),
  ('pays',           'République Démocratique du Congo', 'Pays'),
  ('telephone',      '+243 000 000 000',              'Téléphone principal'),
  ('email',          'jehovarapha@gmail.com',         'Email de contact'),
  ('devise',         'FC',                            'Devise (Franc Congolais)'),
  ('taux_tva',       '0',                             'Taux TVA en %'),
  ('logo_url',       '',                              'URL du logo');


-- ============================================================
-- VUES UTILES
-- ============================================================

-- Vue : patients avec leur dernière consultation
CREATE OR REPLACE VIEW v_patients_resume AS
SELECT
  p.id,
  p.code,
  CONCAT(p.prenom, ' ', p.nom) AS nom_complet,
  p.date_naissance,
  TIMESTAMPDIFF(YEAR, p.date_naissance, CURDATE()) AS age,
  p.sexe,
  p.telephone,
  p.groupe_sanguin,
  p.statut,
  MAX(c.date_consultation) AS derniere_consultation,
  COUNT(c.id) AS nb_consultations
FROM patients p
LEFT JOIN consultations c ON c.patient_id = p.id
GROUP BY p.id;

-- Vue : factures avec solde
CREATE OR REPLACE VIEW v_factures_solde AS
SELECT
  f.id,
  f.code,
  CONCAT(p.prenom, ' ', p.nom) AS patient,
  f.date_facture,
  f.montant_total,
  f.montant_paye,
  f.montant_restant,
  f.statut,
  f.mode_paiement
FROM factures f
JOIN patients p ON p.id = f.patient_id;

-- Vue : stock médicaments avec alertes
CREATE OR REPLACE VIEW v_stock_alertes AS
SELECT
  id,
  code,
  nom,
  forme,
  dosage,
  stock_actuel,
  stock_minimum,
  prix_unitaire,
  date_expiration,
  statut,
  CASE
    WHEN stock_actuel = 0 THEN 'rupture'
    WHEN stock_actuel <= stock_minimum THEN 'critique'
    WHEN stock_actuel <= stock_minimum * 1.5 THEN 'faible'
    ELSE 'normal'
  END AS niveau_stock
FROM medicaments
WHERE statut != 'expire';

-- Vue : taux d'occupation des chambres
CREATE OR REPLACE VIEW v_occupation_chambres AS
SELECT
  type,
  COUNT(*) AS total,
  SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) AS occupees,
  SUM(CASE WHEN statut = 'libre' THEN 1 ELSE 0 END) AS libres,
  ROUND(SUM(CASE WHEN statut = 'occupee' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS taux_occupation
FROM chambres
GROUP BY type;


-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
-- Instructions d'installation :
-- 1. Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
-- 2. Cliquer sur "Importer"
-- 3. Sélectionner ce fichier : jehova_rapha.sql
-- 4. Cliquer sur "Exécuter"
-- 5. La base de données sera créée avec toutes les tables
-- ============================================================
