/* =========================================
   BLUE HEAVEN - ROOMS & PACKAGES ENGINE (CMS ENABLED)
   ========================================= */

let allData = [];
let siteConfig = {}; // To store global settings (phone, email)
let currentPkgName = "Package";
let currentPkgPrice = 0;

// 1. Run immediately when page loads
document.addEventListener('DOMContentLoaded', () => {
    // First, try to load site settings (CMS)
    fetchSiteSettings();
});

// 2. Fetch Global Site Settings (Phone, WA, etc.)
function fetchSiteSettings() {
    fetch('data/site.json')
        .then(res => res.json())
        .then(config => {
            siteConfig = config;
            updateGlobalContacts(); // Update Header/Footer phones immediately
            fetchData(); // Then load the rooms/packages
        })
        .catch(err => {
            console.warn("Site settings not found, using defaults.", err);
            fetchData(); // Load rooms anyway
        });
}

// Update Header, Footer, and Sticky Bar from CMS
function updateGlobalContacts() {
    if (!siteConfig.phones) return;

    const primaryPhone = siteConfig.phones.primary;
    const secondaryPhone = siteConfig.phones.secondary;
    const waLink = `https://wa.me/${siteConfig.whatsapp}`;
    const email = siteConfig.email;

    // Update Text Elements (Footer, Contact Page)
    if(document.getElementById('global-phone-1')) document.getElementById('global-phone-1').innerText = primaryPhone;
    if(document.getElementById('global-phone-2')) document.getElementById('global-phone-2').innerText = secondaryPhone;
    if(document.getElementById('global-email')) document.getElementById('global-email').innerText = email;

    // Update Clickable Links (Mobile Bar, Header Buttons)
    document.querySelectorAll('.cms-phone-link').forEach(el => {
        el.href = `tel:${primaryPhone.replace(/\s/g, '')}`;
    });
    document.querySelectorAll('.cms-wa-link').forEach(el => {
        el.href = waLink;
    });
}

// 3. Fetch the Database (Packages)
function fetchData() {
    fetch('data/rooms.json')
        .then(res => {
            if (!res.ok) throw new Error("JSON not found");
            return res.json();
        })
        .then(data => {
            allData = data;
            
            // Check if we are on the Detail Page (package.html?id=xyz)
            const urlParams = new URLSearchParams(window.location.search);
            const packageId = urlParams.get('id');

            if (packageId) {
                // If ID exists, load the specific package details
                loadPackageDetails(packageId);
            } else {
                // Otherwise, render the grid (Home, Rafting, Camping pages)
                renderGridLogic(data);
            }
        })
        .catch(err => {
            console.error("Error loading rooms:", err);
            const loader = document.getElementById('pkg-loader');
            if(loader) loader.innerHTML = "<h3 style='color:white'>Error loading data. Please refresh.</h3>";
        });
}

// =========================================
//  4. RENDER GRID LOGIC (Smart Filtering)
// =========================================
function renderGridLogic(data) {
    const path = window.location.pathname;

    // A. Check if we are on HOME PAGE (index.html) by looking for specific Section IDs
    const campGrid = document.getElementById('home-camping-grid');
    const raftGrid = document.getElementById('home-rafting-grid');
    const advGrid  = document.getElementById('home-adventure-grid');

    if (campGrid || raftGrid || advGrid) {
        // We are on Home Page -> Populate all 3 sections
        if(campGrid) renderCards(campGrid, data.filter(i => i.category === 'stay'));
        if(raftGrid) renderCards(raftGrid, data.filter(i => i.category === 'rafting'));
        if(advGrid)  renderCards(advGrid,  data.filter(i => i.category === 'adventure' || i.category === 'rental'));
    } 
    // B. Check if we are on Sub-Pages (Category Pages)
    else {
        const mainGrid = document.getElementById('room-grid');
        if(!mainGrid) return;
        
        if (path.includes('rafting')) renderCards(mainGrid, data.filter(i => i.category === 'rafting'));
        else if (path.includes('camping')) renderCards(mainGrid, data.filter(i => i.category === 'stay'));
        else if (path.includes('rentals')) renderCards(mainGrid, data.filter(i => i.category === 'rental'));
        else if (path.includes('adventure')) renderCards(mainGrid, data.filter(i => i.category === 'adventure'));
        else {
             // Fallback for generic page: Show Best Sellers
             renderCards(mainGrid, data.filter(i => i.badge === 'Best Seller' || i.badge === 'Most Popular').slice(0, 6));
        }
    }
}

// SHARED CARD RENDERER (Used by both Home and Sub-pages)
function renderCards(container, items) {
    if(!container) return;
    container.innerHTML = items.map((item, index) => {
        const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
        return `
        <article class="deal-card fade-in" style="animation-delay: ${index * 0.1}s">
            <a href="package.html?id=${item.id}" class="card-img" style="display:block">
                <span class="card-badge">${item.badge}</span>
                <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='assets/images/gallery/room1.jpeg'">
            </a>
            <div class="card-body">
                <a href="package.html?id=${item.id}"><h3 class="card-title">${item.title}</h3></a>
                <div class="feature-pills">${item.features.slice(0, 3).map(f => `<span>${f}</span>`).join('')}</div>
                <div class="card-footer">
                    <div class="price-block">
                        <div class="price">₹${item.price.toLocaleString()}</div>
                        <div class="price-row-bottom">
                            <span class="mrp">₹${item.mrp.toLocaleString()}</span>
                            <span class="discount">${discount}% OFF</span>
                        </div>
                    </div>
                    <a href="package.html?id=${item.id}" class="btn-book-card">View Details</a>
                </div>
            </div>
        </article>
        `;
    }).join('');
}

// =========================================
//  5. LOAD SINGLE PACKAGE (Detail Page)
// =========================================
function loadPackageDetails(id) {
    const item = allData.find(p => p.id === id);
    if (!item) {
        console.error("Package not found:", id);
        return;
    }

    // 1. Hide Loader, Show Content
    const loader = document.getElementById('pkg-loader');
    const content = document.getElementById('pkg-content'); // Fallback ID for package page container
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';

    // 2. Fill Text Data
    setText('pkg-title', item.title);
    setText('pkg-price', `₹${item.price.toLocaleString()} / person`);
    setText('pkg-badge', item.badge);
    setText('side-price', `₹${item.price.toLocaleString()}`);
    
    // CMS Dynamic Pricing on Detail Page
    const discount = Math.round(((item.mrp - item.price) / item.mrp) * 100);
    setText('pkg-price-final', `₹${item.price.toLocaleString()}`);
    setText('pkg-mrp', `₹${item.mrp.toLocaleString()}`);
    setText('pkg-discount-tag', `${discount}% OFF`);

    // 3. Fill Image
    const bg = document.getElementById('pkg-bg');
    if(bg) bg.src = item.image;

    // 4. Fill Description & Highlights
    const details = item.details || { 
        overview: item.description, 
        highlights: item.features, 
        itinerary: ["Arrival", "Activity", "Departure"] 
    };

    setText('pkg-desc', details.overview);

    const hlList = document.getElementById('pkg-highlights');
    if(hlList) {
        hlList.innerHTML = details.highlights.map(h => 
            `<li><i class="fas fa-check-circle" style="color:#FFC107"></i> ${h}</li>`
        ).join('');
    }

    const tlList = document.getElementById('pkg-timeline');
    if(tlList) {
        tlList.innerHTML = details.itinerary.map(t => `
            <div style="position: relative; padding-bottom: 20px; border-left: 2px solid #ddd; padding-left: 20px;">
                <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; background: #003366; border-radius: 50%;"></div>
                <p style="margin: 0; font-size: 15px; color:#555;">${t}</p>
            </div>
        `).join('');
    }

    // 5. Update Global Vars for Booking
    currentPkgName = item.title;
    currentPkgPrice = item.price;
}

// Helper
function setText(id, text) {
    const el = document.getElementById(id);
    if(el) el.innerText = text;
}

// =========================================
//  6. BOOKING MODAL LOGIC
// =========================================
function openBookingModal(name, price) {
    if(name) currentPkgName = name;
    if(price) currentPkgPrice = price;

    setText('modal-pkg-name', currentPkgName);
    setText('modal-pkg-price', `Best Rate: ₹${currentPkgPrice.toLocaleString()}`);
    
    document.getElementById('booking-modal').style.display = 'flex';
}

function closeBookingModal() {
    document.getElementById('booking-modal').style.display = 'none';
}

function sendWhatsApp() {
    const name = document.getElementById('user-name').value;
    const date = document.getElementById('checkin-date').value;
    const guests = document.getElementById('guest-count') ? document.getElementById('guest-count').value : "2";
    
    // Get phone from site config, or default fallback
    const waPhone = siteConfig.whatsapp || "918954779410";

    if(!name) {
        alert("Please enter your Name.");
        return;
    }

    const msg = `*Booking Inquiry (Blue Heaven)*%0A` +
                `---------------------------%0A` +
                `🏕️ *Package:* ${currentPkgName}%0A` +
                `💰 *Price:* ₹${currentPkgPrice} / person%0A` +
                `👤 *Name:* ${name}%0A` +
                `📅 *Date:* ${date}%0A` +
                `👥 *Guests:* ${guests}%0A` +
                `---------------------------%0A` +
                `Please confirm availability.`;

    window.open(`https://wa.me/${waPhone}?text=${msg}`, '_blank');
    closeBookingModal();
}