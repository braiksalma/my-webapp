import React, { useState } from "react";

const StudentList = ({ students, onUpdateStudent, onDeleteStudent }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [updatedStudent, setUpdatedStudent] = useState({ name: "", age: "", course: "" });

  const API_URL = process.env.REACT_APP_API_URL;

  const handleEditClick = (student) => {
    setIsEditing(student.id);
    setUpdatedStudent({ name: student.name, age: student.age, course: student.course });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStudent({ ...updatedStudent, [name]: value });
  };

  const handleUpdateClick = async (id) => {
    const response = await fetch(`http://localhost:30080/api/students/update-student/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

    const updated = await response.json();
    onUpdateStudent(updated.student);
    setIsEditing(null);
  };

  return (
    <div id="students-list">
      {students.map((student) => (
        <div key={student.id}>
          {isEditing === student.id ? (
            <div>
              <input
                type="text"
                name="name"
                value={updatedStudent.name}
                onChange={handleEditChange}
              />
              <input
                type="number"
                name="age"
                value={updatedStudent.age}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="course"
                value={updatedStudent.course}
                onChange={handleEditChange}
              />
              <button onClick={() => handleUpdateClick(student.id)}>Sauvegarder</button>
            </div>
          ) : (
            <p>
              {student.name}, {student.age} ans, Cours : {student.course}
              <button onClick={() => handleEditClick(student)}>Modifier</button>
              <button onClick={() => onDeleteStudent(student.id)}>Supprimer</button>
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StudentList;
