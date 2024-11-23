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
  
    // Get Elements
    const txtEmail = document.getElementById("txtEmail");
    const txtPassword = document.getElementById("txtPassword");
    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
  
    // Login Event
    if (btnLogin) {
      btnLogin.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent form submission
        const email = txtEmail.value.trim();
        const password = txtPassword.value.trim();
  
        if (email && password) {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              alert("Login Successful!");
              // Redirect to dashboard or index page
              window.location.href = "index.html";
            })
            .catch((error) => {
              alert("Error: " + error.message);
            });
        } else {
          alert("Please fill in all fields.");
        }
      });
    }
  
    // Redirect to Registration Page
    if (btnSignup) {
      btnSignup.addEventListener("click", () => {
        window.location.href = "register.html";
      });
    }
  });
  