document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;

    const studentData = { firstName, lastName, age, email };

    fetch('/add-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchStudents();
    });
});

function fetchStudents() {
    fetch('/students')
        .then(response => response.json())
        .then(students => {
            const studentList = document.getElementById('studentList');
            studentList.innerHTML = '';

            students.forEach(student => {
                const listItem = document.createElement('li');
                listItem.textContent = `${student.firstName} ${student.lastName} - ${student.age} ans - ${student.email}`;
                studentList.appendChild(listItem);
            });
        });
}

// Charger les étudiants au chargement de la page
fetchStudents();
