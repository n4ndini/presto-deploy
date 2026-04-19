import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ElementType, PresentationType, SlideType } from "../types";
import { getPresentationById } from "./Helpers";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const renderPreviewElement = (el: ElementType) => {
    const commonStyle = {
      position: 'absolute' as const,
      left: `${el.x}%`,
      top: `${el.y}%`,
      width: `${el.width}%`,
      height: `${el.height}%`,
      boxSizing: 'border-box' as const,
      overflow: 'hidden' as const,
      border: 'none',
    };
  
    switch (el.type) {
    case 'text':
      return (
        <div
          key={el.id}
          style={{
            ...commonStyle,
            whiteSpace: 'pre-wrap',
            padding: '4px',
            fontSize: `${el.fontSize}em`,
            color: el.colour,
            fontFamily: el.fontFamily,
          }}
        >
          {el.content}
        </div>
      );
  
    case 'image':
      return (
        <div key={el.id} style={{ ...commonStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={el.url}
            alt={el.alt}
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none', border: 'none' }}
          />
        </div>
      );
  
    case 'video':
      return (
        <div key={el.id} style={commonStyle}>
          <iframe
            src={el.url.replace('watch?v=', 'embed/')}
            style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
            allow="autoplay"
            title={`preview-video-${el.id}`}
          />
        </div>
      );
  
    case 'code':
      return (
        <div key={el.id} style={commonStyle}>
          <SyntaxHighlighter
            language={el.language}
            style={dark}
            wrapLongLines={true}
            customStyle={{
              margin: 0,
              border: 'none',
              background: 'black',
              fontSize: `${el.fontSize}em`,
              height: '100%',
              width: '100%',
              pointerEvents: 'none',
            }}
          >
            {el.code}
          </SyntaxHighlighter>
        </div>
      );
  
    default:
      return null;
    }
};

function PresentationPreview() {


    return (
        <>
        </>
    )
}

export default PresentationPreview;