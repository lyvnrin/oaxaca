import React, { useState } from 'react';
import './SettingsModal.css';

function SettingsModal({ onClose }) {
    const [fontSize, setFontSize] = useState('medium');
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-panel" onClick={e => e.stopPropagation()}>

                <div className="settings-header">
                    <h2 className="settings-title">SETTINGS</h2>
                    <button className="settings-close" onClick={onClose}>✕</button>
                </div>

                <div className="settings-body">

                    {/* APPEARANCE */}
                    <div className="settings-section">
                        <p className="settings-section-label">Appearance</p>

                        <div className="settings-row">
                            <span className="settings-row-label">Dark Mode</span>
                            <button
                                className={`toggle-btn ${darkMode ? 'on' : 'off'}`}
                                onClick={() => setDarkMode(!darkMode)}
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>

                        <div className="settings-row">
                            <span className="settings-row-label">Font Size</span>
                            <div className="segmented">
                                {['small', 'medium', 'large'].map(size => (
                                    <button
                                        key={size}
                                        className={`seg-btn ${fontSize === size ? 'active' : ''}`}
                                        onClick={() => setFontSize(size)}
                                    >
                                        {size.charAt(0).toUpperCase() + size.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* NOTIFICATIONS */}
                    <div className="settings-section">
                        <p className="settings-section-label">Notifications</p>

                        <div className="settings-row">
                            <span className="settings-row-label">Enable Notifications</span>
                            <button
                                className={`toggle-btn ${notifications ? 'on' : 'off'}`}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <span className="toggle-thumb" />
                            </button>
                        </div>
                    </div>

                    {/* ACCOUNT */}
                    {/* <div className="settings-section">
                        <p className="settings-section-label">Account</p>
                        <div className="settings-row">
                            <span className="settings-row-label">Version</span>
                            <span className="settings-row-value">1.0.0</span>
                        </div>
                        <button className="settings-danger-btn">Sign Out</button>
                    </div> */}

                </div>
            </div>
        </div>
    );
}

export default SettingsModal;