import React from 'react';

const TranscribeToggle = ({ isTranscribeMode, onToggle }) => {
  return (
    <div className="transcribe-toggle">
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={isTranscribeMode}
          onChange={onToggle}
        />
        <span className="toggle-slider"></span>
      </label>
      <span className="toggle-label">
        Transcribe Mode {isTranscribeMode ? 'On' : 'Off'}
      </span>
    </div>
  );
};

export default TranscribeToggle;
