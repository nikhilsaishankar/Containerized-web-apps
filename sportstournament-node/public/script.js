// Form validation and interactive features for Sports Tournaments

document.addEventListener('DOMContentLoaded', function() {
    
    // Phone number validation (only numbers, max 10 digits)
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }

    // Team name validation (no special characters)
    const teamNameInput = document.getElementById('teamName');
    if (teamNameInput) {
        teamNameInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
        });
    }

    // Captain name validation (only letters and spaces)
    const captainNameInput = document.getElementById('captainName');
    if (captainNameInput) {
        captainNameInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }

    // Players count validation (cannot exceed team size)
    const playersInput = document.getElementById('players');
    if (playersInput) {
        const maxPlayers = parseInt(playersInput.getAttribute('max'));
        playersInput.addEventListener('change', function(e) {
            let value = parseInt(this.value);
            if (value > maxPlayers) {
                this.value = maxPlayers;
                showAlert(`Maximum ${maxPlayers} players allowed for this tournament!`, 'warning');
            }
            if (value < 1) {
                this.value = 1;
            }
        });
    }

    // Form submission with loading effect
    const registrationForm = document.querySelector('.registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.btn-submit');
            if (submitBtn) {
                // Disable button and show loading text
                submitBtn.disabled = true;
                submitBtn.textContent = 'Registering...';
                
                // Add loading spinner
                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                spinner.innerHTML = ' ⏳';
                submitBtn.appendChild(spinner);
            }
        });
    }

    // Add animation to tournament cards on hover
    const tournamentCards = document.querySelectorAll('.tournament-card');
    tournamentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Search functionality for tournaments (if needed)
    const searchInput = document.getElementById('searchTournaments');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            const searchTerm = this.value.toLowerCase();
            const tournamentCards = document.querySelectorAll('.tournament-card');
            
            tournamentCards.forEach(card => {
                const title = card.querySelector('h4').textContent.toLowerCase();
                const venue = card.querySelector('.venue').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || venue.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Filter tournaments by date
    const dateFilter = document.getElementById('filterByDate');
    if (dateFilter) {
        dateFilter.addEventListener('change', function(e) {
            const selectedDate = this.value;
            const tournamentCards = document.querySelectorAll('.tournament-card');
            
            tournamentCards.forEach(card => {
                const tournamentDate = card.querySelector('.date').textContent.replace('📅 ', '');
                
                if (!selectedDate || tournamentDate === selectedDate) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Auto-hide flash messages after 5 seconds
    const flashMessages = document.querySelectorAll('.alert');
    if (flashMessages.length > 0) {
        setTimeout(() => {
            flashMessages.forEach(message => {
                message.style.opacity = '0';
                message.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    message.remove();
                }, 500);
            });
        }, 5000);
    }

    // Add countdown timer for upcoming tournaments
    function addCountdownTimer() {
        const tournamentDates = document.querySelectorAll('.tournament-date');
        
        tournamentDates.forEach(dateElement => {
            const tournamentDate = new Date(dateElement.getAttribute('data-date'));
            const now = new Date();
            const diffTime = tournamentDate - now;
            
            if (diffTime > 0) {
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const countdownSpan = document.createElement('span');
                countdownSpan.className = 'countdown';
                countdownSpan.innerHTML = `⏰ ${diffDays} days remaining`;
                dateElement.appendChild(countdownSpan);
            } else if (diffTime < 0 && diffTime > -86400000) {
                // Tournament is today
                const todaySpan = document.createElement('span');
                todaySpan.className = 'today';
                todaySpan.innerHTML = ' 🔥 Today!';
                todaySpan.style.color = '#e74c3c';
                dateElement.appendChild(todaySpan);
            }
        });
    }

    // Call countdown timer if tournament dates exist
    if (document.querySelector('.tournament-date')) {
        addCountdownTimer();
    }

    // Form field validation on blur
    const formInputs = document.querySelectorAll('.form-group input');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });

    function validateField(field) {
        const value = field.value.trim();
        const errorSpan = field.parentElement.querySelector('.error-message');
        
        // Remove existing error message
        if (errorSpan) {
            errorSpan.remove();
        }
        
        // Validation rules
        if (field.id === 'email' && value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
            }
        }
        
        if (field.id === 'phone' && value) {
            if (value.length !== 10) {
                showFieldError(field, 'Phone number must be 10 digits');
            }
        }
        
        if (field.id === 'teamName' && value) {
            if (value.length < 3) {
                showFieldError(field, 'Team name must be at least 3 characters');
            }
        }
        
        if (field.id === 'captainName' && value) {
            if (value.length < 3) {
                showFieldError(field, 'Captain name must be at least 3 characters');
            }
        }
    }
    
    function showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#e74c3c';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        field.parentElement.appendChild(errorDiv);
        
        // Remove error on input
        field.addEventListener('input', function() {
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
        }, { once: true });
    }
    
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '1000';
        alertDiv.style.padding = '1rem';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.backgroundColor = type === 'warning' ? '#f39c12' : '#3498db';
        alertDiv.style.color = 'white';
        alertDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 500);
        }, 3000);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Press 'H' to go home
        if (e.key === 'h' || e.key === 'H') {
            window.location.href = '/';
        }
        
        // Press 'Esc' to clear form
        if (e.key === 'Escape' && registrationForm) {
            if (confirm('Clear all form fields?')) {
                registrationForm.reset();
            }
        }
    });

    // Add tooltips for tournament cards
    tournamentCards.forEach(card => {
        const registerBtn = card.querySelector('.btn-register');
        if (registerBtn) {
            card.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = 'Click to register your team!';
                tooltip.style.position = 'absolute';
                tooltip.style.backgroundColor = '#2c3e50';
                tooltip.style.color = 'white';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '5px';
                tooltip.style.fontSize = '0.8rem';
                tooltip.style.marginTop = '-30px';
                tooltip.style.marginLeft = '10px';
                
                registerBtn.style.position = 'relative';
                registerBtn.appendChild(tooltip);
                
                setTimeout(() => {
                    tooltip.remove();
                }, 2000);
            });
        }
    });
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease;
    }
    
    .error-message {
        animation: slideIn 0.3s ease;
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-10px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .btn-register:active {
        transform: scale(0.98);
    }
    
    .spinner {
        display: inline-block;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
