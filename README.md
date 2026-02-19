Official website for Blue Heaven Camp – Where Luxury Meets Wild Adventure in the Himalayas.

A responsive, high-performance static website built for a luxury riverside camping and adventure resort located in Shivpuri, Rishikesh. The site showcases accommodation packages, river rafting expeditions, event galleries, and allows direct booking inquiries via WhatsApp.

🌐 Live Demo
blueheavencamp.in (Replace with your GitHub Pages link if testing)

🚀 Project Features
For the Business
Package Showcases: Clean, modern cards displaying Stays (Swiss Tents, AC Cottages) and Adventures (Rafting, Bungee).

Direct Conversion: Mobile-optimized sticky footer with one-touch "Call" and "WhatsApp Chat" buttons.

Categorized Gallery: A dynamic, custom-built lightbox gallery filtering through Seminars, Parties, Camping, and Video Highlights.

Travel Journal: Integrated blog section for SEO and local Rishikesh travel guides.

Under the Hood (Technical)
Dynamic Includes: Uses Vanilla JavaScript fetch() to load the Header and Footer dynamically across all pages (js/main.js).

Mobile-First Design: Fully responsive layouts with custom hamburger menus, mobile dropdowns, and sticky action bars.

Scroll Animations: Custom intersection observers for smooth, modern fade-in and slide-up effects as the user scrolls.

Centralized Data: Pulls contact numbers and emails from a single data/site.json file to update contact links across the entire site instantly.

🛠️ Tech Stack
Markup: HTML5

Styling: CSS3 (Custom responsive grid, flexbox, CSS variables)

Logic: Vanilla JavaScript (ES6+)

Icons & Fonts: FontAwesome 6, Google Fonts (Playfair Display, Lato)

Hosting: GitHub Pages / Standard Web Hosting

📂 Project Structure
Plaintext
├── assets/
│   ├── images/         # Compressed gallery photos and icons
│   └── video/          # Drone footage and background videos
├── css/
│   └── style.css       # Global stylesheet
├── data/
│   └── site.json       # Centralized contact info
├── includes/
│   ├── header.html     # Reusable navigation bar
│   └── footer.html     # Reusable footer
├── js/
│   ├── main.js         # Core engine (Includes, UI logic, Links)
│   └── analytics.js    # Tracking codes
├── index.html          # Home Page
├── camping.html        # Accommodation Packages
├── rafting.html        # River Rafting Packages
├── gallery.html        # Dynamic Lightbox Gallery
└── contact.html        # Contact & Inquiry Form
💻 Local Development Setup
Because this project uses JavaScript fetch() to load the header and footer dynamically, you cannot just double-click index.html to view it locally (due to CORS security restrictions in modern browsers).



👨‍💻 Developed By
Roshan Panday & Sidhant Roul Web Development & Digital Ad Agency Project
