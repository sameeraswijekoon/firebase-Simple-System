document.addEventListener("DOMContentLoaded", function () {
  // Firebase Configuration
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

  // Get Elements from Register Page
  const txtUsername = document.getElementById("txtUsername");
  const txtEmail = document.getElementById("txtEmail");
  const txtPassword = document.getElementById("txtPassword");
  const btnRegister = document.getElementById("btnRegister");

  // Register Event
  if (btnRegister) {
    btnRegister.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form submission

      const username = txtUsername.value.trim();
      const email = txtEmail.value.trim();
      const password = txtPassword.value.trim();

      if (username && email && password) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;

            // Save the username to Firestore (Optional)
            firebase
              .firestore()
              .collection("users")
              .doc(user.uid)
              .set({
                username: username,
                email: email,
              })
              .then(() => {
                alert("Registration Successful!");
                window.location.href = "login.html";
              })
              .catch((err) => {
                console.error("Error saving user data:", err.message);
              });
          })
          .catch((err) => {
            alert("Error: " + err.message);
          });
      } else {
        alert("Please fill in all fields.");
      }
    });
  }
});
