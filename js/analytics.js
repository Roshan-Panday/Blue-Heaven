/* =========================================
   BLUE HEAVEN ANALYTICS (GA4)
   ID: G-YK2VEHTLCD
   ========================================= */

// 1. CONFIGURATION
const GA_MEASUREMENT_ID = 'G-YK2VEHTLCD';

// 2. LOAD GOOGLE ANALYTICS LIBRARY AUTOMATICALLY
(function() {
    // Only load if not already present
    if(document.querySelector(`script[src*="${GA_MEASUREMENT_ID}"]`)) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag; // Make global
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);
    
    console.log("📊 GA4 Loaded: " + GA_MEASUREMENT_ID);
})();

// 3. GLOBAL TRACKER HELPER
// Call this from rooms.js when a booking happens
function trackConversion(eventName, label, value = 0) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'Conversion',
            'event_label': label,
            'value': value,
            'currency': 'INR'
        });
        console.log(`📡 Event Sent: ${eventName} | ${label} | ₹${value}`);
    } else {
        console.warn("⚠️ GA4 not loaded yet.");
    }
}

// 4. AUTO-TRACK STANDARD CLICKS
document.addEventListener('DOMContentLoaded', () => {
    // Track WhatsApp General Links
    document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackConversion('whatsapp_click', 'General Inquiry');
        });
    });

    // Track Phone Calls
    document.querySelectorAll('a[href*="tel:"]').forEach(btn => {
        btn.addEventListener('click', () => {
            trackConversion('call_click', 'Phone Call');
        });
    });
});