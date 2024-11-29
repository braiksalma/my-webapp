const db = require('../models/db');

// Récupérer tous les étudiants
exports.getStudents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM students');
    res.json({ students: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des étudiants' });
  }
};

// Ajouter un étudiant
exports.addStudent = async (req, res) => {
  const { name, age, course } = req.body;

  // Vérifier si les données sont présentes
  if (!name || !age || !course) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
      const result = await db.query(
          'INSERT INTO students (name, age, course) VALUES ($1, $2, $3) RETURNING *',
          [name, age, course]
      );
      res.status(201).json({ student: result.rows[0] });  // Retourner l'étudiant ajouté
  } catch (err) {
      console.error('Erreur d\'ajout d\'étudiant :', err);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'étudiant' });
  }
};

// Mettre à jour un étudiant
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, age, course } = req.body;

  try {
    const result = await db.query(
      'UPDATE students SET name = $1, age = $2, course = $3 WHERE id = $4 RETURNING *',
      [name, age, course, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    res.json({ student: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'étudiant' });
  }
};

// Supprimer un étudiant
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    res.json({ message: 'Étudiant supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'étudiant' });
  }
};
