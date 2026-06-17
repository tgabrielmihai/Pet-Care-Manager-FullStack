// server/index.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

//CONECTARE LA BAZA DE DATE 
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: '',      
    database: 'pet_care_db'
});

db.connect(err => {
    if (err) console.log('❌ Eroare la conectare DB:', err);
    else console.log('✅ CONECTAT LA MYSQL (pet_care_db)!');
});

// RUTE

// 1. ÎNREGISTRARE 
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    const sql = "CALL AddUser(?, ?, ?)";
    
    db.query(sql, [username, email, password], (err, result) => {
        if (err) return res.json({ message: "Eroare: Probabil email duplicat!" });
        return res.json({ message: "Succes" });
    });
});

// 2. LOGIN 
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, data) => {
        if (err) return res.json("Eroare Server");
        if (data.length > 0) return res.json(data[0]);
        return res.json({ message: "Email sau parolă greșită!" });
    });
});

// 3. ADĂUGARE ANIMAL 
app.post('/pets', (req, res) => {
    const { name, species, breed, birth_date, user_id } = req.body;
    const sql = "CALL AddPet(?, ?, ?, ?, ?)";
    
    db.query(sql, [name, species, breed, birth_date, user_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.json("Eroare");
        }
        return res.json("Succes");
    });
});

// 4. LISTARE ANIMALE 
app.get('/pets', (req, res) => {
    const userId = req.query.user_id;
    const sql = "SELECT * FROM pets WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

// 5. ȘTERGERE ANIMAL 
app.delete('/pets/:id', (req, res) => {
    const id = req.params.id;
    const sql = "CALL DeletePet(?)";
    
    db.query(sql, [id], (err, result) => {
        if (err) return res.json(err);
        return res.json("Sters");
    });
});

// 6. PROGRAMĂRI 
app.post('/appointments', (req, res) => {
    const { pet_id, service_name, date } = req.body;

    const sql = "CALL MakeAppointment(?, ?, ?)";
    
    db.query(sql, [pet_id, service_name, date], (err, result) => {
        if (err) {
            console.error(err);
            return res.json("Eroare");
        }
        return res.json("Succes");
    });
});

// 7. GET SERVICII 
app.get('/services', (req, res) => {
    db.query("SELECT * FROM services", (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// 8. GET ISTORIC PROGRAMĂRI
app.get('/appointments/:petId', (req, res) => {
    const petId = req.params.petId;

    const sql = `
        SELECT a.id, s.service_name, a.appointment_date, a.status, s.price
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.pet_id = ?
        ORDER BY a.appointment_date DESC
    `;
    db.query(sql, [petId], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

app.listen(3001, () => {
    console.log("🚀 Server pornit pe portul 3001");
});