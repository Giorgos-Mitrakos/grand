import React from 'react';
import './MakeyourcaseLayout.css';
import ToolPanel from '../components/ToolPanel.js';
import Editor from '../screens/Editor.js';
import TextHeader from '../components/TextHeader';
import { useSelector } from 'react-redux';

function MakeyourcaseLayout (){
    const textEditor= useSelector(state=>state.textEditor);
    const {selectedText}= textEditor;

    return (
        <div className="make-case-layout-container">
            <div className="side-tools">
                <ToolPanel></ToolPanel>
            </div>            
            <main className="make-case-main-container">
                <header className="make-case-header-container">
                    {selectedText && <TextHeader></TextHeader>}
                </header>                
                <div className="Editor">
                    <Editor/>
                </div>
            </main>            
        </div>
    )
}

export default MakeyourcaseLayout;