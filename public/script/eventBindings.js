// Centralized Event Binding - Safe event handlers
document.addEventListener('DOMContentLoaded', function() {
    
    // Profile page events
    bindProfileEvents();
    
    // Navigation events  
    bindNavigationEvents();
    
    // Scroll events
    bindScrollEvents();
    
    // Note: Pagination events removed - pageNav.js handles navigation via dynamic href
});

// Profile page event bindings
function bindProfileEvents() {
    // Change name button
    const changeNameBtn = document.querySelector('.change-name-btn');
    if (changeNameBtn) {
        changeNameBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changeName();
        });
    }
    
    // Change password button
    const changePasswordBtn = document.querySelector('.change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            changePw();
        });
    }
    
    // Prevent form submissions (they use AJAX)
    const profileForms = document.querySelectorAll('.profile-form');
    profileForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            return false;
        });
    });
}

// Navigation event bindings
function bindNavigationEvents() {
    // Watchlist icon
    const watchlistIcon = document.querySelector('.watchlist-nav-icon');
    if (watchlistIcon) {
        watchlistIcon.addEventListener('click', function() {
            goWatchList();
        });
    }
    
    // Profile icon
    const profileIcon = document.querySelector('.profile-nav-icon');
    if (profileIcon) {
        profileIcon.addEventListener('click', function() {
            goProfile();
        });
    }
}

// Scroll event bindings
function bindScrollEvents() {
    // Scroll to top button
    const scrollTopBtn = document.getElementById('arrow-up');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            goTop();
        });
    }
}
