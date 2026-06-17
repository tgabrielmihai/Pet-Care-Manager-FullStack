# Pet Care Manager

## Description

Pet Care Manager is a full-stack web application developed to help pet owners manage their animals, veterinary appointments and medical history in a centralized digital platform.

The application replaces traditional paper-based records with a modern client-server solution that allows users to register and manage pet profiles, schedule veterinary services, track appointment history and monitor pet-related information through an intuitive web interface.

The system follows a modern architecture based on React.js for the frontend, Node.js and Express for the backend, and MySQL for data persistence. Business logic is partially implemented directly within the database through stored procedures, user-defined functions and database reports.

The project was developed as part of the Advanced Database Systems course and demonstrates the integration of database technologies, REST APIs and modern web development practices.

---

## Features

- User authentication and registration
- Pet profile management (Create, Read, Update, Delete)
- Veterinary appointment scheduling
- Medical history tracking
- Service catalog management
- Pet statistics dashboard
- Future and past appointment separation
- MySQL stored procedures integration
- User-defined database functions
- Advanced database reporting

---

## Technologies Used

### Frontend
- React.js
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Database
- MySQL
- Stored Procedures
- User Defined Functions
- SQL Cursors
- Relational Database Design

---

## Database Structure

The application is based on a relational MySQL database consisting of:

- Users
- Pets
- Services
- Appointments
- Health Records

The database implements one-to-many relationships between users, pets, services and appointments while maintaining data integrity through primary and foreign keys.

---

## Advanced Database Features

- Stored Procedures for business logic execution
- User Defined Functions for calculations and statistics
- SQL Cursors for reporting operations
- Cascade deletion through foreign key constraints
- Data validation at database level

---

## System Architecture

The application follows a Client-Server architecture:

- React frontend for user interaction
- Express REST API for business logic
- MySQL database for persistent storage

Communication between frontend and backend is performed using REST API requests through Axios.

---

## Main Functionalities

1. User Registration and Login
2. Pet Management
3. Veterinary Service Scheduling
4. Medical History Tracking
5. Statistics Dashboard
6. Appointment Management
7. Service Management

---

## Academic Context

This project was developed for the Advanced Database Systems course and focuses on combining modern web technologies with advanced database programming concepts.

---
# Pet Care Manager

## Descriere

Pet Care Manager este o aplicație web full-stack dezvoltată pentru a ajuta proprietarii de animale de companie să gestioneze într-o platformă centralizată profilurile animalelor, programările veterinare și istoricul medical.

Aplicația înlocuiește evidențele clasice pe hârtie cu o soluție digitală modernă care permite administrarea rapidă a informațiilor despre animale, programarea serviciilor veterinare și vizualizarea istoricului medical prin intermediul unei interfețe intuitive.

Sistemul utilizează o arhitectură modernă bazată pe React.js pentru frontend, Node.js și Express pentru backend și MySQL pentru stocarea datelor. O parte importantă din logica aplicației este implementată direct la nivelul bazei de date prin proceduri stocate, funcții definite de utilizator și rapoarte SQL.

Proiectul a fost realizat în cadrul disciplinei Sisteme Avansate de Baze de Date și demonstrează integrarea tehnologiilor moderne de dezvoltare web cu programarea avansată a bazelor de date.

---

## Funcționalități

- Autentificare și înregistrare utilizatori
- Gestionarea profilurilor animalelor (CRUD)
- Programarea serviciilor veterinare
- Gestionarea istoricului medical
- Catalog de servicii veterinare
- Panou de statistici pentru animale
- Separarea programărilor viitoare de istoricul vizitelor
- Integrarea procedurilor stocate MySQL
- Funcții definite de utilizator
- Rapoarte și statistici avansate

---

## Tehnologii Utilizate

### Frontend
- React.js
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express.js

### Bază de Date
- MySQL
- Proceduri Stocate
- Funcții Definite de Utilizator
- Cursoare SQL
- Proiectare Relațională

---

## Structura Bazei de Date

Aplicația utilizează o bază de date relațională MySQL formată din:

- Users
- Pets
- Services
- Appointments
- Health Records

Baza de date implementează relații de tip one-to-many între utilizatori, animale, servicii și programări, asigurând integritatea datelor prin chei primare și chei străine.

---

## Funcționalități Avansate ale Bazei de Date

- Proceduri stocate pentru logica de business
- Funcții SQL pentru calcule și statistici
- Cursoare pentru generarea rapoartelor
- Ștergere în cascadă prin chei străine
- Validarea datelor la nivel de bază de date

---

## Arhitectura Sistemului

Aplicația urmează o arhitectură de tip Client-Server:

- Frontend React pentru interacțiunea cu utilizatorul
- API REST Express pentru logica aplicației
- Bază de date MySQL pentru stocarea persistentă

Comunicarea dintre frontend și backend este realizată prin request-uri REST folosind Axios.

---

## Funcționalități Principale

1. Înregistrare și autentificare utilizatori
2. Gestionarea animalelor
3. Programarea serviciilor veterinare
4. Gestionarea istoricului medical
5. Panou de statistici
6. Administrarea programărilor
7. Gestionarea serviciilor

---

## Context Academic

Acest proiect a fost realizat în cadrul disciplinei Sisteme Avansate de Baze de Date și pune accent pe integrarea dezvoltării web moderne cu concepte avansate de programare a bazelor de date.
