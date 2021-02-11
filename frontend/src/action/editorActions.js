import { ADD_TEXT, REMOVE_TEXT,UPDATE_TEXT, SELECTED_ITEM, SELECT_FONT_FAMILY, UPDATE_COLOR } from "../constants/editorConstants";

const addText =(txt,count)=>(dispatch)=> {
    dispatch({type: ADD_TEXT, 
                payload : {
                            id:"text"+count,
                            text:txt,
                            fontFamily:txt,
                            fontStyle:"normal",
                            fontSize:55,
                            fill:"#000000"
                        }
                    });
}

const removeText = (id) =>(dispatch)=>{
    dispatch({type:REMOVE_TEXT, payload:id});
}

const updateText =(id,txt)=>(dispatch)=> {
    dispatch({type: UPDATE_TEXT, payload : {id, txt} });
}

const updateColor =(id,col)=>(dispatch)=> {
    dispatch({type: UPDATE_COLOR, payload : {id, col} });
}

const selectedItemId =(id)=> (dispatch) =>{
    dispatch({type: SELECTED_ITEM, payload:id});
}

const selectFontFamily =(id,fontFamily)=>(dispatch)=> {
    dispatch({type: SELECT_FONT_FAMILY, payload : {id, fontFamily} });
}

export {addText, removeText,updateText,selectedItemId,selectFontFamily,updateColor};