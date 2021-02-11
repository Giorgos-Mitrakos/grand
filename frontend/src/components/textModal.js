import React from 'react';
import './textModal.css';
import { addText } from '../action/editorActions';
import { useDispatch, useSelector } from 'react-redux';

function TextModal(){

    const textEditor = useSelector(state=>state.textEditor);
    const {textCount}=textEditor;
    const dispatch= useDispatch();

    const handleText =(txt)=>{
        dispatch(addText(txt,textCount+1));
    }

    return(        
            <div className="font-families">
                <button onClick={(e)=>handleText(e.target.className)} className="arial">Arial</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Yellowtail">Yellowtail</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Oswald">Oswald</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Playfair Display">Playfair</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Orbitron">Orbitron</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Dancing Script">Dancing</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Aclonica">Aclonica</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Bonbon">Bonbon</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Monoton">Monoton</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Arizonia">Arizonia</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Aguafina Script">Aguafina</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Akronim">Akronim</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Alex Brush">Alex</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Amita">Amita</button>
                <button onClick={(e)=>handleText(e.target.className)} className="Bungee Shade">Bungee</button>
            </div> 
    )
}

export default TextModal;