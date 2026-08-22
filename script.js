/* ================= CSS Variables ================= */
:root {
    --primary-color: #0B192C;      
    --primary-light: #1A365D;      
    --highlight-color: #F59E0B;    
    --secondary-color: #EC4899;    
    --text-main: #F8FAFC;          
    --text-muted: #CBD5E1;         
    --glass-bg: rgba(255, 255, 255, 0.05);
    --glass-border: rgba(255, 255, 255, 0.1);
    --transition: all 0.3s ease;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Prompt', sans-serif;
}

html { scroll-behavior: smooth; }

body {
    background-color: var(--primary-color);
    background-image: 
        radial-gradient(circle at 15% 50%, rgba(245, 158, 11, 0.08), transparent 25%),
        radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.08), transparent 25%);
    color: var(--text-main);
    overflow-x: hidden;
}

.glass {
    background: var(--glass-bg);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border);
}

h1, h2, h3 { font-weight: 700; line-height: 1.2; }
.highlight { color: var(--highlight-color); }
.w-100 { width: 100%; }

button, .btn-primary, .btn-secondary {
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    text-decoration: none;
    padding: 10px 24px;
}

.btn-primary {
    background: linear-gradient(135deg, #F59E0B, #D97706);
    color: #fff;
    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}
.btn-primary:hover { transform: translateY(-2px); }

.btn-secondary {
    background: linear-gradient(135deg, #EC4899, #BE185D);
    color: #fff;
    box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}
.btn-secondary:hover { transform: translateY(-2px); }

.btn-large { padding: 14px 24px; font-size: 1.1rem; }

/* User Profile UI */
.user-profile {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.1);
    padding: 5px 12px;
    border-radius: 30px;
    border: 1px solid var(--glass-border);
}

.user-profile img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
}

.user-profile span {
    font-size: 0.9rem;
    font-weight: 500;
    max-width: 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.btn-logout {
    background: rgba(239, 68, 68, 0.2);
    color: #EF4444;
    border: none;
    padding: 6px 10px;
    border-radius: 50%;
    cursor: pointer;
    transition: var(--transition);
}
.btn-logout:hover { background: #EF4444; color: #fff; }

.login-warning {
    text-align: center;
    padding: 30px;
    background: rgba(239, 68, 68, 0.05);
    border: 1px dashed rgba(239, 68, 68, 0.3);
    border-radius: 12px;
}
.login-warning p { margin-bottom: 15px; color: var(--text-muted); }

/* Navbar */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    padding: 15px 0;
    border-bottom: 1px solid var(--glass-border);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: var(--text-main);
    font-size: 1.2rem;
    font-weight: 700;
}

.nav-logo-img {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--highlight-color);
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 25px;
    align-items: center;
}

.nav-links a:not(.nav-btn) {
    color: var(--text-main);
    text-decoration: none;
    font-weight: 400;
    transition: var(--transition);
}
.nav-links a:not(.nav-btn):hover { color: var(--highlight-color); }

.hamburger {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-main);
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 100px 20px 50px;
    gap: 50px;
}

.hero-content h1 { font-size: 3.5rem; margin-bottom: 20px; }
.hero-content p { font-size: 1.1rem; color: var(--text-muted); margin-bottom: 30px; max-width: 500px; }

.hero-search {
    display: flex;
    align-items: center;
    padding: 12px 20px;
    border-radius: 50px;
    margin-bottom: 30px;
    background: rgba(255,255,255,0.1);
}

.hero-search input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--text-main);
    font-size: 1.1rem;
    width: 100%;
    padding-left: 15px;
}
.hero-search input::placeholder { color: rgba(255,255,255,0.5); }
.search-icon { color: var(--highlight-color); font-size: 1.2rem; }

.hero-buttons { display: flex; gap: 15px; }

.hero-image { position: relative; display: flex; justify-content: center; }
.hero-image img {
    width: 100%;
    max-width: 400px;
    border-radius: 20px;
    z-index: 2;
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    border: 3px solid rgba(255,255,255,0.1);
}

.glow-bg {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 300px; height: 300px;
    background: var(--highlight-color);
    filter: blur(100px); opacity: 0.2; z-index: 1;
}

/* Items Section */
.items-section { max-width: 1200px; margin: 0 auto; padding: 50px 20px; }

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40px;
    flex-wrap: wrap;
    gap: 20px;
}
.section-header h2 { font-size: 2.2rem; }

.filters { display: flex; gap: 10px; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 12px; }
.filter-btn { background: transparent; color: var(--text-muted); padding: 8px 16px; border-radius: 8px; }
.filter-btn:hover { color: var(--text-main); }
.filter-btn.active { background: var(--primary-light); color: var(--text-main); }

.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }

.card { border-radius: 16px; overflow: hidden; transition: var(--transition); position: relative; }
.card:hover { transform: translateY(-8px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); border-color: rgba(245, 158, 11, 0.3); }

.card-img-wrapper { position: relative; width: 100%; height: 200px; background: #112240; }
.card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }

.card-badge {
    position: absolute; top: 15px; right: 15px;
    padding: 5px 12px; border-radius: 20px;
    font-size: 0.8rem; font-weight: 600; color: #fff;
}
.badge-lost { background: linear-gradient(135deg, #EF4444, #B91C1C); }
.badge-found { background: linear-gradient(135deg, #10B981, #047857); }

.card-content { padding: 20px; }
.card-title { font-size: 1.3rem; margin-bottom: 10px; color: var(--highlight-color); }
.card-desc {
    color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.card-meta { display: flex; flex-direction: column; gap: 8px; font-size: 0.9rem; margin-bottom: 15px; }
.card-meta i { width: 20px; color: var(--secondary-color); }
.card-contact { padding-top: 15px; border-top: 1px solid var(--glass-border); font-size: 0.95rem; font-weight: 500; }
.card-contact i { color: var(--highlight-color); margin-right: 8px; }

/* Form Section */
.post-section { max-width: 800px; margin: 50px auto 100px; padding: 0 20px; }
.form-container { padding: 40px; border-radius: 20px; }
.form-container h2 { text-align: center; margin-bottom: 30px; font-size: 2rem; }

.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
label { display: block; margin-bottom: 8px; color: var(--text-muted); font-size: 0.95rem; }

input[type="text"], input[type="date"], textarea {
    width: 100%; padding: 12px 15px; border-radius: 8px;
    border: 1px solid var(--glass-border); background: rgba(0,0,0,0.2); color: var(--text-main);
}
input:focus, textarea:focus { outline: none; border-color: var(--highlight-color); background: rgba(0,0,0,0.4); }
input[type="file"] { width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; color: var(--text-muted); }

.radio-group { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.radio-card { cursor: pointer; }
.radio-card input { display: none; }
.radio-content {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 15px; border-radius: 10px; border: 2px solid var(--glass-border);
    background: rgba(255,255,255,0.05); color: var(--text-muted); font-weight: 500;
}
.radio-card input:checked + .radio-content {
    border-color: var(--highlight-color); background: rgba(245, 158, 11, 0.1); color: var(--highlight-color);
}

/* Footer */
footer { background: var(--primary-light); border-top: 1px solid var(--glass-border); padding: 40px 20px; text-align: center; }
.footer-logo { width: 60px; height: 60px; border-radius: 50%; margin-bottom: 15px; border: 2px solid var(--text-muted); }
.footer-content h3 { margin-bottom: 10px; }
.footer-content p { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 5px; }
.copyright { margin-top: 20px; font-size: 0.8rem; opacity: 0.6; }

.fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
.bounce { animation: float 4s ease-in-out infinite; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }

@media (max-width: 900px) {
    .hero { grid-template-columns: 1fr; text-align: center; padding-top: 120px; }
    .hero-content p { margin: 0 auto 30px; }
    .hero-search { max-width: 500px; margin: 0 auto 30px; }
    .hero-buttons { justify-content: center; }
    .hero-image { order: -1; }
}

@media (max-width: 768px) {
    .nav-links {
        position: absolute; top: 100%; left: 0; width: 100%;
        background: var(--primary-color); flex-direction: column; padding: 20px 0;
        border-bottom: 1px solid var(--glass-border); display: none;
    }
    .nav-links.active { display: flex; }
    .hamburger { display: block; }
    .hero-content h1 { font-size: 2.5rem; }
    .form-row { grid-template-columns: 1fr; }
    .form-container { padding: 25px; }
}
