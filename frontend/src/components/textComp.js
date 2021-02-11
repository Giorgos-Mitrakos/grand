import React, { useRef, useEffect, Fragment } from "react";
import {Text, Transformer } from "react-konva";

function TextComp ( props ){
    const textRef = useRef();
    const trRef = useRef();
  
    useEffect(() => {
      if (props.isSelected) {
        trRef.current.setNode(textRef.current);
        trRef.current.getLayer().batchDraw();
      }
    }, [props.isSelected]);
  
    return (<Fragment>
              <Text
                x={150}
                y={260}
                width={props.width}
                height={props.height}
                onClick={props.onSelect}
                ref={textRef}
                {...props.textProps}
                draggable
                onDragEnd={e => {
                  props.onChange({
                    ...props.textProps,
                    x: e.target.x(),
                    y: e.target.y()
                  });
                }}
                onTransformEnd={e => {
                  const node = textRef.current;
                  const scaleX = node.scaleX();
                  const scaleY = node.scaleY();
        
                  node.scaleX();
                  node.scaleY();
                  props.onChange({
                    ...props.textProps,
                    x: node.x(),
                    y: node.y(),
                    width: Math.max(5, node.width() * scaleX),
                    height: Math.max(node.height() * scaleY),
                    rotation: node.rotation()
                  });
                }}
              />
              {props.isSelected && (
                <Transformer
                  ref={trRef}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 0.5 || newBox.height < 0.5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Fragment>
    );
  }

  export default TextComp;
  
