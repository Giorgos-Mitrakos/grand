import React, { useState, useEffect } from 'react';
import './ToolPanel.css';
import TextModal from '../components/textModal.js'

function ToolPanel (){
          const [selectedTab,setSelectedTab]=useState();

    useEffect(()=>{
        return ()=>{
            
        };
    },[selectedTab])

    const fileSelectedHandler = (event) =>{
        console.log(event.target.files[0]);
    }

    return(
        <div className="tool-panel">
            <div className="tab">
                <button className={`tablinks ${selectedTab===0 ? "active" : ""}`} onClick={()=>setSelectedTab(0)}><i class="material-icons">text_format</i>Κείμενο</button>
                <button className={`tablinks ${selectedTab===1 ? "active" : ""}`} onClick={()=>setSelectedTab(1)}><i class="material-icons">insert_photo</i>Εικόνες</button>
                <button className={`tablinks ${selectedTab===2 ? "active" : ""}`} onClick={()=>setSelectedTab(2)}><i class="material-icons">dashboard</i>Σχήματα</button>
                <button className={`tablinks ${selectedTab===3 ? "active" : ""}`} onClick={()=>setSelectedTab(3)}><div class="square"></div>Φόντο</button>
                <button className={`tablinks ${selectedTab===4 ? "active" : ""}`} onClick={()=>setSelectedTab(4)}><i class="material-icons">favorite</i>Cliparts</button>
                <button className={`tablinks ${selectedTab===5 ? "active" : ""}`} onClick={()=>setSelectedTab(5)}><i class="material-icons">layers</i>Επίπεδο</button>
            </div>
            <div className="panels">
                {selectedTab===0 && <TextModal className="tabcontent"></TextModal>}

                <div id="Paris" className="tabcontent" style={{display:selectedTab===1?"block":"none"}}>
                    <input type="file" onChange={fileSelectedHandler}></input>
                    <button>Upload</button>
                </div>

                <div id="Tokyo" className="tabcontent" style={{display:selectedTab===2?"block":"none"}}>
                <h3>Tokyo</h3>
                <p>Tokyo is the capital of Japan.</p>
                </div>
            </div>
        </div>
        
    )

}

export default ToolPanel;