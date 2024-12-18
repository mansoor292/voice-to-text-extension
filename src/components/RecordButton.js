import React from 'react';

const RecordButton = ({ isRecording, onToggle, disabled }) => {
  return (
    <button 
      className={`record-button ${isRecording ? 'recording' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onToggle}
      disabled={disabled}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
    </button>
  );
};

export default RecordButton;
