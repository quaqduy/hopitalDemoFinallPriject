// Example of login form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation (you can improve with backend validation)
    if (username === "" || password === "") {
        alert("Please enter both username and password.");
        return;
    }

    // Example of login process (here you would make an AJAX request to your server)
    alert(`Logging in as ${username}`);

    // After login logic, you can redirect or display an error
});
