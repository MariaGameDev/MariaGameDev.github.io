// Professional Portfolio Website JavaScript
// Smooth scrolling, navigation, form validation, animations, and Formspree integration

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSmoothScrolling();
    initFormValidation();
    initScrollAnimations();
    initMobileMenu();
});

// ----------------------
// Navigation functionality
// ----------------------
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ----------------------
// Smooth scrolling
// ----------------------
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ----------------------
// Mobile menu
// ----------------------
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');

            icon.classList.toggle('fa-bars', !navMenu.classList.contains('active'));
            icon.classList.toggle('fa-times', navMenu.classList.contains('active'));
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }
}

// ----------------------
// Form validation + Formspree submission
// ----------------------
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });

    // Formspree submit handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        clearErrors();
        const isValid = validateForm();

        if (!isValid) return;

        const formData = new FormData(form);

        const response = await fetch(form.action, {
            method: form.method,
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            showSuccessMessage();
            form.reset();
        } else {
            alert("Error sending message. Please try again.");
        }
    });
}

function validateForm() {
    const form = document.getElementById('contact-form');
    const fields = form.querySelectorAll('input, textarea');
    let isValid = true;

    fields.forEach(field => {
        if (!validateField(field)) isValid = false;
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let errorMessage = '';

    if (!value) {
        errorMessage = `${fieldName} is required`;
    } else {
        if (fieldName === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) errorMessage = 'Invalid email format';
        }
        if (fieldName === "message" && value.length < 5) {
            errorMessage = 'Message must be at least 5 characters';
        }
    }

    if (errorMessage) {
        showFieldError(field, errorMessage);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) {
        errorElement.textContent = message;
        field.style.borderColor = '#f85149';
    }
}

function clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`);
    if (errorElement) errorElement.textContent = '';
    field.style.borderColor = '';
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea').forEach(el => el.style.borderColor = '');
}

function showSuccessMessage() {
    const successElement = document.getElementById('form-success');
    if (successElement) {
        successElement.style.display = 'flex';
        setTimeout(() => successElement.style.display = 'none', 5000);
    }
}

// ----------------------
// Scroll animations
// ----------------------
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('fade-in');
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.project-card, .writing-item, .timeline-item, .skill-tag')
        .forEach(el => observer.observe(el));
}

// ----------------------
// Header scroll effect
// ----------------------
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    header.style.background = 'rgba(13, 17, 23, 0.95)';
    header.style.backdropFilter = window.scrollY > 100 ? 'blur(20px)' : 'blur(10px)';
});

// Export utilities
window.PortfolioJS = {
    validateForm,
    showSuccessMessage,
    clearErrors
};
