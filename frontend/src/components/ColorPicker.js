import React, { useState, useEffect } from 'react';
import {ChromePicker } from 'react-color';
import { useSelector, useDispatch } from 'react-redux';
import './ColorPicker.css';
import { updateColor, selectedItemId } from '../action/editorActions';

function TextColorPicker(){

    const [displayColorPicker, setDisplayColorPicker]= useState(false);
    const [changeColor, setChangeColor]= useState();
    const [color, setColor]= useState({r:"0",g:"9",b:"153", a:"1"});

    const textEditor= useSelector(state=>state.textEditor);
    const {selectedText,textItems}= textEditor;
    const dispatch= useDispatch();

    
        
    const onHandleShowColorPicker= ()=>{
        setDisplayColorPicker(true);
    }

    const onHandleCloseColorPicker= ()=>{
        setDisplayColorPicker(false);
    }

    const onChangeColorPicker= (color)=>{
        
        setColor(color.rgb);
        setChangeColor(color.hex);
        dispatch(updateColor(selectedText,color.hex));
        dispatch(selectedItemId(selectedText));       
    }

    useEffect(() => {
        const initFontFamily=()=>{
            const itemSel = textItems.filter(item=>item.id===selectedText);
            setColor( itemSel.map(item=>item.fill.rgb));
            setChangeColor( itemSel.map(item=>item.fill));
        }

        initFontFamily();        
    }, [selectedText,textItems]);

   
    return(
        <div className="color-picker-container">
            <label>Επέλέξε χρώμα</label>
            <div className="label"></div>
            <input
            readOnly
            type="text"
            className="color-picker-text" 
            name="color-picker-text"
            onClick={onHandleShowColorPicker}
            value={changeColor}
            ></input>        
            {displayColorPicker && (
                <div className="color-picker-palette">
                    <div className="color-picker-cover"
                        onClick={onHandleCloseColorPicker}>
                    </div>                        
                    <ChromePicker 
                    color={color}
                    onChange={onChangeColorPicker}
                    />
                </div>)
            }
        </div>
    )

}

export default TextColorPicker;