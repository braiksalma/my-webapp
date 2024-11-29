import React, { useState } from "react";

const StudentForm = ({ onAddStudent }) => {
  const [student, setStudent] = useState({ name: "", age: "", course: "" });
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://localhost:30080/api/students/add-student`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });

    const newStudent = await response.json();
    onAddStudent(newStudent.student); // Appelle le parent pour mettre à jour la liste
    setStudent({ name: "", age: "", course: "" }); // Réinitialise le formulaire
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nom :</label>
      <input
        type="text"
        name="name"
        value={student.name}
        onChange={handleChange}
        required
      />
      <label>Âge :</label>
      <input
        type="number"
        name="age"
        value={student.age}
        onChange={handleChange}
        required
      />
      <label>Cursus :</label>
      <input
        type="text"
        name="course"
        value={student.course}
        onChange={handleChange}
        required
      />
      <button type="submit">Ajouter l'étudiant</button>
    </form>
  );
};

export default StudentForm;
