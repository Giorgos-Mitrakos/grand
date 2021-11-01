import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductMenu.css';

function ProductMenu(props) {

    const [mobileModal, setMobileModal] = useState(false);
    const [tabletModal, setTabletModal] = useState(false);
    const [desktopModal, setDesktopModal] = useState(false);
    const [keyboardMouseModal, setKeyboardMouseModal] = useState(false);
    const [pcHardwearModal, setPcHardwearModal] = useState(false)
    const [networkModal, setNetworkModal] = useState(false)
    const [laptopModal, setLaptopModal] = useState(false);
    const [multimediaModal, setMultimediaModal] = useState(false);
    const [camerasModal, setCamerasModal] = useState(false);
    const [storageModal, setStorageModal] = useState(false);
    const [soundSystemModal, setSoundSystemModal] = useState(false);
    const [tvModal, setTvModal] = useState(false);
    const [officeSuppliesModal, setOfficeSuppliesModal] = useState(false);
    const [batteriesModal, setBatteriesModal] = useState(false);
    const [rolePaperModal, setRolePaperModal] = useState(false);
    const [paperModal, setPaperModal] = useState(false);
    const [inksModal, setInksModal] = useState(false);
    const [softwareModal, setSoftwareModal] = useState(false);
    const [gamingModal, setGamingModal] = useState(false);
    const [lightingModal, setLightingModal] = useState(false);
    const [gadgetModal, setGadgetModal] = useState(false);
    const [freeTimeModal, setFreeTimeModal] = useState(false);
    const [autoMotoModal, setAutoMotoModal] = useState(false);
    const [medicalDevicesModal, setMedicalDevicesModal] = useState(false);

    return (
        <div className="product-menu-containter">
            <div className="menu-header" onClick={() => setMobileModal(!mobileModal)}>
                <div>
                    <i className="material-icons">tablet_android</i>
                    <h5>Κινητή Τηλεφωνία</h5>
                </div>
                <i className="material-icons expand">{!mobileModal ? "expand_more" : "expand_less"}</i>
            </div>
            {mobileModal && <ul className="first-modal">
                <Link to="/products/Κινητά/Used-Refurbished"><li>Used - Refurbished</li></Link>
                <Link to="/products/Κινητά/Κινητά"><li>Κινητά</li></Link>
                <Link to="/products/Κινητά/Προστασία-Οθόνης"><li>Προστασία Οθόνης</li></Link>
                <Link to="/products/Κινητά/Θήκες-Κινητών"><li>Θήκες Κινητών</li></Link>
                <Link to="/products/Κινητά/Car-Kit"><li>Car Kit</li></Link>
                <Link to="/products/Κινητά/Bluetooth"><li>Bluetooth</li></Link>
                <Link to="/products/Κινητά/Handsfree"><li>Handsfree</li></Link>
                <Link to="/products/Κινητά/Smartwatches"><li>Smartwatches</li></Link>
                <Link to="/products/Κινητά/Φορτιστές-Κινητών"><li>Φορτιστές Κινητών</li></Link>
                <Link to="/products/Μπαταρίες/PowerBanks"><li>Power Banks</li></Link>
                <Link to="/products/Κινητά/Καλώδια-Φόρτισης-Δεδομένων"><li>Καλώδια Φόρτισης-Δεδομένων</li></Link>
                <Link to="/products/Κινητά/Adapters-Φόρτισης-Δεδομένων"><li>Adapters Φόρτισης-Δεδομένων</li></Link>
                <Link to="/products/Κινητά/Selfie-Sticks"><li>Selfie Sticks</li></Link>
                <Link to="/products/Κινητά/Βάσεις-Στήριξης-Κινητών"><li>Βάσεις Στήριξης Κινητών</li></Link>
                <Link to="/products/Κινητά/Γραφίδες"><li>Γραφίδες</li></Link>
                <Link to="/products/Κινητά/Διάφορα-αξεσουάρ"><li>Διάφορα αξεσουάρ</li></Link>
                <Link to="/products/Κινητά/Ανταλλακτικά-Κινητών"><li>Ανταλλακτικά Κινητών</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setTabletModal(!tabletModal)}>
                <div>
                    <i className="material-icons">tablet</i>
                    <h5>Tablet</h5>
                </div>
                <i className="material-icons expand">{!tabletModal ? "expand_more" : "expand_less"}</i>
            </div>
            {tabletModal && <ul className="first-modal">
                <Link to="/products/Tablet/Used-Refurbished"><li>Used - Refurbished</li></Link>
                <Link to="/products/Tablet/Tablet"><li>Tablet</li></Link>
                <Link to="/products/Tablet/Προστασία-Οθόνης"><li>Προστασία Οθόνης</li></Link>
                <Link to="/products/Tablet/Θήκες-Tablet"><li>Θήκες Tablet</li></Link>
                <Link to="/products/Tablet/Βάσεις"><li>Βάσεις Tablet</li></Link>
                <Link to="/products/Tablet/Φορτιστές-tablet"><li>Φορτιστές Tablet</li></Link>
                <Link to="/products/Μπαταρίες/PowerBanks"><li>Power Banks</li></Link>
                <Link to="/products/Kινητά/Καλώδια-Φόρτισης-Δεδομένων"><li>Καλώδια Φόρτισης-Δεδομένων</li></Link>
                <Link to="/products/Kινητά/Adapters-Φόρτισης-Δεδομένων"><li>Adapters Φόρτισης-Δεδομένων</li></Link>
                <Link to="/products/Tablet/Selfie-Sticks"><li>Selfie Sticks</li></Link>
                <Link to="/products/Tablet/Διάφορα-αξεσουάρ"><li>Διάφορα αξεσουάρ</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setDesktopModal(!desktopModal)}>
                <div>
                    <i className="material-icons">desktop_windows</i>
                    <h5>Desktop</h5>
                </div>
                <i className="material-icons expand">{!desktopModal ? "expand_more" : "expand_less"}</i>
            </div>
            {desktopModal && <ul className="first-modal">
                <Link to="/products/Desktop/Used-Refurbished"><li>Used - Refurbished</li></Link>
                <Link to="/products/Desktop/Desktop-PC"><li>Desktop PC</li></Link>
                <Link to="/products/Μultimedia/Οθόνες"><li>Οθόνες</li></Link>
                <Link to="/products/Μultimedia/Ηχεία"><li>Ηχεία</li></Link>
                <li className="menu-header" onClick={() => setKeyboardMouseModal(!keyboardMouseModal)}>
                    <h5>Πληκτρολόγια & Ποντίκια</h5>
                    <i className="material-icons expand">{!keyboardMouseModal ? "expand_more" : "expand_less"}</i>
                </li>
                {keyboardMouseModal && <ul className="second-modal">
                    <Link to="/products/Πληκτρολόγια-Ποντίκια/Πληκτρολόγια"><li>Πληκτρολόγια</li></Link>
                    <Link to="/products/Πληκτρολόγια-Ποντίκια/Ποντίκια"><li>Ποντίκια</li></Link>
                </ul>}
                <Link to="/products/Desktop/MousePads"><li>MousePads</li></Link>
                <Link to="/products/cameras/web-cameras"><li>Webcams</li></Link>
                <Link to="/products/Μultimedia/Headsets"><li>Headsets</li></Link>
                <Link to="/products/Μultimedia/Μικρόφωνα"><li>Μικρόφωνα</li></Link>
                <Link to="/products/Desktop/Εκτυπωτές"><li>Εκτυπωτές</li></Link>
                <Link to="/products/Desktop/Bluetooth-Adapters"><li>Bluetooth Adapters</li></Link>
                <Link to="/products/Desktop/Διάφορα-Περιφερειακά"><li>Διάφορα Περιφερειακά</li></Link>
                <li className="menu-header" onClick={() => setPcHardwearModal(!pcHardwearModal)}>
                    <h5>Pc Hardwear</h5>
                    <i className="material-icons expand">{!pcHardwearModal ? "expand_more" : "expand_less"}</i>
                </li>
                {pcHardwearModal && <ul className="second-modal">
                    <Link to="/products/Pc-Hardwear/Τροφοδοτικά"><li>Τροφοδοτικά-PC</li></Link>
                    <Link to="/products/Pc-Hardwear/Δίσκοι-SSD"><li>Δίσκοι &amp; SSD</li></Link>
                    <Link to="/products/Pc-Hardwear/DVD-RW"><li>DVD-RW</li></Link>
                    <Link to="/products/Pc-Hardwear/Μνήμες-Ram"><li>Μνήμες Ram</li></Link>
                    <Link to="/products/Pc-Hardwear/Καλώδια"><li>Καλώδια</li></Link>
                </ul>}
                <li className="menu-header" onClick={() => setNetworkModal(!networkModal)}>
                    <h5>Δικτυακός Εξοπλισμός</h5>
                    <i className="material-icons expand">{!networkModal ? "expand_more" : "expand_less"}</i>
                </li>
                {networkModal && <ul className="second-modal">
                    <Link to="/products/Δικτυακός-Εξοπλισμός/Κάρτες-Δικτύου"><li>Κάρτες Δικτύου</li></Link>
                    <Link to="/products/Δικτυακός-Εξοπλισμός/Range-Extenders-Powerlines"><li>Range Extenders - Powerlines</li></Link>
                    <Link to="/products/Δικτυακός-Εξοπλισμός/Switches"><li>Switches</li></Link>
                    <Link to="/products/Δικτυακός-Εξοπλισμός/Καλώδια"><li>Καλώδια</li></Link>
                </ul>}
            </ul>}
            <div className="menu-header" onClick={() => setLaptopModal(!laptopModal)}>
                <div>
                    <i className="material-icons">laptop</i>
                    <h5>Laptop</h5>
                </div>
                <i className="material-icons expand">{!laptopModal ? "expand_more" : "expand_less"}</i>
            </div>
            {laptopModal && <ul className="first-modal">
                <Link to="/products/Laptop/Used-Refurbished"><li>Used - Refurbished</li></Link>
                <Link to="/products/Laptop/laptop"><li>Laptop</li></Link>
                <Link to="/products/Laptop/Τσάντες-Laptop"><li>Τσάντες Laptop</li></Link>
                <Link to="/products/Laptop/Φορτιστές-Laptop"><li>Φορτιστές Laptop</li></Link>
                <Link to="/products/Laptop/Μπαταρίες-Laptop"><li>Μπαταρίες Laptop</li></Link>
                <Link to="/products/Laptop/Bάσεις-Docking-Station-Laptop"><li>Bάσεις & Docking Station Laptop</li></Link>
                <Link to="/products/Laptop/Διάφορα-Αξεσουάρ-Laptop"><li>Διάφορα Αξεσουάρ για Laptop</li></Link>
                <Link to="/products/Laptop/Ανταλλακτικά-Laptop"><li>Ανταλλακτικά για Laptop</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setMultimediaModal(!multimediaModal)}>
                <div>
                    <i className="material-icons">headset_mic</i>
                    <h5>Εικόνα - Ήχος</h5>
                </div>
                <i className="material-icons expand">{!multimediaModal ? "expand_more" : "expand_less"}</i>
            </div>
            {multimediaModal && <ul className="first-modal">
                <Link to="/products/Multimedia/Οθόνες"><li>Οθόνες</li></Link>
                <Link to="/products/Multimedia/Ηχεία"><li>Ηχεία</li></Link>
                <li className="menu-header" onClick={() => setCamerasModal(!camerasModal)}>
                    <h5>Cameras</h5>
                    <i className="material-icons expand">{!camerasModal ? "expand_more" : "expand_less"}</i>
                </li>
                {camerasModal && <ul className="second-modal">
                    <Link to="/products/Cameras/web-cameras"><li>Web Cameras</li></Link>
                    <Link to="/products/Cameras/Κάμερες-καταγραφής-πορείας"><li>Κάμερες καταγραφής πορείας</li></Link>
                    <Link to="/products/Cameras/Action-Cameras"><li>Action Cameras</li></Link>
                    <Link to="/products/Cameras/Action-Cameras-Accessories"><li>Action Cameras Accessories</li></Link>
                    <Link to="/products/Cameras/Car-Cameras"><li>Car Cameras</li></Link>
                    <Link to="/products/Cameras/Photo-Cameras"><li>Photo Cameras</li></Link>
                    <Link to="/products/Cameras/Θήκες-Τσάντες"><li>Θήκες/Τσάντες</li></Link>
                    <Link to="/products/Cameras/Φακοί-Flash"><li>Φακοί/Flash Κάμερας</li></Link>
                    <Link to="/products/Cameras/Τρίποδα"><li>Τρίποδα</li></Link>
                    <Link to="/products/Cameras/Αξεσουάρ-Κάμερας"><li>Αξεσουάρ Κάμερας</li></Link>
                </ul>}
                <Link to="/products/Multimedia/mp3-mp4-players"><li>MP3 & MP4 Players</li></Link>
                <Link to="/products/Multimedia/Μικρόφωνα"><li>Μικρόφωνα</li></Link>
                <Link to="/products/Multimedia/Headsets"><li>Headsets</li></Link>
                <Link to="/products/Multimedia/Usb-Hubs-Card-Readers"><li>Usb Hubs - Card Readers</li></Link>
                <li className="menu-header" onClick={() => setStorageModal(!storageModal)}>
                    <h5>Αποθηκευτικά Μέσα</h5>
                    <i className="material-icons expand">{!storageModal ? "expand_more" : "expand_less"}</i>
                </li>
                {storageModal && <ul className="second-modal">
                    <Link to="/products/Αποθηκευτικά-Μέσα/CD-DVD"><li>CD - DVD</li></Link>
                    <Link to="/products/Αποθηκευτικά-Μέσα/Flash-Drivers"><li>Flash Drivers</li></Link>
                    <Link to="/products/Αποθηκευτικά-Μέσα/Memory-Cards"><li>Memory Cards</li></Link>
                </ul>}
                <Link to="/products/Multimedia/Game-Controllers-Accessories"><li>Game Controllers & Accessories</li></Link>
                <Link to="/products/Multimedia/Pointing-Devices"><li>Pointing Devices</li></Link>
                <Link to="/products/Multimedia/3D-Pen"><li>3D Pen</li></Link>
                <li className="menu-header" onClick={() => setSoundSystemModal(!soundSystemModal)}>
                    <h5>Ηχοσυστήματα</h5>
                    <i className="material-icons expand">{!soundSystemModal ? "expand_more" : "expand_less"}</i>
                </li>
                {soundSystemModal && <ul className="second-modal">
                    <Link to="/products/Multimedia/Αξεσουάρ-Ήχου"><li>Αξεσουάρ Ήχου</li></Link>
                    <Link to="/products/Multimedia/Ηχοσυστήματα-Αυτοκινήτου"><li>Ηχοσυστήματα Αυτοκινήτου</li></Link>
                    <Link to="/products/Multimedia/Ηχοσυστήματα"><li>Ηχοσυστήματα</li></Link>
                    <Link to="/products/Multimedia/Φορητά-Ηχοσυστήματα"><li>Φορητά Ηχοσυστήματα</li></Link>
                    <Link to="/products/Multimedia/Πικάπ"><li>Πικάπ</li></Link>
                    <Link to="/products/Multimedia/Ραδιόφωνα"><li>Ραδιόφωνα</li></Link>
                    <Link to="/products/Multimedia/Karaoke"><li>Karaoke</li></Link>
                    <Link to="/products/Multimedia/Walkie-Talkie-Συσκευές-Υπαγόρευσης"><li>Walkie Talkie-Συσκευές Υπαγόρευσης</li></Link>
                </ul>}
                <li className="menu-header" onClick={() => setTvModal(!tvModal)}>
                    <h5>Τηλεοράσεις</h5>
                    <i className="material-icons expand">{!tvModal ? "expand_more" : "expand_less"}</i>
                </li>
                {tvModal && <ul className="second-modal">
                    <Link to="/products/Multimedia/Τηλεοράσεις"><li>Τηλεοράσεις</li></Link>
                    <Link to="/products/Multimedia/Φορήτες-Τηλεοράσεις"><li>Φορήτες Τηλεοράσεις</li></Link>
                    <Link to="/products/Multimedia/Home-Cinema"><li>Home Cinema</li></Link>
                    <Link to="/products/Multimedia/Media-Players"><li>Media Players</li></Link>
                    <Link to="/products/Multimedia/Βάσεις-Στήριξης-TV"><li>Βάσεις Στήριξης TV</li></Link>
                    <Link to="/products/Multimedia/Κεραίες-TV"><li>Κεραίες</li></Link>
                    <Link to="/products/Multimedia/Ψηφιακοί-Δεκτές-Αποκωδικοποιητές"><li>Ψηφιακοί Δεκτές/<br/>Αποκωδικοποιητές</li></Link>
                    <Link to="/products/Multimedia/Αξεσουάρ-TV"><li>Αξεσουάρ Τηλεόρασης</li></Link>
                </ul>}
            </ul>}
            <div className="menu-header" onClick={() => setOfficeSuppliesModal(!officeSuppliesModal)}>
                <div>
                    <i className="material-icons">edit</i>
                    <h5>Είδη Γραφείου</h5>
                </div>
                <i className="material-icons expand">{!officeSuppliesModal ? "expand_more" : "expand_less"}</i>
            </div>
            {officeSuppliesModal && <ul className="first-modal">
                <Link to="/products/είδη-γραφείου/Σταθερά-Τηλέφωνα"><li>Σταθερά Τηλέφωνα</li></Link>
                <Link to="/products/είδη-γραφείου/καταστροφείς-εγγράφων"><li>Καταστροφείς Εγγράφων</li></Link>
                <li className="menu-header" onClick={() => setBatteriesModal(!batteriesModal)}>
                    <h5>Μπαταρίες</h5>
                    <i className="material-icons expand">{!batteriesModal ? "expand_more" : "expand_less"}</i>
                </li>
                {batteriesModal && <ul className="second-modal">
                    <Link to="/products/Μπαταρίες/Λιθίου"><li>Λιθίου</li></Link>
                    <Link to="/products/Μπαταρίες/Επαναφορτιζόμενες"><li>Επαναφορτιζόμενες</li></Link>
                    <Link to="/products/Μπαταρίες/Αλκαλικές"><li>Αλκαλικές</li></Link>
                </ul>}
                <li className="menu-header" onClick={() => setRolePaperModal(!rolePaperModal)}>
                    <h5>Ρολλά Μηχανημάτων</h5>
                    <i className="material-icons expand">{!rolePaperModal ? "expand_more" : "expand_less"}</i>
                </li>
                {rolePaperModal && <ul className="second-modal">
                    <Link to="/products/Ρολλά-μηχανημάτων/Plotter"><li>Plotter</li></Link>
                    <Link to="/products/Ρολλά-μηχανημάτων/Αυτοκόλλητες Ετικέτες"><li>Αυτοκόλλητες Ετικέτες</li></Link>
                    <Link to="/products/Ρολλά-μηχανημάτων/Θερμικά Ταμειακών - POS"><li>Θερμικά Ταμειακών - POS</li></Link>
                </ul>}
                <li className="menu-header" onClick={() => setPaperModal(!paperModal)}>
                    <h5>Χαρτιά</h5>
                    <i className="material-icons expand">{!paperModal ? "expand_more" : "expand_less"}</i>
                </li>
                {paperModal && <ul className="second-modal">
                    <Link to="/products/χαρτιά/Εκτυπώσεων-Φωτοτυπιών"><li>Εκτυπώσεων - Φωτοτυπιών</li></Link>
                    <Link to="/products/χαρτιά/Ετικέτες"><li>Ετικέτες</li></Link>
                    <Link to="/products/χαρτιά/Φωτογραφικό"><li>Φωτογραφικό</li></Link>
                </ul>}
                <Link to="/products/είδη-γραφείου/Υλικά-Πλαστικοποίησης"><li>Υλικά Πλαστικοποίησης</li></Link>
                <Link to="/products/είδη-γραφείου/Καθαριστικά"><li>Καθαριστικά</li></Link>
                <li className="menu-header" onClick={() => setInksModal(!inksModal)}>
                    <h5>Μελάνια</h5>
                    <i className="material-icons expand">{!inksModal ? "expand_more" : "expand_less"}</i>
                </li>
                {inksModal && <ul className="second-modal">
                    <Link to="/products/Laser/Μελάνια"><li>Laser μελάνια</li></Link>
                    <Link to="/products/Inkjet/Μελάνια"><li>Inkjet μελάνια</li></Link>
                    <Link to="/products/Laser/Drums"><li>Drums</li></Link>
                </ul>}
            </ul>}
            <div className="menu-header" onClick={() => setSoftwareModal(!softwareModal)}>
                <div>
                    <i className="material-icons">apps</i>
                    <h5>Προγράμματα & Υπηρεσίες</h5>
                </div>
                <i className="material-icons expand">{!softwareModal ? "expand_more" : "expand_less"}</i>
            </div>
            {softwareModal && <ul className="first-modal">
                <Link to="/products/προγράμματα-υπηρεσίες/Antivirus"><li>Antivirus</li></Link>
                <Link to="/products/προγράμματα-υπηρεσίες/PEGASUS-Μηχανογράφηση"><li>PEGASUS Μηχανογράφηση</li></Link>
                <Link to="/products/προγράμματα-υπηρεσίες/e-TOKEN-Ψηφιακή-Υπογραφή"><li>e-TOKEN Ψηφιακή Υπογραφή</li></Link>
                <Link to="/products/προγράμματα-υπηρεσίες/Υπηρεσίες"><li>Υπηρεσίες</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setGamingModal(!gamingModal)}>
                <div>
                    <i className="material-icons">sports_esports</i>
                    <h5>Gaming</h5>
                </div>
                <i className="material-icons expand">{!gamingModal ? "expand_more" : "expand_less"}</i>
            </div>
            {gamingModal && <ul className="first-modal">
                <Link to="/products/Gaming/Gamepads"><li>Gamepads</li></Link>
                <Link to="/products/Gaming/Παιχνίδια"><li>Παιχνίδια</li></Link>
                <Link to="/products/Gaming/Virtual-Reality"><li>Virtual Reality</li></Link>
                <Link to="/products/Gaming/Αξεσουάρ"><li>Αξεσουάρ</li></Link>
                <Link to="/products/Gaming/Τιμονιέρες"><li>Τιμονιέρες</li></Link>
                <Link to="/products/Gaming/Joysticks"><li>Joysticks</li></Link>
                <Link to="/products/Gaming/Gaming-Chair"><li>Gaming Chair</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setLightingModal(!lightingModal)}>
                <div>
                    <i className="material-icons">emoji_objects</i>
                    <h5>Φωτισμός</h5>
                </div>
                <i className="material-icons expand">{!lightingModal ? "expand_more" : "expand_less"}</i>
            </div>
            {lightingModal && <ul className="first-modal">
                <Link to="/products/Φωτισμός/Λάμπες-LED"><li>Λάμπες LED</li></Link>
                <Link to="/products/Φωτισμός/Προβολείς-LED"><li>Προβολείς LED</li></Link>
                <Link to="/products/Φωτισμός/Πολύμπριζα"><li>Πολύμπριζα</li></Link>
                <Link to="/products/Φωτισμός/Εργαλεία"><li>Εργαλεία</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setGadgetModal(!gadgetModal)}>
                <div>
                    <i className="material-icons">devices_other</i>
                    <h5> Gadgets</h5>
                </div>
                <i className="material-icons expand">{!gadgetModal ? "expand_more" : "expand_less"}</i>
            </div>
            {gadgetModal && <ul className="first-modal">
                <li className="menu-header" onClick={() => setFreeTimeModal(!freeTimeModal)}>
                    <h5>Ελεύθερος Χρόνος</h5>
                    <i className="material-icons expand">{!freeTimeModal ? "expand_more" : "expand_less"}</i>
                </li>
                {freeTimeModal && <ul className="second-modal">
                    <Link to="/products/Gadgets/Κυάλια"><li>Κυάλια</li></Link>
                    <Link to="/products/Gadgets/Πατίνια"><li>Πατίνια</li></Link>
                    <Link to="/products/Gadgets/Μικροσκοπία"><li>Μικροσκοπία</li></Link>
                </ul>}
                <li className="menu-header" onClick={() => setAutoMotoModal(!autoMotoModal)}>
                    <h5>Auto-Moto</h5>
                    <i className="material-icons expand">{!autoMotoModal ? "expand_more" : "expand_less"}</i>
                </li>
                {autoMotoModal && <ul className="second-modal">
                    <Link to="/products/Gadgets/Συσκευές-Πλοήγησης-GPS"><li>Συσκευές Πλοήγησης GPS</li></Link>
                    <Link to="/products/Gadgets/Κάμερες-Αυτοκινήτου"><li>Κάμερες Αυτοκινήτου</li></Link>
                    <Link to="/products/Gadgets/Αξεσουάρ-Αυτοκινήτου"><li>Αξεσουάρ Αυτοκινήτου</li></Link>
                    <Link to="/products/Gadgets/Διάφορα"><li>Διάφορα</li></Link>
                </ul>}
                <Link to="/products/Gadgets/Ψηφιακές-Κορνίζες"><li>Ψηφιακές Κορνίζες</li></Link>
                <Link to="/products/Gadgets/Drones"><li>Drones</li></Link>
            </ul>}
            <div className="menu-header" onClick={() => setMedicalDevicesModal(!medicalDevicesModal)}>
                <div>
                    <i className="material-icons">medical_services</i>
                    <h5>Ιατρικά Είδη</h5>
                </div>
                <i className="material-icons expand">{!medicalDevicesModal ? "expand_more" : "expand_less"}</i>
            </div>
            {medicalDevicesModal && <ul className="first-modal">
                <Link to="/products/Ιατρικά-Είδη/Προστασίας"><li>Προστασίας</li></Link>
                <Link to="/products/Ιατρικά-Είδη/Οξύμετρα"><li>Οξύμετρα</li></Link>
                <Link to="/products/Ιατρικά-Είδη/Θερμόμετρα"><li>Θερμόμετρα</li></Link>
                <Link to="/products/Ιατρικά-Είδη/Συσκευές-Αποστείρωσης"><li>Συσκευές Αποστείρωσης</li></Link>
                <Link to="/products/Ιατρικά-Είδη/Αντισηπτικά"><li>Αντισηπτικά</li></Link>
            </ul>}

        </div>
    );
}

export default ProductMenu;