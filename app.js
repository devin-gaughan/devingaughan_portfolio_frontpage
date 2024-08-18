
/*
// Theme toggle button
const toggleButton = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-link');

// Store theme preference in localStorage
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
    themeLink.href = storedTheme;
}

toggleButton.addEventListener('click', function () {
    if (themeLink.href.includes('style.css')) {
        themeLink.href = 'dark-mode.css';
        localStorage.setItem('theme', 'dark-mode.css');
        toggleButton.textContent = 'Toggle Light Mode';
    } else {
        themeLink.href = 'style.css';
        localStorage.setItem('theme', 'style.css');
        toggleButton.textContent = 'Toggle Dark Mode';
    }
}); */

// Select elements
const header = document.querySelector("header");
const navBackground = document.querySelector("nav");
const navLinks = document.querySelectorAll(".navlinks li");

// Navigation Hamburger Menu
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navlinks');

    // Toggle Navigation Menu
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.3s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
};

// Initialize navigation slide
navSlide();
