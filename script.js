let grades = [];
let currentEditIndex = null;

// Function to load grades from local storage
function loadGrades() {
    grades = JSON.parse(localStorage.getItem('grades')) || [];
}

// Function to save grades to local storage
function saveGrades() {
    localStorage.setItem('grades', JSON.stringify(grades));
}

// Function to add another session input
function addSession() {
    const sessionContainer = document.getElementById('sessionContainer');
    const newSessionDiv = document.createElement('div');
    newSessionDiv.classList.add('session-inputs');

    newSessionDiv.innerHTML = `
        <input type="number" class="sessionNumber" placeholder="Session Number" required>
        <input type="text" class="homeworkScore" placeholder="Homework Score (or Not Done)">
        <input type="text" class="totalHomeworkScore" placeholder="Total Homework Score (or Not Done)">
        <input type="text" class="classworkScore" placeholder="Classwork Score (or Not Done)">
        <input type="text" class="totalClassworkScore" placeholder="Total Classwork Score (or Not Done)">
        <input type="text" class="examScore" placeholder="Exam Score (or Not Done)">
        <input type="text" class="totalExamScore" placeholder="Total Exam Score (or Not Done)">
        <label>
            <input type="checkbox" class="absent"> Absent
        </label>
        <button onclick="removeSession(this)">Remove Session</button>
    `;

    sessionContainer.appendChild(newSessionDiv);
}

// Function to remove a session input
function removeSession(button) {
    button.parentElement.remove();
}

// Function to add grades to the table and save to local storage
function addGrade() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentCode = document.getElementById('studentCode').value.trim();
    const sessionInputs = document.querySelectorAll('.session-inputs');

    if (!studentName || !studentCode) {
        alert('Please fill in all required fields.');
        return;
    }

    sessionInputs.forEach(session => {
        const sessionNumber = session.querySelector('.sessionNumber').value;
        const homeworkScore = session.querySelector('.homeworkScore').value || "Not Done";
        const totalHomeworkScore = session.querySelector('.totalHomeworkScore').value || "Not Done";
        const classworkScore = session.querySelector('.classworkScore').value || "Not Done";
        const totalClassworkScore = session.querySelector('.totalClassworkScore').value || "Not Done";
        const examScore = session.querySelector('.examScore').value || "Not Done";
        const totalExamScore = session.querySelector('.totalExamScore').value || "Not Done";
        const absent = session.querySelector('.absent').checked;

        // Push to the grades array
        grades.push({
            name: studentName,
            code: studentCode,
            session: sessionNumber,
            homework: homeworkScore,
            totalHomework: totalHomeworkScore,
            classwork: classworkScore,
            totalClasswork: totalClassworkScore,
            exam: examScore,
            totalExam: totalExamScore,
            absent,
        });
    });

    saveGrades(); // Save updated grades to local storage
    displayGrades();
    clearInputs();
}

// Function to display grades in the table
function displayGrades() {
    const gradesTableBody = document.getElementById('gradesTable').querySelector('tbody');
    gradesTableBody.innerHTML = ''; // Clear existing table rows

    // Sort grades based on student code, then session
    grades.sort((a, b) => {
        if (a.code !== b.code) {
            return a.code - b.code; // Ascending order by code
        }
        return a.session - b.session; // Ascending order by session
    });

    grades.forEach((grade, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${grade.name}</td>
            <td>${grade.code}</td>
            <td>${grade.session}</td>
            <td>${formatScore(grade.homework)}</td>
            <td>${formatScore(grade.totalHomework)}</td>
            <td>${formatScore(grade.classwork)}</td>
            <td>${formatScore(grade.totalClasswork)}</td>
            <td>${formatScore(grade.exam)}</td>
            <td>${formatScore(grade.totalExam)}</td>
            <td>${grade.absent ? 'Yes' : 'No'}</td>
            <td>
                <button onclick="editGrade(${index})">Edit</button>
                <button onclick="deleteGrade(${index})">Delete</button>
            </td>
        `;
        gradesTableBody.appendChild(row);
    });
}

// Function to clear inputs after adding grades
function clearInputs() {
    document.getElementById('studentName').value = '';
    document.getElementById('studentCode').value = '';
    const sessionInputs = document.querySelectorAll('.session-inputs');
    sessionInputs.forEach(session => {
        session.querySelector('.sessionNumber').value = '';
        session.querySelector('.homeworkScore').value = '';
        session.querySelector('.totalHomeworkScore').value = '';
        session.querySelector('.classworkScore').value = '';
        session.querySelector('.totalClassworkScore').value = '';
        session.querySelector('.examScore').value = '';
        session.querySelector('.totalExamScore').value = '';
        session.querySelector('.absent').checked = false;
    });
}

// Function to edit a grade entry
function editGrade(index) {
    const grade = grades[index];
    document.getElementById('studentName').value = grade.name;
    document.getElementById('studentCode').value = grade.code;

    // Clear existing session inputs
    const sessionContainer = document.getElementById('sessionContainer');
    sessionContainer.innerHTML = '';

    // Add the session for editing
    const sessionDiv = document.createElement('div');
    sessionDiv.classList.add('session-inputs');
    sessionDiv.innerHTML = `
        <input type="number" class="sessionNumber" placeholder="Session Number" value="${grade.session}" required>
        <input type="text" class="homeworkScore" placeholder="Homework Score (or Not Done)" value="${grade.homework}">
        <input type="text" class="totalHomeworkScore" placeholder="Total Homework Score (or Not Done)" value="${grade.totalHomework}">
        <input type="text" class="classworkScore" placeholder="Classwork Score (or Not Done)" value="${grade.classwork}">
        <input type="text" class="totalClassworkScore" placeholder="Total Classwork Score (or Not Done)" value="${grade.totalClasswork}">
        <input type="text" class="examScore" placeholder="Exam Score (or Not Done)" value="${grade.exam}">
        <input type="text" class="totalExamScore" placeholder="Total Exam Score (or Not Done)" value="${grade.totalExam}">
        <label>
            <input type="checkbox" class="absent" ${grade.absent ? 'checked' : ''}> Absent
        </label>
    `;
    sessionContainer.appendChild(sessionDiv);

    // Update the current edit index
    currentEditIndex = index;

    // Change button functionality
    document.getElementById('addButton').style.display = 'none';
    document.getElementById('editButton').style.display = 'inline';
}

// Function to save edited grades
function updateGrade() {
    const studentName = document.getElementById('studentName').value.trim();
    const studentCode = document.getElementById('studentCode').value.trim();
    const sessionInputs = document.querySelectorAll('.session-inputs');

    // Clear previous grades for the student being edited
    grades.splice(currentEditIndex, 1);

    sessionInputs.forEach(session => {
        const sessionNumber = session.querySelector('.sessionNumber').value;
        const homeworkScore = session.querySelector('.homeworkScore').value || "Not Done";
        const totalHomeworkScore = session.querySelector('.totalHomeworkScore').value || "Not Done";
        const classworkScore = session.querySelector('.classworkScore').value || "Not Done";
        const totalClassworkScore = session.querySelector('.totalClassworkScore').value || "Not Done";
        const examScore = session.querySelector('.examScore').value || "Not Done";
        const totalExamScore = session.querySelector('.totalExamScore').value || "Not Done";
        const absent = session.querySelector('.absent').checked;

        // Push updated entry to the grades array
        grades.push({
            name: studentName,
            code: studentCode,
            session: sessionNumber,
            homework: homeworkScore,
            totalHomework: totalHomeworkScore,
            classwork: classworkScore,
            totalClasswork: totalClassworkScore,
            exam: examScore,
            totalExam: totalExamScore,
            absent,
        });
    });

    saveGrades(); // Save updated grades to local storage
    displayGrades();
    clearInputs();

    // Reset edit mode
    currentEditIndex = null;
    document.getElementById('addButton').style.display = 'inline';
    document.getElementById('editButton').style.display = 'none';
}

// Function to delete a grade from the table
function deleteGrade(index) {
    grades.splice(index, 1); // Remove grade from array
    saveGrades(); // Update local storage
    displayGrades(); // Refresh display
}

// Function to format the score as "score/total" or "Not Done"
function formatScore(score) {
    return score === "Not Done" ? "Not Done" : score;
}

// Initial load to retrieve grades from local storage
window.onload = function() {
    loadGrades();
    displayGrades();
};
