const express = require('express');
const { Pool } = require('pg');  // Importation de pg
const app = express();
const port = 3000;

// Middleware pour gérer JSON
app.use(express.json());

// Connexion à PostgreSQL
const pool = new Pool({
    user: 'postgres',  // ton utilisateur PostgreSQL
    host: 'localhost',  // l'adresse de ta base de données
    database: 'students_db',  // nom de la base de données
    password: 'your_password',  // ton mot de passe
    port: 5432,  // port par défaut de PostgreSQL
});

// Endpoint pour ajouter un étudiant
app.post('/add-student', async (req, res) => {
    const { name, age, email } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO students (name, age, email) VALUES ($1, $2, $3) RETURNING *',
            [name, age, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add student' });
    }
});

// Endpoint pour récupérer les étudiants
app.get('/students', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve students' });
    }
});

// Démarrer l'application
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
