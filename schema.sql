-- ============================================================
--  TranspoBot — Base de données MySQL (Updated Schema)
--  Projet GLSi L3 — ESP/UCAD
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS transpobot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE transpobot;

-- Véhicules
CREATE TABLE vehicules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    immatriculation VARCHAR(20) NOT NULL UNIQUE,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    type ENUM('bus','minibus','car') NOT NULL,
    capacite INT NOT NULL,
    etat ENUM('actif','maintenance','retire') DEFAULT 'actif',
    kilometrage INT DEFAULT 0,
    date_mise_service DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chauffeurs
CREATE TABLE chauffeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(20) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    permis_categorie VARCHAR(10),
    statut ENUM('disponible','en_service','conge','suspendu') DEFAULT 'disponible',
    date_embauche DATE,
    vehicule_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id)
);

-- Lignes
CREATE TABLE lignes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10) NOT NULL UNIQUE,
    nom VARCHAR(100),
    depart VARCHAR(100) NOT NULL,
    arrivee VARCHAR(100) NOT NULL,
    distance_km DECIMAL(6,1),
    duree_moyenne_min INT,
    active BOOLEAN DEFAULT TRUE
);

-- Tarifs
CREATE TABLE tarifs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ligne_id INT NOT NULL,
    categorie ENUM('standard','etudiant','senior') DEFAULT 'standard',
    prix DECIMAL(10,2) NOT NULL,
    date_effet DATE,
    FOREIGN KEY (ligne_id) REFERENCES lignes(id)
);

-- Trajets
CREATE TABLE trajets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ligne_id INT NOT NULL,
    vehicule_id INT NOT NULL,
    chauffeur_id INT NOT NULL,
    date_depart DATETIME NOT NULL,
    date_arrivee DATETIME,
    nb_passagers INT DEFAULT 0,
    recette DECIMAL(10,2) DEFAULT 0,
    statut ENUM('planifie','en_cours','termine','annule') DEFAULT 'planifie',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ligne_id) REFERENCES lignes(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id),
    FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id)
);

-- Incidents
CREATE TABLE incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trajet_id INT NOT NULL,
    vehicule_id INT NOT NULL,
    chauffeur_id INT NOT NULL,
    type ENUM('panne','accident','retard','infraction') NOT NULL,
    gravite ENUM('faible','moyenne','elevee','critique') DEFAULT 'faible',
    description TEXT,
    date_incident DATETIME NOT NULL,
    resolu BOOLEAN DEFAULT FALSE,
    date_resolution DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trajet_id) REFERENCES trajets(id),
    FOREIGN KEY (vehicule_id) REFERENCES vehicules(id),
    FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id)
);

-- Utilisateurs (authentification)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role ENUM('admin','gestionnaire') DEFAULT 'gestionnaire',
    nom VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, hashed_password, role, nom) VALUES
('admin', '$2b$12$RAytLWRmfdr9vhjpL5CN1uu2dv4y4QxnNfwm/MHbKLATyF8YUo1re', 'admin', 'Administrateur'),
('gestionnaire', '$2b$12$rG6U2v3gtPeflxNS.ON0P.DqcxzhuoHVMlzTRnFXeWuO1nFVIIBeS', 'gestionnaire', 'Gestionnaire');

-- Historique des conversations IA
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    reponse TEXT NOT NULL,
    sql_genere TEXT,
    nb_resultats INT DEFAULT 0,
    source VARCHAR(20) DEFAULT 'web',
    username VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
);

-- ============================================================
--  Données de test
-- ============================================================
INSERT INTO vehicules (immatriculation, marque, modele, type, capacite, etat, kilometrage, date_mise_service) VALUES
('DK-1234-AB', 'Mercedes', 'Citaro',    'bus',     60, 'actif',       45000,  '2021-03-15'),
('DK-5678-CD', 'Toyota',   'Coaster',   'minibus', 25, 'actif',       32000,  '2022-06-01'),
('DK-9012-EF', 'Volvo',    'B7R',       'bus',     60, 'maintenance', 78000,  '2019-11-20'),
('DK-3456-GH', 'King Long', 'XMQ6127',  'car',      5, 'actif',      120000, '2020-01-10'),
('DK-7890-IJ', 'Toyota',   'HiAce',    'minibus', 25, 'actif',       15000,  '2023-09-05');

INSERT INTO chauffeurs (matricule, nom, telephone, permis_categorie, statut, vehicule_id, date_embauche) VALUES
('MAT-001', 'Mamadou DIOP',    '+221771234567', 'D',  'en_service',  1, '2019-04-01'),
('MAT-002', 'Ibrahima FALL',   '+221772345678', 'D',  'en_service',  2, '2020-07-15'),
('MAT-003', 'Fatou NDIAYE',    '+221773456789', 'B',  'disponible',  4, '2021-02-01'),
('MAT-004', 'Ousmane SECK',    '+221774567890', 'D',  'en_service',  5, '2022-10-20'),
('MAT-005', 'Aminata BA',      '+221775678901', 'D',  'disponible',  NULL, '2023-01-10');

INSERT INTO lignes (numero, nom, depart, arrivee, distance_km, duree_moyenne_min, active) VALUES
('L1', 'Ligne Dakar-Thiès',     'Dakar',       'Thiès',  70.5, 90,  TRUE),
('L2', 'Ligne Dakar-Mbour',     'Dakar',       'Mbour',  82.0, 120, TRUE),
('L3', 'Ligne Centre-Banlieue', 'Plateau',     'Pikine', 15.0, 45,  TRUE),
('L4', 'Ligne Aéroport',        'Centre-ville','AIBD',   45.0, 60,  TRUE);

INSERT INTO tarifs (ligne_id, categorie, prix, date_effet) VALUES
(1, 'standard', 2500, '2024-01-01'), (1, 'etudiant', 1500, '2024-01-01'), (1, 'senior', 1800, '2024-01-01'),
(2, 'standard', 3000, '2024-01-01'), (2, 'etudiant', 1800, '2024-01-01'),
(3, 'standard', 500,  '2024-01-01'), (3, 'etudiant', 300,  '2024-01-01'),
(4, 'standard', 5000, '2024-01-01'), (4, 'etudiant', 3000, '2024-01-01');

INSERT INTO trajets (ligne_id, vehicule_id, chauffeur_id, date_depart, date_arrivee, statut, nb_passagers, recette) VALUES
(1, 1, 1, '2026-03-01 06:00:00', '2026-03-01 07:30:00', 'termine', 55, 137500),
(1, 2, 2, '2026-03-01 08:00:00', '2026-03-01 09:30:00', 'termine', 20, 50000),
(2, 4, 3, '2026-03-02 07:00:00', '2026-03-02 09:00:00', 'termine', 4, 12000),
(3, 5, 4, '2026-03-05 07:30:00', '2026-03-05 08:15:00', 'termine', 22, 11000),
(1, 1, 1, '2026-03-10 06:00:00', '2026-03-10 07:30:00', 'termine', 58, 145000),
(4, 2, 2, '2026-03-12 09:00:00', '2026-03-12 10:00:00', 'termine', 18, 90000),
(1, 1, 5, '2026-03-20 06:00:00', NULL,                   'en_cours', 45, 112500);

INSERT INTO incidents (trajet_id, vehicule_id, chauffeur_id, type, gravite, description, date_incident, resolu, date_resolution) VALUES
(2, 2, 2, 'retard',   'faible',  'Embouteillage au centre-ville',       '2026-03-01 08:45:00', TRUE,  '2026-03-01 09:30:00'),
(3, 4, 3, 'panne',    'moyenne', 'Crevaison pneu avant droit',          '2026-03-02 07:30:00', TRUE,  '2026-03-02 08:30:00'),
(6, 2, 2, 'accident', 'elevee',  'Accrochage léger au rond-point',      '2026-03-12 09:20:00', FALSE, NULL);

-- ============================================================
--  VUES MySQL
-- ============================================================

CREATE OR REPLACE VIEW v_chauffeurs_vehicules AS
SELECT
    c.id AS chauffeur_id,
    c.matricule,
    c.nom,
    c.telephone,
    c.permis_categorie,
    c.statut,
    c.date_embauche,
    v.id AS vehicule_id,
    v.immatriculation,
    v.marque,
    v.modele,
    v.type AS type_vehicule,
    v.etat AS etat_vehicule
FROM chauffeurs c
LEFT JOIN vehicules v ON c.vehicule_id = v.id;

CREATE OR REPLACE VIEW v_trajets_details AS
SELECT
    t.id AS trajet_id,
    l.numero AS numero_ligne,
    l.nom AS nom_ligne,
    l.depart,
    l.arrivee,
    l.distance_km,
    c.matricule AS chauffeur_matricule,
    c.nom AS chauffeur_nom,
    v.immatriculation,
    v.marque,
    v.modele,
    v.type AS type_vehicule,
    t.date_depart,
    t.date_arrivee,
    t.statut,
    t.nb_passagers,
    t.recette,
    TIMESTAMPDIFF(MINUTE, t.date_depart, t.date_arrivee) AS duree_reelle_minutes
FROM trajets t
JOIN lignes l ON t.ligne_id = l.id
JOIN chauffeurs c ON t.chauffeur_id = c.id
JOIN vehicules v ON t.vehicule_id = v.id;

-- Vue 3 : Incidents détaillés
CREATE OR REPLACE VIEW v_incidents_details AS
SELECT
    i.id AS incident_id,
    i.type AS type_incident,
    i.description,
    i.gravite,
    i.date_incident,
    i.resolu,
    i.date_resolution,
    t.id AS trajet_id,
    l.numero AS numero_ligne,
    l.nom AS nom_ligne,
    l.depart,
    l.arrivee,
    c.matricule AS chauffeur_matricule,
    c.nom AS chauffeur_nom,
    v.immatriculation,
    v.marque,
    v.modele
FROM incidents i
JOIN trajets t ON i.trajet_id = t.id
JOIN lignes l ON t.ligne_id = l.id
JOIN chauffeurs c ON i.chauffeur_id = c.id
JOIN vehicules v ON i.vehicule_id = v.id;

CREATE OR REPLACE VIEW v_tarifs_lignes AS
SELECT
    ta.id AS tarif_id,
    l.numero AS numero_ligne,
    l.nom AS nom_ligne,
    l.depart,
    l.arrivee,
    l.distance_km,
    ta.categorie,
    ta.prix,
    ta.date_effet
FROM tarifs ta
JOIN lignes l ON ta.ligne_id = l.id;

CREATE OR REPLACE VIEW v_dashboard AS
SELECT
    (SELECT COUNT(*) FROM vehicules) AS total_vehicules,
    (SELECT COUNT(*) FROM vehicules WHERE etat = 'actif') AS vehicules_actifs,
    (SELECT COUNT(*) FROM vehicules WHERE etat = 'maintenance') AS vehicules_maintenance,
    (SELECT COUNT(*) FROM vehicules WHERE etat = 'retire') AS vehicules_retires,
    (SELECT COUNT(*) FROM chauffeurs) AS total_chauffeurs,
    (SELECT COUNT(*) FROM chauffeurs WHERE statut = 'disponible') AS chauffeurs_disponibles,
    (SELECT COUNT(*) FROM chauffeurs WHERE statut = 'en_service') AS chauffeurs_en_service,
    (SELECT COUNT(*) FROM trajets WHERE statut = 'termine') AS trajets_termines,
    (SELECT COUNT(*) FROM trajets WHERE statut = 'en_cours') AS trajets_en_cours,
    (SELECT COUNT(*) FROM trajets WHERE statut = 'planifie') AS trajets_planifies,
    (SELECT COALESCE(SUM(recette), 0) FROM trajets WHERE statut = 'termine') AS recette_totale,
    (SELECT COUNT(*) FROM incidents WHERE resolu = FALSE) AS incidents_non_resolus,
    (SELECT COUNT(*) FROM incidents) AS total_incidents;

CREATE OR REPLACE VIEW v_resume_lignes AS
SELECT
    l.numero AS numero_ligne,
    l.nom AS nom_ligne,
    l.depart,
    l.arrivee,
    l.distance_km,
    l.duree_moyenne_min,
    l.active,
    COUNT(t.id) AS nombre_trajets,
    COALESCE(SUM(t.nb_passagers), 0) AS total_passagers,
    COALESCE(SUM(t.recette), 0) AS recette_totale,
    COALESCE(AVG(t.nb_passagers), 0) AS moyenne_passagers_par_trajet,
    COALESCE(AVG(t.recette), 0) AS recette_moyenne_par_trajet
FROM lignes l
LEFT JOIN trajets t ON l.id = t.ligne_id AND t.statut = 'termine'
GROUP BY l.id, l.numero, l.nom, l.depart, l.arrivee, l.distance_km, l.duree_moyenne_min, l.active;
