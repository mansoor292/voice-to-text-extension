import React from 'react';

const TextOutput = ({ 
  text, 
  onTranslate, 
  onInsert, 
  isTranslating, 
  previewText, 
  error,
  translatedText,
  mode 
}) => {
  const getTranslateButtonText = () => {
    if (isTranslating) return 'Translating...';
    return mode === 'en-to-es' ? 'Translate to Spanish' : 'Translate to English';
  };

  return (
    <div className="text-output">
      <textarea
        className="text-area"
        value={text}
        readOnly
        placeholder="Your speech will appear here..."
      />
      <div className="action-buttons">
        <button
          className="translate-button"
          onClick={() => onTranslate(mode === 'en-to-es' ? 'es-ES' : 'en-US')}
          disabled={!text || isTranslating}
        >
          {getTranslateButtonText()}
        </button>
        {translatedText && (
          <div className="insert-buttons">
            <button
              className="insert-button"
              onClick={() => onInsert(translatedText)}
              disabled={isTranslating}
            >
              Insert Text
            </button>
            <button
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(translatedText)}
              disabled={isTranslating}
            >
              Copy to Clipboard
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {previewText && (
        <div className="preview-text">
          <div className="preview-label">Translation:</div>
          <div className="preview-content">{previewText}</div>
        </div>
      )}
    </div>
  );
};

export default TextOutput;
