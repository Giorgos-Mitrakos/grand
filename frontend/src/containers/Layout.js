import React from 'react';
import './Layout.css';
import Header from '../components/Header';
import Contacts from '../components/Contacts';
import Footer from '../components/Footer';
import MobileMenu from '../menu/MobileMenu';
import { useSelector } from 'react-redux';
import Routes from '../routes/Routes';

function Layout() {
    const menuToggle = useSelector(state => state.menuToggle);
    const { isMenuOpen } = menuToggle;

    return (
        <div className="layout-container">
            <div className="header-contacts-container">
                <div className="contacts-container">
                    <Contacts />
                </div>
                <header className="header-container">
                    <Header />
                </header>
            </div>
            <main className="main-container">
                <div className="mobile-menu-container">
                    {isMenuOpen && <MobileMenu />}
                </div>
                <Routes />
            </main>
            <footer className="footer-container">
                <Footer />
            </footer>
        </div>
    )
}

export default Layout;