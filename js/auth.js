// auth.js - Authentication handling for HospoHub

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authForm = document.getElementById('auth-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const authType = document.getElementById('auth-type');
    const toggleAuth = document.getElementById('toggle-auth');
    const toggleText = document.getElementById('toggle-text');
    const submitButton = document.getElementById('submit-button');
    const registrationFields = document.getElementById('registration-fields');
    const forgotPassword = document.getElementById('forgot-password');
    
    // Check if the URL has a register parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('register') === 'true') {
        showRegistrationForm();
    }
    
    // Toggle between login and registration
    toggleAuth.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (authType.value === 'login') {
            showRegistrationForm();
        } else {
            showLoginForm();
        }
    });
    
    // Handle form submission
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(authForm);
        const email = formData.get('email');
        const password = formData.get('password');
        
        if (authType.value === 'login') {
            loginUser(email, password);
        } else {
            const confirmPassword = formData.get('confirm-password');
            const organization = formData.get('organization');
            const role = formData.get('role');
            
            // Password validation
            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }
            
            registerUser(email, password, organization, role);
        }
    });
    
    // Forgot password handler
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            // Show a simple password reset form or modal
            alert('Password reset functionality will be implemented here');
            // In a real application, you would:
            // 1. Show a form to enter email
            // 2. Send a reset email
            // 3. Provide a page to create a new password
        });
    }
    
    // Function to show the registration form
    function showRegistrationForm() {
        authType.value = 'register';
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Sign up for a new account';
        toggleText.textContent = 'Already have an account?';
        toggleAuth.textContent = 'Sign in';
        submitButton.textContent = 'Create Account';
        registrationFields.classList.remove('hidden');
        
        if (forgotPassword) {
            forgotPassword.parentElement.classList.add('hidden');
        }
    }
    
    // Function to show the login form
    function showLoginForm() {
        authType.value = 'login';
        authTitle.textContent = 'Welcome Back';
        authSubtitle.textContent = 'Sign in to your account';
        toggleText.textContent = 'Don\'t have an account?';
        toggleAuth.textContent = 'Sign up now';
        submitButton.textContent = 'Sign in';
        registrationFields.classList.add('hidden');
        
        if (forgotPassword) {
            forgotPassword.parentElement.classList.remove('hidden');
        }
    }
    
    // Function to handle user login
    // For now, we'll just simulate a login for demonstration
    function loginUser(email, password) {
        console.log('Logging in user:', email);
        
        // For demonstration purposes only - in a real app, you would:
        // 1. Send the credentials to your backend API
        // 2. Validate the credentials
        // 3. Return a token or session information
        
        // Simulate a successful login
        setTimeout(() => {
            // Store authentication status in localStorage (for demo only)
            localStorage.setItem('hospoHubUser', JSON.stringify({
                email: email,
                isAuthenticated: true,
                role: 'teacher' // Default role for demo
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // Function to handle user registration
    // For now, we'll just simulate registration for demonstration
    function registerUser(email, password, organization, role) {
        console.log('Registering user:', email, 'Organization:', organization, 'Role:', role);
        
        // For demonstration purposes only - in a real app, you would:
        // 1. Send the registration data to your backend API
        // 2. Create the user account
        // 3. Return a success message or error
        
        // Simulate a successful registration
        setTimeout(() => {
            // Store user information in localStorage (for demo only)
            localStorage.setItem('hospoHubUser', JSON.stringify({
                email: email,
                organization: organization,
                role: role,
                isAuthenticated: true
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // Show error message
    function showError(message) {
        alert(message); // Simple alert for now
        
        // In a production app, you'd use a nicer error display
        // Create and show error element
        // const errorDiv = document.createElement('div');
        // errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4';
        // errorDiv.innerHTML = message;
        // authForm.prepend(errorDiv);
        
        // setTimeout(() => {
        //     errorDiv.remove();
        // }, 5000);
    }
    
    // Check if user is already logged in
    function checkLoggedInStatus() {
        const user = JSON.parse(localStorage.getItem('hospoHubUser') || '{}');
        
        if (user.isAuthenticated) {
            // Redirect to dashboard if already logged in
            window.location.href = 'dashboard.html';
        }
    }
    
    // Check logged in status when page loads
    checkLoggedInStatus();
});

function loginUser(email, password) {
    console.log('Logging in user:', email);
    
    // Admin credentials check
    if (email === "admin@hospohub.com" && password === "admin123") {
        // Create admin user session
        localStorage.setItem('hospoHubUser', JSON.stringify({
            email: email,
            name: "Admin User",
            isAuthenticated: true,
            role: 'admin'
        }));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Rest of your existing login code...
}