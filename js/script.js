/**
 * Nimbus Buildathon 2.O - Interactive Logic & Configuration
 */

// ==========================================================================
// 1. CONFIGURATION
// ==========================================================================
// Centralized configuration variables for organizers to easily modify.
const CONFIG = {
    // Replace this string with the actual Google Forms URL
    googleFormUrl: "https://forms.gle/HRVb6rcbS1FZpeXb8",
    
    // Smooth scrolling offset (matches the sticky navbar height in pixels)
    scrollOffset: 70
};


// ==========================================================================
// 2. DOM CONTENT LOADED INITIALIZATION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Toggle Mobile Navigation
    initMobileNav();

    // Smooth Scroll navigation links (with offset adjustments)
    initSmoothScroll();

    // Initialize IntersectionObserver for Scroll Animations (Reveal)
    initScrollAnimations();

    // Initialize Registration Payment Reveal Flow
    initRegistrationFlow();

    // Initialize Scroll Spy to highlight active section links
    initScrollSpy();

    // Initialize Gallery horizontal scroll controls
    initGallery();
});


// ==========================================================================
// 3. MOBILE NAVIGATION (HAMBURGER MENU)
// ==========================================================================
function initMobileNav() {
    const hamburger = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");
    const navLinkItems = document.querySelectorAll(".nav-link");

    if (!hamburger || !navLinks) return;

    // Toggle menu visibility and active states on click
    hamburger.addEventListener("click", () => {
        const isExpanded = hamburger.getAttribute("aria-expanded") === "true";
        hamburger.setAttribute("aria-expanded", !isExpanded);
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });

    // Close menu when clicking a link
    navLinkItems.forEach(item => {
        item.addEventListener("click", () => {
            hamburger.setAttribute("aria-expanded", "false");
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        });
    });
}


// ==========================================================================
// 4. SMOOTH SCROLLING WITH OFFSET CORRECTION
// ==========================================================================
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not(#open-form-btn):not(.gallery-card):not(.lightbox-close):not(.lightbox-backdrop), #hero-cta-btn');

    scrollLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();

            // Extract the anchor target
            let targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            // Calculate exact position with header offset
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - CONFIG.scrollOffset;

            // Perform smooth scroll
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });
}


// ==========================================================================
// 5. REGISTRATION PAYMENT & FORM REVEAL FLOW
// ==========================================================================
function initRegistrationFlow() {
    const paymentBtn = document.getElementById("payment-done-btn");
    const formRevealBox = document.getElementById("form-reveal-box");
    const openFormBtn = document.getElementById("open-form-btn");
    const paymentBox = document.getElementById("payment-box");

    if (!paymentBtn || !formRevealBox || !openFormBtn || !paymentBox) return;

    // Dynamically assign Google Form URL from configuration
    openFormBtn.setAttribute("href", CONFIG.googleFormUrl);

    paymentBtn.addEventListener("click", () => {
        // 1. Hide the QR/Payment card completely
        paymentBox.style.display = "none";

        // 2. Reveal the Google Form card
        formRevealBox.classList.add("active");

        // 3. Set focus state for accessibility
        formRevealBox.focus();

        // 4. Smooth scroll down to make the form reveal box fully visible
        setTimeout(() => {
            const elementPosition = formRevealBox.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - CONFIG.scrollOffset - 20; // Additional buffer

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }, 50);
    });
}


// ==========================================================================
// 6. SCROLL SPY (ACTIVE LINK HIGHLIGHTING)
// ==========================================================================
function initScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!sections.length || !navLinks.length) return;

    window.addEventListener("scroll", () => {
        let currentSectionId = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - CONFIG.scrollOffset - 30; // buffer
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        // Toggle .active class on navigation links
        navLinks.forEach(link => {
            link.classList.remove("active");
            const href = link.getAttribute("href");
            if (href === `#${currentSectionId}` || (currentSectionId === "" && href === "#")) {
                link.classList.add("active");
            }
        });
    });
}


// ==========================================================================
// 7. SCROLL-TRIGGERED ENTRANCE ANIMATIONS (REVEAL)
// ==========================================================================
function initScrollAnimations() {
    // Add '.reveal' class to sections and elements we want to animate
    const animElements = document.querySelectorAll(
        "section, .info-card, .benefit-card, .prize-card, .sponsor-card, .registration-column, .gallery-card"
    );

    animElements.forEach(el => {
        el.classList.add("reveal");
    });

    const observerOptions = {
        root: null, // relative to viewport
        threshold: 0.1, // trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // bottom margin to trigger slightly before entering
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animElements.forEach(el => {
        revealObserver.observe(el);
    });
}


// ==========================================================================
// 8. GALLERY HORIZONTAL SCROLL CONTROLLER
// ==========================================================================
function initGallery() {
    const track = document.querySelector(".gallery-track");
    const leftBtn = document.querySelector(".gallery-arrow-left");
    const rightBtn = document.querySelector(".gallery-arrow-right");

    if (!track) return;

    // --- Arrow button scroll ---
    const getScrollAmount = () => {
        const card = track.querySelector(".gallery-card");
        if (!card) return 300;
        const style = getComputedStyle(track);
        const gap = parseFloat(style.gap) || 20;
        return card.offsetWidth + gap;
    };

    const updateArrows = () => {
        if (!leftBtn || !rightBtn) return;
        const scrollLeft = Math.round(track.scrollLeft);
        const maxScroll = track.scrollWidth - track.clientWidth;

        leftBtn.disabled = scrollLeft <= 1;
        rightBtn.disabled = scrollLeft >= maxScroll - 1;
    };

    if (leftBtn) {
        leftBtn.addEventListener("click", () => {
            track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        });
    }

    if (rightBtn) {
        rightBtn.addEventListener("click", () => {
            track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        });
    }

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    // Initial state
    updateArrows();

    // --- Mouse drag scrolling for desktop ---
    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    track.addEventListener("mousedown", (e) => {
        // Don't interfere with link clicks unless dragged
        isDragging = true;
        hasDragged = false;
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
        track.style.cursor = "grabbing";
        track.style.scrollBehavior = "auto"; // disable smooth during drag
    });

    track.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.2;
        if (Math.abs(walk) > 5) hasDragged = true;
        track.scrollLeft = scrollStart - walk;
    });

    const stopDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = "";
        track.style.scrollBehavior = "smooth";
    };

    track.addEventListener("mouseup", stopDrag);
    track.addEventListener("mouseleave", stopDrag);

    // Prevent link navigation if user was dragging
    track.querySelectorAll(".gallery-card").forEach(card => {
        card.addEventListener("click", (e) => {
            if (hasDragged) {
                e.preventDefault();
                hasDragged = false;
            }
        });
    });

    // --- Keyboard support for track focus ---
    track.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
        }
    });
}
