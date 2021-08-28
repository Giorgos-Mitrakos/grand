import React, { useRef, useEffect } from "react";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const HtmlEditor = props => {

    const handleChange = (content) => {
        // 0console.log(imageList)
        props.onDescriptionChange(content)
        // console.log(content); //Get Content Inside Editor
    }

    return (
        <div>
          <SunEditor 
          lang="en"
          name="my-editor"
          defaultValue={props.descriptionValue}
          width="100%"
          height="50vh"
          placeholder="Please type here..."
          setOptions={{
              height: 200,
              textStyles: [
                  'translucent',
                  'shadow'
              ],
              font: [
                  'Arial',
                  'tohoma',
                  'Courier New,Courier'
              ],
              buttonList: [['undo', 'redo'], ['fontSize', 'formatBlock'],
              ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
              ['align', 'lineHeight', 'list', 'table'],
              ['fontColor', 'hiliteColor', 'outdent', 'indent'],              
              ['link', 'showBlocks']] // Or Array of button list, eg. [['font', 'align'], ['image']]
              // Other option
          }}
          setDefaultStyle="font-family: cursive; font-size: 18px; color:blue;"
          onChange={handleChange}
          />
        </div>
      );
};
export default HtmlEditor;