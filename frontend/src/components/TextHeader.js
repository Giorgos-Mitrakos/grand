import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFontFamily, selectedItemId, updateText } from '../action/editorActions';
import TextColorPicker from './ColorPicker.js';
import './TextHeader.css';

function TextHeader (){

    const textEditor= useSelector(state=>state.textEditor);
    const {selectedText,textItems}= textEditor;
    const dispatch= useDispatch();
        
    const initFontFamily=()=>{
        const itemSel = textItems.filter(item=>item.id===selectedText);
        return itemSel.map(item=>item.fontFamily);
    }

    const selFontFamily=(font)=>{
        dispatch(selectFontFamily(selectedText,font));
        dispatch(selectedItemId(selectedText));
    }

    const initText=()=>{
        const itemSel = textItems.filter(item=>item.id===selectedText);
        return itemSel.map(item=>item.text);
    }

    const changeText=(txt)=>{
        dispatch(updateText(selectedText,txt));
        dispatch(selectedItemId(selectedText));
    }
            
    return(
        <div className="textHeader-container">
        <div className="textHeader-elements">
            <label for="font-family-selector">Επέλεξε Γραμματοσειρά</label>
            <select className="font-family-selector" onChange={(e)=>selFontFamily(e.target.value)} value={initFontFamily()}>
                <option className="arial">Arial</option>
                <option className="Yellowtail">Yellowtail</option>
                <option className="Oswald">Oswald</option>
                <option className="Playfair Display">Playfair Display</option>
                <option className="Orbitron">Orbitron</option>
                <option className="Dancing Script">Dancing Script</option>
                <option className="Aclonica">Aclonica</option>
                <option className="Bonbon">Bonbon</option>
                <option className="Monoton">Monoton</option>
                <option className="Arizonia">Arizonia</option>
                <option className="Aguafina Script">Aguafina Script</option>
                <option className="Akronim">Akronim</option>
                <option className="Alex Brush">Alex Brush</option>
                <option className="Amita">Amita</option>
                <option className="Bungee Shade">Bungee Shade</option>
            </select>
        </div>
        <div className="textHeader-elements">
            <label for="text-edit">Επεξεργασία κειμένου</label>
            <input type="text" className="text-edit" 
            onChange={(e)=>changeText(e.target.value)}
            value={initText()}></input>
        </div>
        <TextColorPicker/>
        </div>
    )
}

export default TextHeader;