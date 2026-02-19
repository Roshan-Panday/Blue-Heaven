/* =========================================
   BLUE HEAVEN - MAIN ENGINE
   Handles: Dynamic Includes, Mobile Menu, Data, Animations
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log("System: Blue Heaven UI Loaded");

    // 1. Load Header & Footer dynamically
    loadIncludes();

    // 2. Load Global Data (Phone numbers etc.)
    loadSiteData();

    // 3. Init Animations (These can run immediately)
    initScrollAnimations();
    initSmoothScroll();
});

/* ------------------------------------------------
   1. DYNAMIC COMPONENT LOADER
   ------------------------------------------------ */
function loadIncludes() {
    // --- LOAD HEADER ---
    fetch('includes/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                
                // IMPORTANT: Initialize UI *after* header exists
                initMobileMenu(); 
                initStickyHeader(); 
                setActiveLink(); 
            }
        })
        .catch(err => console.error("Error loading header:", err));

    // --- LOAD FOOTER ---
    fetch('includes/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                
                // Re-run data fill so the new footer gets the phone numbers
                loadSiteData(); 
                
                // Trigger your Sticky Button fix here if needed, 
                // or let your separate script handle it if it's working.
            }
        })
        .catch(err => console.error("Error loading footer:", err));
}

// Helper: Highlights the current page in the menu
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    
    links.forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.style.color = "#FFC107"; 
        }
    });
}

/* ------------------------------------------------
   2. GLOBAL SITE DATA (Phone/Links)
   ------------------------------------------------ */
function loadSiteData() {
    fetch('data/site.json')
        .then(res => res.json())
        .then(config => {
            updateText('global-phone-1', config.phones.primary);
            updateText('global-phone-2', config.phones.secondary);
            updateText('global-email', config.email);
            
            // Update Sticky Bar
            const stickyCall = document.getElementById('sticky-call');
            if(stickyCall) stickyCall.href = `tel:${config.phones.primary.replace(/\s/g, '')}`;
            
            const stickyWa = document.getElementById('sticky-wa');
            if(stickyWa) stickyWa.href = `https://wa.me/${config.whatsapp}`;
        })
        .catch(err => console.log("Site data waiting..."));
}

function updateText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

/* ------------------------------------------------
   3. UI INTERACTION (Mobile Menu & Scroll)
   ------------------------------------------------ */
function initMobileMenu() {
    // --- PART A: HAMBURGER TOGGLE ---
    const mobileBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        // Clone button to remove old listeners
        const newBtn = mobileBtn.cloneNode(true);
        mobileBtn.parentNode.replaceChild(newBtn, mobileBtn);

        newBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            
            const icon = newBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !newBtn.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = newBtn.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- PART B: ADVENTURE DROPDOWN FIX (MOVED HERE) ---
    // This is the part that was missing/broken before. 
    // It is now inside the function that runs AFTER the header loads.
    const dropdownLink = document.querySelector('.dropdown > a');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (dropdownLink && dropdownMenu) {
        // Clone to remove old listeners
        const newDropLink = dropdownLink.cloneNode(true);
        dropdownLink.parentNode.replaceChild(newDropLink, dropdownLink);

        newDropLink.addEventListener('click', function(e) {
            // Only run toggle logic on Mobile (Screen width < 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Stop page reload/jump
                
                // Toggle Display
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                } else {
                    dropdownMenu.style.display = 'block';
                }
            }
        });
    }
}

// --- FIXED STICKY HEADER FUNCTION ---
function initStickyHeader() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.luxury-header');
        if (!header) return; 

        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.style.backgroundColor = '#003366'; 
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            header.style.paddingTop = '10px';
            header.style.paddingBottom = '10px';
        } else {
            header.classList.remove('scrolled');
            header.style.backgroundColor = 'transparent';
            header.style.boxShadow = 'none';
            header.style.paddingTop = '';
            header.style.paddingBottom = '';
        }
    });
}

/* ------------------------------------------------
   4. ANIMATIONS & SCROLL
   ------------------------------------------------ */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                entry.target.style.opacity = 1;
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hero-content, .section-title, .deal-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });
}

// --- KEEPING YOUR STICKY BUTTON FIX ---
// (I left this here because you said you fixed it and want to keep it)
document.addEventListener("DOMContentLoaded", function() {
    const countryCode = "91";
    const mobileNumber = "7302263252"; 
    const waNumber = countryCode + mobileNumber; 
    const callNumber = "+" + countryCode + mobileNumber; 
    const waMessage = "Hi, I am interested in booking a stay at Blue Heaven Camp.";

    const callButtons = document.querySelectorAll('.sticky-btn.btn-call, .btn-call');
    callButtons.forEach(btn => {
        btn.href = `tel:${callNumber}`; 
    });

    const waButtons = document.querySelectorAll('.sticky-btn.btn-whatsapp, .btn-whatsapp, .cms-wa-link');
    waButtons.forEach(btn => {
        btn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;
        btn.target = "_blank"; 
    });
});