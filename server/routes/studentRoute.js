const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Récupérer la liste des étudiants
router.get('/get-students', studentController.getStudents);

// Ajouter un étudiant
router.post('/add-student', studentController.addStudent);

// Mettre à jour un étudiant
router.put('/update-student/:id', studentController.updateStudent);

// Supprimer un étudiant
router.delete('/delete-student/:id', studentController.deleteStudent);

module.exports = router;
