import React from 'react';
import { useNavigate } from 'react-router-dom';
import Grainient from '../../components/Grainient';
import './Landing.css';

function FirstLanding() {
    const navigate = useNavigate();

    return (
        <div className="landing-wrapper">

            {/* ── HERO SECTION ── */}
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

                <div className="top-nav">
                    
                    
                    <a className="nav-link staff-nav-link" href="/staff">STAFF</a>
                    <a className="nav-link" href="/settings">SETTINGS</a>
                    <a className="nav-link" href="#about">about</a>
                    <a className="nav-link" href="#footer">contact</a>
                    
                </div>

                <div className="content">
                    <h1 className="title">OAXACA</h1>
                    <p className="welcome-text">Bold flavours, vibrant dining. Experience the taste of Mexico.</p>
                    <div className="button-group">
                        {/* <button className="choice-btn" onClick={() => navigate('/customer-login')}>CUSTOMER</button> */}
                    </div>
                </div>

                <a className="scroll-hint" href="#about">
                    <span>LEARN MORE</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </a>
            </section>

            {/* ── ABOUT SECTION ── */}
            <section className="about-section" id="about">
                <Grainient
                    color1="#781111" color2="#b94609" color3="#9a0e0e"
                    timeSpeed={0.1} colorBalance={0.3}
                    warpStrength={0.6} warpFrequency={2} warpSpeed={0.8} warpAmplitude={25}
                    blendAngle={180} blendSoftness={0.2}
                    rotationAmount={200}
                    noiseScale={2} grainAmount={0} grainScale={2} grainAnimated={false}
                    contrast={1.1} gamma={1} saturation={0.5}
                    centerX={0.1} centerY={-0.05} zoom={0.9}
                />
                <div className="about-content">
                    <p className="about-eyebrow">OUR STORY</p>
                    <h2 className="about-heading">Where Mexico Comes Alive</h2>
                    <p className="about-body">
                        Rooted in the rich culinary traditions of Oaxaca, we bring the warmth of
                        Mexican culture to every plate. From slow-braised meats to hand-pressed
                        tortillas, every dish is a celebration of bold spice, fresh ingredients,
                        and generations of craft.
                    </p>
                    <p className="about-body">
                        Whether you're joining us for a casual lunch or a late-night feast,
                        our doors are always open — and the mole is always on.
                    </p>
                    <button className="book-btn" onClick={() => navigate('/customer-login')}>
                        BOOK NOW
                    </button>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="site-footer" id="footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <span className="footer-logo">OAXACA</span>
                        <p className="footer-tagline">Bold flavours, vibrant dining.</p>
                    </div>
                    <div className="footer-contact">
                        <p className="footer-label">FIND US</p>
                        <p>12 Spice Lane, London EC1A 1BB</p>
                        <p>Mon – Sun: 12pm – 11pm</p>
                    </div>
                    <div className="footer-contact">
                        <p className="footer-label">GET IN TOUCH</p>
                        <p>hello@oaxaca.co.uk</p>
                        <p>+44 20 7946 0321</p>
                    </div>
                    <div className="footer-contact">
                        <p className="footer-label">FOLLOW US</p>
                        <p>@oaxaca_london</p>
                        <p>Instagram · TikTok</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>© 2025 Oaxaca. All rights reserved.</span>
                    <button className="staff-link" onClick={() => navigate('/staff')}>Staff Login</button>
                </div>
            </footer>

        </div>
    );
}

export default FirstLanding;