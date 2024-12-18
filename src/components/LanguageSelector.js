import React from 'react';

const LanguageSelector = ({ mode, onModeChange }) => {
  return (
    <div className="language-mode-toggle">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={mode === 'es-to-en'}
          onChange={() => onModeChange(mode === 'en-to-es' ? 'es-to-en' : 'en-to-es')}
        />
        <span className="toggle-slider"></span>
      </label>
      <span className="toggle-label">
        {mode === 'en-to-es' ? 'English → Spanish' : 'Spanish → English'}
      </span>
    </div>
  );
};

export default LanguageSelector;
