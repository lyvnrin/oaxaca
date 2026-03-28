import { useNavigate } from 'react-router-dom';
import Grainient from '../../components/Grainient';
import './Landing.css';

function Landing() {
    
    // NAVIGATION --------------------------
    const navigate = useNavigate();
    return (
        <div className="landing-wrapper">

            {/* LANDING : HERO SECTION*/}
            <section className="container">
                <Grainient
                    color1="#781111" color2="#b94609" color3="#9a0e0e"
                    timeSpeed={0.25} colorBalance={0}
                    warpStrength={1} warpFrequency={3} warpSpeed={1.5} warpAmplitude={40}
                    blendAngle={0} blendSoftness={0.1}
                    rotationAmount={500}
                    noiseScale={2} grainAmount={0} grainScale={2} grainAnimated={false}
                    contrast={1.2} gamma={1} saturation={0.6}
                    centerX={-0.09} centerY={0.05} zoom={0.9}
                />

                {/* TOP NAV LINKS */}
                <div className="top-nav"> 
                    <a className="nav-link" href="#about">ABOUT</a>
                    <a className="nav-link" href="#footer">CONTACT</a>
                    <a className="nav-link" href="/staff">STAFF</a>
                </div>

                {/* HERO TITLE + TAGLINE */}
                <div className="content">
                    <h1 className="title">OAXACA</h1>
                    <p className="welcome-text">Bold flavours, vibrant dining. Experience the taste of Mexico.</p>
                </div>

                {/* SCROLL HINT */}
                <a className="scroll-hint" href="#about">
                    <span>LEARN MORE</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <polyline points="6 9 12 15 18 9"/> </svg>
                </a>
            </section>

            {/* ABOUT */}
            <section className="about-section" id="about">
                
                {/* BACKGROUND */}
                <Grainient
                    color1="#6d2d17" color2="#9b552c" color3="#4b2311"
                    timeSpeed={0.25} colorBalance={0}
                    warpStrength={1} warpFrequency={3} warpSpeed={1.5} warpAmplitude={40}
                    blendAngle={0} blendSoftness={0.1}
                    rotationAmount={400}
                    noiseScale={2} grainAmount={0} grainScale={2} grainAnimated={false}
                    contrast={1.2} gamma={1} saturation={0.6}
                    centerX={-0.09} centerY={0.05} zoom={0.9}
                />

                {/* ABOUT INFO + BOOKING BTN */}
                <div className="about-content">
                    <p className="about-eyebrow">OUR STORY</p>
                    <h2 className="about-heading">Where Mexico Comes Alive</h2>
                    <p className="about-body">
                        Rooted in the rich culinary traditions of Oaxaca, we bring the warmth of Mexican culture to every plate. From low-braised meats to hand-pressed tortillas, every dish is a celebration of bold spice, fresh ingredients, and generations of craft.
                    </p>
                    <p className="about-body">
                        Whether you're joining us for a casual lunch or a late-night feast, our doors are always open.
                    </p>
                    <button className="book-btn" onClick={() => navigate('/customer-login')}>BOOK NOW</button>
                </div>
            </section>

            {/* FOOTER : CONTACT */}
            <footer className="site-footer" id="footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <span className="footer-logo">OAXACA</span>
                        <p className="footer-tagline">Bold flavours, vibrant dining.</p>
                    </div>

                    {/* LOCATION + HOURS */}
                    <div className="footer-contact">
                        <p className="footer-label">FIND US</p>
                        <p>12 Spice Lane, London EC1A 1BB</p>
                        <p>Mon – Sun: 12pm – 11pm</p>
                    </div>

                    {/* CONTACT INFO */}
                    <div className="footer-contact">
                        <p className="footer-label">GET IN TOUCH</p>
                        <p>hello@oaxaca.co.uk</p>
                        <p>+44 20 7946 0321</p>
                    </div>

                    {/* SOCIAL LINKS */}
                    <div className="footer-contact">
                        <p className="footer-label">FOLLOW US</p>
                        <p>@oaxaca_london</p>
                        <p>Instagram · TikTok</p>
                    </div>
                </div>

                {/* FOOTER BAR : copyright info*/}
                <div className="footer-bottom">
                    <span>© 2025 Oaxaca. All rights reserved.</span>
                </div>
            </footer>
        </div>
    );
}

export default Landing;