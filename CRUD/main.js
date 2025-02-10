import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAysGcJqBA_wFh-WwNIW3v7hCof2-KUbUc",
    authDomain: "admin-side-d264e.firebaseapp.com",
    projectId: "admin-side-d264e",
    storageBucket: "admin-side-d264e.firebasestorage.app",
    messagingSenderId: "248331989049",
    appId: "1:248331989049:web:2cd595d795fe47abcf5de8",
    measurementId: "G-YNL4EWP9F0"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let updateStudentId = null;
let allStudents = [];

// Fetch and display student data
async function fetchStudents() {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';
    
    try {
        const querySnapshot = await getDocs(collection(db, "Info"));
        allStudents = [];
        querySnapshot.forEach((doc) => {
            const student = doc.data();
            student.id = doc.id;
            allStudents.push(student);
        });
        displayStudents(allStudents);
    } catch (error) {
        console.error("Error fetching student data:", error);
    }
}

// Function to display students
function displayStudents(students) {
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';

    students.forEach((student) => {
        const li = document.createElement('li');
        li.textContent = `${student.name} - ${student.email}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => populateStudentForm(student.id, student);

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteStudent(student.id);

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(buttonContainer);
        studentList.appendChild(li);
    });
}

// Form submission handler
document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const studentName = document.getElementById('name').value;
    const studentEmail = document.getElementById('email').value;

    try {
        if (updateStudentId) {
            await updateStudent(updateStudentId, { name: studentName, email: studentEmail });
            updateStudentId = null;
        } else {
            await addStudent({ name: studentName, email: studentEmail });
        }
        
        document.getElementById('student-form').reset();
        fetchStudents();
    } catch (error) {
        console.error("Error adding/updating student: ", error);
        alert("Error adding/updating student: " + error.message);
    }
});

// Function to add a student
async function addStudent(student) {
    try {
        await addDoc(collection(db, "Info"), student);
        alert("Student added successfully!");
    } catch (error) {
        console.error("Error adding student:", error);
        alert("Error adding student: " + error.message);
    }
}

// Function to update an existing student
async function updateStudent(id, student) {
    try {
        const studentDoc = doc(db, "Info", id);
        await updateDoc(studentDoc, student);
        alert("Student updated successfully!");
    } catch (error) {
        console.error("Error updating student:", error);
        alert("Error updating student: " + error.message);
    }
}

// Function to delete a student
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            await deleteDoc(doc(db, "Info", id));
            alert("Student deleted successfully!");
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Error deleting student: " + error.message);
        }
    }
}

// Function to populate the form for editing
function populateStudentForm(id, student) {
    document.getElementById('name').value = student.name;
    document.getElementById('email').value = student.email;
    updateStudentId = id;
}

// Search bar functionality
document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const filteredStudents = allStudents.filter(student => 
        student.name.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query)
    );
    displayStudents(filteredStudents);
});

// Initial fetch of student data
fetchStudents();
