/*!
 * Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
 */

/**
 * Contact Form Submission Handler
 * Handles validation and submission of the contact form
 * Simplified: no success/error message divs, no phone field
 */
function handleContactFormSubmit(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submitButton');

    // Reset error states
    if (nameInput) nameInput.classList.remove('is-invalid');
    if (emailInput) emailInput.classList.remove('is-invalid');
    if (messageInput) messageInput.classList.remove('is-invalid');

    let isValid = true;

    if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }

    if (!messageInput.value.trim()) {
        messageInput.classList.add('is-invalid');
        isValid = false;
    }

    if (!isValid) return;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Simulate submission (replace with real API call)
    setTimeout(function() {
        submitButton.disabled = false;
        submitButton.textContent = 'Send';
        document.getElementById('contactForm').reset();
    }, 1500);
}

/**
 * Add event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (nameInput)
        nameInput.addEventListener('input', function() { this.classList.remove('is-invalid'); });
    if (emailInput)
        emailInput.addEventListener('input', function() { this.classList.remove('is-invalid'); });
    if (messageInput)
        messageInput.addEventListener('input', function() { this.classList.remove('is-invalid'); });
});
