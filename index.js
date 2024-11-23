// Show loading spinner
function showLoading() {
  document.getElementById("loadingSpinner").style.display = "block";
}

// Hide loading spinner
function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none";
}

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBN3ttsB-OKYyd3pldXuyDHeoeqv8ns-Sc",
  authDomain: "to-do-d6893.firebaseapp.com",
  projectId: "to-do-d6893",
  storageBucket: "to-do-d6893.appspot.com",
  messagingSenderId: "730904721338",
  appId: "1:730904721338:web:6d807ecd08c1b4c29fcf83",
  measurementId: "G-TVDR1EM178",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM Elements
const usernameSpan = document.getElementById("username");
const btnLogout = document.getElementById("btnLogout");
const form = document.getElementById("dataForm");
const inputName = document.getElementById("inputName");
const inputAge = document.getElementById("inputAge");
const inputNumber = document.getElementById("inputNumber");
const dataTableBody = document.querySelector("#dataTable tbody");

// Load data from Firestore and display in the table
function loadData() {
  showLoading(); // Show loading spinner before fetching data

  db.collection("userData")
    .orderBy("timestamp", "desc")
    .get()
    .then((querySnapshot) => {
      dataTableBody.innerHTML = ""; // Clear table
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `<tr data-id="${doc.id}">
          <td>${data.name}</td>
          <td>${data.age}</td>
          <td>${data.number}</td>
          <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        </tr>`;
        dataTableBody.insertAdjacentHTML("beforeend", row);
      });
      attachEventListeners();
      hideLoading(); // Hide loading spinner after data is loaded
    })
    .catch((error) => {
      hideLoading();
      console.error("Error loading data: ", error);
    });
}

// Submit form data to Firestore
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = inputName.value.trim();
  const age = inputAge.value.trim();
  const number = inputNumber.value.trim();

  if (name && age && number) {
    showLoading(); // Show loading spinner before submitting data

    db.collection("userData")
      .add({
        name,
        age,
        number,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        alert("Data submitted successfully!");
        form.reset();
        loadData(); // Reload data after submission
      })
      .catch((error) => {
        console.error("Error adding data: ", error);
        hideLoading(); // Hide loading spinner in case of error
      });
  } else {
    alert("Please fill in all fields.");
  }
});

// Attach event listeners for edit and delete buttons
function attachEventListeners() {
  const editButtons = document.querySelectorAll(".edit-btn");
  const deleteButtons = document.querySelectorAll(".delete-btn");

  editButtons.forEach((button) => button.addEventListener("click", handleEdit));
  deleteButtons.forEach((button) => button.addEventListener("click", handleDelete));
}

// Handle editing a row
function handleEdit(event) {
  const row = event.target.closest("tr");
  const docId = row.getAttribute("data-id");
  const name = row.children[0].textContent;
  const age = row.children[1].textContent;
  const number = row.children[2].textContent;

  inputName.value = name;
  inputAge.value = age;
  inputNumber.value = number;

  form.addEventListener("submit", function updateData(e) {
    e.preventDefault();
    showLoading(); // Show loading spinner before updating data

    db.collection("userData")
      .doc(docId)
      .update({
        name: inputName.value.trim(),
        age: inputAge.value.trim(),
        number: inputNumber.value.trim(),
      })
      .then(() => {
        alert("Data updated successfully!");
        form.reset();
        loadData();
      })
      .catch((error) => {
        console.error("Error updating data: ", error);
        hideLoading(); // Hide loading spinner in case of error
      });
    form.removeEventListener("submit", updateData); // Remove event listener after update
  });
}

// Handle deleting a row
function handleDelete(event) {
  const row = event.target.closest("tr");
  const docId = row.getAttribute("data-id");

  if (confirm("Are you sure you want to delete this entry?")) {
    showLoading(); // Show loading spinner before deleting data

    db.collection("userData")
      .doc(docId)
      .delete()
      .then(() => {
        alert("Data deleted successfully!");
        loadData();
      })
      .catch((error) => {
        console.error("Error deleting data: ", error);
        hideLoading(); // Hide loading spinner in case of error
      });
  }
}

// Display logged-in user's name
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          usernameSpan.textContent = doc.data().username || "User";
        } else {
          console.error("User document not found.");
          usernameSpan.textContent = "User";
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        usernameSpan.textContent = "User";
      });

    loadData(); // Load data after authentication
  } else {
    alert("You are not logged in!");
    window.location.href = "login.html";
  }
});

// Logout functionality
btnLogout.addEventListener("click", () => {
  firebase.auth().signOut().then(() => {
    alert("Logged out successfully!");
    window.location.href = "login.html";
  }).catch((error) => console.error("Error logging out:", error));
});
