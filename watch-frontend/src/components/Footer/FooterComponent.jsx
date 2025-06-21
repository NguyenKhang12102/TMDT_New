import React from 'react';
import './Footer.css';

const FooterComponent = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-column">
                    <h4>About Us</h4>
                    <p><strong>Website:</strong> <a href="https://www.watchstore.com" target="_blank" rel="noopener noreferrer">www.watchstore.com</a></p>
                    <p><strong>Email:</strong> <a href="mailto:support@watchstore.com">support@watchstore.com</a></p>
                    <p><strong>Phone:</strong> +1 800-123-4567</p>
                </div>
                <div className="footer-column">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                        <li><a href="/terms-of-service">Terms of Service</a></li>
                        <li><a href="/shop">Shop Now</a></li>
                        <li><a href="/contact-us">Contact Us</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Follow Us</h4>
                    <ul className="social-links">
                        <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                        <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Watch Store. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default FooterComponent;
