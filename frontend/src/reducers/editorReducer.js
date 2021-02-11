import { ADD_TEXT, REMOVE_TEXT,UPDATE_TEXT, SELECTED_ITEM, SELECT_FONT_FAMILY, UPDATE_COLOR } from "../constants/editorConstants.js";


function textReducer(state={textItems:[], selectedText: [null], textCount:0},action){
    switch(action.type){
        case ADD_TEXT:
            return {...state,textItems:[...state.textItems, action.payload],
                            textCount:state.textCount+1 }
        case REMOVE_TEXT:
            return{
                textItems: state.textItems.filter(x=>x.id!== action.payload)
            }
        case UPDATE_TEXT:
            // This returns a new array instead of mutating the old one
            return {...state,textItems: state.textItems.map(textItem => {
                if (textItem.id === action.payload.id) {
                    textItem.text = action.payload.txt;
                }
                return textItem;
            })};
        case UPDATE_COLOR:
            // This returns a new array instead of mutating the old one
            return {...state,textItems: state.textItems.map(textItem => {
                if (textItem.id === action.payload.id) {
                    textItem.fill = action.payload.col;
                }
                return textItem;
            })};
        case SELECTED_ITEM:
            return{
                ...state, selectedText: action.payload
            }
        case SELECT_FONT_FAMILY:
            // This returns a new array instead of mutating the old one
            return {...state,textItems: state.textItems.map(textItem => {
                if (textItem.id === action.payload.id) {
                    textItem.fontFamily = action.payload.fontFamily;
                }
                return textItem;
            })};
            
        default:
            return state;
    }

}

export {textReducer};