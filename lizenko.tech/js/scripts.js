/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/

/**
 * Reset Contact Form
 * Resets the contact form to its initial state
 */
function resetContactForm() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('submitSuccessMessage');

    // Clear any existing auto-hide timeout
    if (window.autoHideTimeout) {
        clearTimeout(window.autoHideTimeout);
    }

    // Reset form fields
    contactForm.reset();

    // Hide success message
    successMessage.classList.add('d-none');

    // Remove any validation error states
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (nameInput) nameInput.classList.remove('is-invalid');
    if (emailInput) emailInput.classList.remove('is-invalid');
    if (messageInput) messageInput.classList.remove('is-invalid');
}

/**
 * Contact Form Submission Handler
 * Handles validation and submission of the contact form
 */
function handleContactFormSubmit(event) {
    // Prevent default form submission
    event.preventDefault();

    // Get form elements
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submitButton');
    const successMessage = document.getElementById('submitSuccessMessage');
    const errorMessage = document.getElementById('submitErrorMessage');

    // Clear any existing auto-hide timeout
    if (window.autoHideTimeout) {
        clearTimeout(window.autoHideTimeout);
    }

    // Reset previous error states
    nameInput.classList.remove('is-invalid');
    emailInput.classList.remove('is-invalid');
    messageInput.classList.remove('is-invalid');
    errorMessage.classList.add('d-none');
    successMessage.classList.add('d-none');

    // Validate form inputs
    let isValid = true;

    // Validate name
    if (!nameInput.value.trim()) {
        nameInput.classList.add('is-invalid');
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailPattern.test(emailInput.value)) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    }

    // Validate message
    if (!messageInput.value.trim()) {
        messageInput.classList.add('is-invalid');
        isValid = false;
    }

    // If validation fails, show error
    if (!isValid) {
        errorMessage.classList.remove('d-none');
        return;
    }

    // Disable submit button during submission
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Simulate form submission (replace with actual API call)
    setTimeout(function() {
        // Enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Send';

        // Show success message
        successMessage.classList.remove('d-none');

        // Auto-hide success message after 10 seconds (gives user time to see the "Send another message" button)
        window.autoHideTimeout = setTimeout(function() {
            if (!successMessage.classList.contains('d-none')) {
                successMessage.classList.add('d-none');
                contactForm.reset();
            }
        }, 10000);

    }, 1500);
}

/**
 * Add event listeners when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Add input event listeners to remove invalid class when user starts typing
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    if (nameInput) {
        nameInput.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', function() {
            this.classList.remove('is-invalid');
        });
    }
});