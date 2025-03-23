// dashboard.js - JavaScript functionality for the HospoHub Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    initDashboard();

    // Set up event listeners
    setupEventListeners();

    // Check authentication status
    checkAuthStatus();
});

/**
 * Initialize the dashboard with user data and statistics
 */
function initDashboard() {
    // Set up user information
    setUserInfo();
    
    // Add the stats-card class to stat cards for animation
    document.querySelectorAll('.bg-white.overflow-hidden.shadow.rounded-lg').forEach((card, index) => {
        if (index < 4) { // Only the top stats cards
            card.classList.add('stats-card');
        }
    });

    // Add classes for animation to other sections
    const upcomingClassesSection = document.querySelector('.mt-8.grid.grid-cols-1.gap-6.lg\\:grid-cols-2');
    if (upcomingClassesSection) {
        upcomingClassesSection.classList.add('activity-section');
    }
    
    const quickActionsSection = document.querySelector('.mt-8 > .bg-white.shadow');
    if (quickActionsSection) {
        quickActionsSection.classList.add('actions-section');
    }
}

/**
 * Set up all event listeners for the dashboard
 */
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // User menu toggle
    const userMenuButton = document.querySelector('.user-menu-button');
    if (userMenuButton) {
        userMenuButton.addEventListener('click', toggleUserMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const userMenu = document.querySelector('.user-menu');
            if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target) && !userMenu.classList.contains('hidden')) {
                userMenu.classList.add('hidden');
            }
        });
    }

    // Sign out functionality
    const signOutButton = document.getElementById('sign-out');
    if (signOutButton) {
        signOutButton.addEventListener('click', handleSignOut);
    }

    const mobileSignOutButton = document.getElementById('mobile-sign-out');
    if (mobileSignOutButton) {
        mobileSignOutButton.addEventListener('click', handleSignOut);
    }

    // Quick action buttons
    document.querySelectorAll('[class*="group relative bg-gray-50"]').forEach(button => {
        button.classList.add('action-card');
    });
}

/**
 * Toggle the mobile menu
 */
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

/**
 * Toggle the user dropdown menu
 */
function toggleUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    userMenu.classList.toggle('hidden');
}

/**
 * Handle the sign out process
 * @param {Event} e - The click event
 */
function handleSignOut(e) {
    e.preventDefault();
    
    // Show loading state
    this.classList.add('is-loading');
    
    // Simulate a logout request to the server
    setTimeout(() => {
        // Clear user data from localStorage
        localStorage.removeItem('hospoHubUser');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }, 800);
}

/**
 * Set user information in the UI based on localStorage data
 */
function setUserInfo() {
    const user = JSON.parse(localStorage.getItem('hospoHubUser') || '{}');
    
    if (user.email) {
        // Set email in mobile menu
        const mobileUserEmail = document.getElementById('mobile-user-email');
        if (mobileUserEmail) {
            mobileUserEmail.textContent = user.email;
        }
        
        // Set user name if available, otherwise use email
        const displayName = user.name || user.organization || user.email.split('@')[0];
        
        // Format the display name to be more readable (capitalize first letter of each word)
        const formattedName = displayName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
        const userNameElements = [
            document.getElementById('user-name'),
            document.getElementById('mobile-user-name')
        ];
        
        userNameElements.forEach(el => {
            if (el) el.textContent = formattedName;
        });
        
        // Set user initials for avatar
        const initials = formattedName
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
            
        document.querySelectorAll('.user-initials').forEach(el => {
            if (el) el.textContent = initials;
        });
        
        // Display role if available
        const roleBadges = document.querySelectorAll('.role-badge');
        if (user.role && roleBadges.length) {
            roleBadges.forEach(badge => {
                badge.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
                
                // Set appropriate colors based on role
                if (user.role === 'admin') {
                    badge.classList.add('bg-purple-100', 'text-purple-800');
                } else if (user.role === 'teacher') {
                    badge.classList.add('bg-blue-100', 'text-blue-800');
                } else {
                    badge.classList.add('bg-gray-100', 'text-gray-800');
                }
            });
        }
    } else {
        // Redirect to login if no user info found
        window.location.href = 'login.html';
    }
}

/**
 * Check if the user is authenticated
 */
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('hospoHubUser') || '{}');
    
    if (!user.isAuthenticated) {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
    }
}

/**
 * Format a date for display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Get relative time (e.g., "2 hours ago") from a date
 * @param {string|Date} dateString - The date to format
 * @returns {string} Relative time string
 */
function getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    
    if (diffSecs < 60) {
        return `${diffSecs} seconds ago`;
    } if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
    
    return formatDate(date);
}

/**
 * Load dashboard data from API or localStorage
 * For demonstration purposes, we're using mock data
 */
function loadDashboardData() {
    // This would normally be an API call
    // For now, we'll just simulate it with a timeout
    
    setTimeout(() => {
        // Update stats with random numbers (for demo only)
        document.querySelectorAll('.text-lg.font-semibold.text-gray-900').forEach(stat => {
            const currentValue = parseInt(stat.textContent, 10);
            const newValue = currentValue + Math.floor(Math.random() * 5);
            stat.textContent = newValue;
        });
    }, 2000);
}