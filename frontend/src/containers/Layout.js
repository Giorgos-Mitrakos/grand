import React from 'react';
import './Layout.css';
import Header from '../components/Header';
import Contacts from '../components/Contacts';
import Footer from '../components/Footer';
import MobileMenu from '../menu/MobileMenu';
import { useSelector } from 'react-redux';
import Routes from '../routes/Routes';
import SearchButton from '../components/SearchButton';

function Layout() {
    const menuToggle = useSelector(state => state.menuToggle);
    const { isMenuOpen } = menuToggle;

    return (
        <div className="layout-container">
            <div className="contacts-container">
                <Contacts />
            </div>
            <header className="header-container">
                <Header />
            </header>
            <div className="mobile-menu-search">
                <div className="mobile-menu-container">
                    {isMenuOpen && <MobileMenu />}
                </div>
                <div className="mobile-search">
                    <SearchButton />
                </div>
            </div>
            <Routes />
            <footer className="footer-container">
                <Footer />
            </footer>
        </div>
    )
}

export default Layout;