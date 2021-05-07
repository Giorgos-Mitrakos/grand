import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendNewsLetterMailDeletingConfirmation } from '../action/emailActions';
import { removeFromNewsletterList } from '../action/userActions';
import './Gdpr.css';
import { Helmet } from 'react-helmet';

function NewsletterDisclaimer(props) {
    
const [email,setEmail] =useState('');
const [comments,setComments] = useState('');
const removeFromNewsletter = useSelector(state=>state.removeFromNewsletter);
const {successRemoving} = removeFromNewsletter; 
const emailRemoveNewsletter = useSelector(state=>state.emailRemoveNewsletter);
const {successSending} = emailRemoveNewsletter;
const dispatch = useDispatch();

const submitHandler = (e) =>{
    e.preventDefault();
    dispatch(removeFromNewsletterList(email, comments));
}

useEffect(()=>{
    if(successRemoving===true)
    {
        dispatch(sendNewsLetterMailDeletingConfirmation(email, comments));
    }
    else if(successRemoving===false){
        alert("Το Email σας δεν υπήρχε καταχωρημένο στη λίστα μας!")
    }
    return ()=>{

    }
},[successRemoving]);

useEffect(()=>{
    if(successSending)
    {
        alert("Η διαγραφή σας από τους καταλόγους των Newsletters μας ολοκληρώθηκε επιτυχώς.\nΣας έχει σταλεί email επιβεβαίωσης.Παρακαλώ ελέγξτε τα εισερχόμενα σας.\nΣε περίπτωση που δεν βλέπετε το μήνημα ελέγξτε το φάκελο της ανεπιθύμητης αλληλογραφίας.")
        setEmail('');
        setComments('');
    }
    
    return ()=>{

    }
},[successSending]);

useEffect(()=>{
    window.scrollTo(0,0)
    
    return ()=>{

    }
},[]);

    return(
        <div className="gdpr-container">
            <Helmet>
                <title>Grand Mobile Accessories-Newsletter</title>
                <meta name="description" content="Κάνε εγγραφή στα newsletters του grandmobile.gr μείνε ενημερωμένος και επωφελήσου από τις προσφορές." />
                <meta name="keywords" content="newsletters, εμαιλ, email." />
            </Helmet>
            <ul className="gdpr">
            <li>
                <h3>ΔΗΛΩΣΗ ΕΝΗΜΕΡΩΜΕΝΗΣ ΣΥΓΚΑΤΑΘΕΣΗΣ ΓΙΑ NEWSLETTER</h3>
                <p>
                    για σκοπούς Μarketing<br/><br/>
                    Με την παρούσα δηλώνω τα ακόλουθα αναφορικά με τη διεύθυνση 
                    ηλεκτρονικού μου ταχυδρομείου («τα Δεδομένα») που διέθεσα 
                    στην Υπεύθυνη Επεξεργασίας εταιρεία με την επωνυμία «Α.ΑΓΓΕΛΕΤΟΥ» 
                    με σκοπό να ενημερώνομαι με την λήψη newsletter στο ηλεκτρονικό μου 
                    ταχυδρομείο για τα προϊόντα, τις δράσεις και τα νέα της Εταιρείας:
                </p>
            </li>
            <li>
                <p>
                Έχοντας ενημερωθεί από την <Link to="/Πολιτική-Απορρήτου">Πολιτική Προστασίας Προσωπικών Δεδομένων</Link>:
                </p>
            </li>
            <li>
                <p>
                (α) για τα δικαιώματα μου, όπως αυτά προσδιορίζονται για τα υποκείμενα 
                των δεδομένων στις διατάξεις της εθνικής και ευρωπαϊκής νομοθεσίας 
                και ειδικότερα του Γενικού Ευρωπαϊκού Κανονισμού 697/2016 σχετικά 
                με την προστασία δεδομένων προσωπικού χαρακτήρα 
                (και συγκεκριμένα τα δικαιώματα της ενημέρωσης, της πρόσβασης, 
                της διόρθωσης, της διαγραφής, του περιορισμού, της φορητότητας 
                και της εναντίωσης).
                </p>
            </li>
            <li>
                <p>
                (β) ειδικότερα ότι για την τυχόν άσκηση των δικαιωμάτων μου 
                αρμόδιο πρόσωπο επικοινωνίας, ορισμένο από την Εταιρεία είναι 
                ο Υπεύθυνος Προστασίας Δεδομένων τον οποίο μπορώ να αναζητήσω 
                στην ηλεκτρονική διεύθυνση <strong>grandmobile@grandmobile.gr</strong> στον οποίο 
                θα απευθύνω τυχόν αίτημά μου για άσκηση κάποιου εκ των δικαιωμάτων μου 
                αναφορικά με τα προσωπικά δεδομένα.
                </p>
            </li>
            <li>
                <p>
                (γ) πως διατηρώ το δικαίωμα να ανακαλέσω τη συναίνεση που παρέχω 
                σήμερα με την παρούσα επιλέγοντας τη σχετική εντολή διαγραφής 
                από τη λίστα. 
                </p>
            </li>
            <li>
                <p>
                (δ) πως τα Δεδομένα τηρούνται από την Εταιρεία και δεν διαβιβάζονται 
                παρά στους απολύτως αναγκαίους εκτελούντες την επεξεργασία παρόχους 
                υποστήριξης ηλεκτρονικών συστημάτων και δικτύων της Εταιρείας. 
                </p>
            </li>
            <li>
                <h3>Ανάκληση συναίνεσης εγγραφής στο newsletter</h3>
                <form className="newsletter-desclaimer" onSubmit={submitHandler}>
                    <label>EMAIL (ΑΠΑΙΤΕΙΤΑΙ)</label>
                    <input type="email" className="newsletter-desclaimer-email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
                    <textarea type="textarea" className="newsletter-desclaimer-textarea" placeholder="Σχόλια" value={comments} onChange={(e)=>setComments(e.target.value)}
                    maxLength="500" rows="5"></textarea>
                    <input type="submit" id="submit-message" name="submit-message" value="Διαγραφή"></input>
                </form>                
            </li>
            
        </ul>
        </div>
    )
}

export default NewsletterDisclaimer;