/**
 * Flip Card Subscribe — LIZENKO.tech
 * Vanilla JS implementation (no jQuery, no Splitting.js)
 *
 * 1. Splits submitted email into individual <span class="char"> elements
 * 2. Triggers the flip animation on the SVG + button
 * 3. Resets after 3 seconds
 */

(function () {
    'use strict';

    var wrap = document.getElementById('flip-subscribe-wrap');
    var form = document.querySelector('.flip-subscribe-form');
    var emailInput = document.querySelector('.flip-subscribe-input-email');
    var field = document.querySelector('.flip-subscribe-field');
    var wordContainer = field ? field.querySelector('.word') : null;

    if (!wrap || !form || !emailInput) return;

    /**
     * Split a string into individual <span class="char"> elements
     * with data-char attributes for the CSS :after pseudo-element.
     */
    function splitIntoChars(text) {
        // Clear any existing chars
        if (wordContainer) wordContainer.innerHTML = '';

        var fragment = document.createDocumentFragment();

        for (var i = 0; i < text.length; i++) {
            var ch = document.createElement('span');
            ch.className = 'char';
            ch.setAttribute('data-char', text[i]);
            fragment.appendChild(ch);
        }

        if (wordContainer) {
            wordContainer.className = 'word'; // reset
            wordContainer.appendChild(fragment);
        }
    }

    /**
     * Trigger the flip animation sequence
     */
    function triggerFlip(emailText) {
        // 1. Split the email text into chars
        splitIntoChars(emailText);

        // 2. Add 'flip' class to wrap (triggers SVG + button + spark animations via CSS)
        wrap.classList.add('flip');

        // 3. After a short delay, trigger the char slide animation
        setTimeout(function () {
            if (wordContainer) {
                // Force reflow then add slide class
                void wordContainer.offsetWidth;
                wordContainer.classList.add('slide');
            }
        }, 1);
    }

    /**
     * Reset the flip card to its initial state
     */
    function resetFlip() {
        wrap.classList.remove('flip');

        // Clear the displayed email chars
        if (wordContainer) {
            wordContainer.className = 'word';
            wordContainer.innerHTML = '';
        }

        // Clear the input
        if (emailInput) emailInput.value = '';

        // Remove any leftover paragraphs
        var leftovers = field ? field.querySelectorAll('p') : [];
        for (var i = 0; i < leftovers.length; i++) {
            leftovers[i].remove();
        }
    }

    /**
     * Handle form submission
     */
    function handleSubmit(e) {
        e.preventDefault();

        var emailText = (emailInput.value || '').trim();

        if (!emailText) return;

        // Trigger the flip animation
        triggerFlip(emailText);

        // Reset after 3 seconds
        setTimeout(function () {
            resetFlip();
        }, 3000);
    }

    // Listen for form submit
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

})();
