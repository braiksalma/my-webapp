import React, { useState, useEffect } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

const App = () => {
  const [students, setStudents] = useState([]);


  // Récupérer les étudiants au chargement
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL;
    
    const fetchStudents = async () => {
      const response = await fetch(`http://localhost:30080/api/students/get-students`);
      const data = await response.json();
      setStudents(data.students);
    };

    fetchStudents();
  }, []);

  // Ajouter un étudiant dans la liste
  const addStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  // Mettre à jour un étudiant
  const updateStudent = (updatedStudent) => {
    setStudents(students.map((student) =>
      student.id === updatedStudent.id ? updatedStudent : student
    ));
  };

  // Supprimer un étudiant
  const deleteStudent = async (id) => {
    const response = await fetch(`http://localhost:30080/api/students/delete-student/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.message === "Étudiant supprimé avec succès") {
      setStudents(students.filter((student) => student.id !== id));
    }
  };

  return (
    <div className="container">
      <h1>Gestion des étudiants</h1>
      <StudentForm onAddStudent={addStudent} />
      <h3>Liste des étudiants</h3>
      <StudentList
        students={students}
        onUpdateStudent={updateStudent}
        onDeleteStudent={deleteStudent}
      />
    </div>
  );
};

export default App;
