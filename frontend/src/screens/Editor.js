import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import useImage from 'use-image';
import './Editor.css';
import { useSelector } from 'react-redux';
import TextComp from '../components/textComp';
import { selectedItemId } from '../action/editorActions';
import { useDispatch } from 'react-redux';

function Editor() {

    const textEditor = useSelector(state => state.textEditor);
    const { textItems, selectedText } = textEditor;
    const [texts, setTexts] = useState(textItems);
    const [selectedId, selectText] = useState(null);
    const [phoneImage] = useImage("/images/diy-case-i11.png");

    const dispatch = useDispatch();

    const checkDeselect = e => {
        // deselect when clicked on empty area
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectText(null);
        }
    };

    useEffect(() => {
        dispatch(selectedItemId(selectedId));
    }, [selectedId, dispatch]);

    return (
        <Stage className="editor-stage"
            width={800}
            height={500}
            onMouseDown={checkDeselect}
            onTouchStart={checkDeselect}
        >
            <Layer>
                <Image
                    x={50}
                    y={50}
                    width={350}
                    height={450}
                    image={phoneImage}></Image>
                {textItems.map((textItem, i) => (
                    <TextComp
                        key={i}
                        textProps={textItem}
                        isSelected={textItem.id === selectedText}
                        onSelect={() => {
                            selectText(textItem.id);
                        }}
                        onChange={newAttrs => {
                            const textIt = texts.slice();
                            textIt[i] = newAttrs;
                            setTexts(textIt);
                        }}>
                    </TextComp>
                ))
                }
            </Layer>
        </Stage>
    )
}

export default Editor;