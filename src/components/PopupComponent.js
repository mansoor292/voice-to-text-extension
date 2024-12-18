import React, { useState, useEffect } from 'react';
import RecordButton from './RecordButton';
import TextOutput from './TextOutput';
import LanguageSelector from './LanguageSelector';
import TranscribeToggle from './TranscribeToggle';
import { startRecognition, stopRecognition, setRecognitionLanguage } from '../services/speechRecognition';
import { insertText } from '../services/textInsertion';
import { translate } from '../services/translationService';

const PopupComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState('');
  const [mode, setMode] = useState('en-to-es'); // 'en-to-es' or 'es-to-en'
  const [isTranslating, setIsTranslating] = useState(false);
  const [previewText, setPreviewText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [isTranscribeMode, setIsTranscribeMode] = useState(false);
  const [lastTranscribedText, setLastTranscribedText] = useState('');

  const getSourceLanguage = () => mode === 'en-to-es' ? 'en-US' : 'es-ES';
  const getTargetLanguage = () => mode === 'en-to-es' ? 'es-ES' : 'en-US';

  useEffect(() => {
    // Get selected text when popup opens
    const getSelectedText = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) return;

        const [{result}] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const selection = window.getSelection();
            return selection ? selection.toString() : '';
          }
        });

        if (result) {
          setText(result);
          setPreviewText(result);
        }
      } catch (error) {
        console.error('Error getting selected text:', error);
      }
    };

    getSelectedText();
  }, []);

  const handleTranscribe = async (transcribedText) => {
    try {
      // Prevent duplicate translations
      if (transcribedText === lastTranscribedText) {
        return;
      }
      setLastTranscribedText(transcribedText);

      // In transcribe mode, automatically translate based on the current mode
      const translatedText = await translate(
        transcribedText, 
        getSourceLanguage(), 
        getTargetLanguage()
      );
      await insertText(translatedText);
    } catch (error) {
      console.error('Error in transcribe mode:', error);
      setError('Please select a text input field in the target tab for transcription.');
      stopRecognition();
      setIsRecording(false);
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      stopRecognition();
      setIsRecording(false);
      setError('');
      setLastTranscribedText('');
    } else {
      try {
        await startRecognition(
          (result) => {
            // Only update text if it's not an error message
            if (!result.startsWith('Error:') && !result.startsWith('Please')) {
              setText(result);
              setPreviewText(result);
              setError('');
            } else {
              setError(result);
              setIsRecording(false);
            }
          },
          getSourceLanguage(),
          isTranscribeMode ? handleTranscribe : null
        );
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        setIsRecording(false);
        if (!error.message.startsWith('Error:') && !error.message.startsWith('Please')) {
          setError('Failed to start recording. Please try again.');
        }
      }
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (isRecording) {
      stopRecognition();
      setIsRecording(false);
      setLastTranscribedText('');
    }
    // Clear existing translations when mode changes
    setTranslatedText('');
    setPreviewText(text);
    setError('');
  };

  const handleTranscribeModeToggle = () => {
    if (isRecording) {
      stopRecognition();
      setIsRecording(false);
    }
    setIsTranscribeMode(!isTranscribeMode);
    setLastTranscribedText('');
    setError('');
  };

  const handleTranslate = async (targetLanguage) => {
    setError('');
    setIsTranslating(true);
    
    try {
      const translatedText = await translate(text, getSourceLanguage(), targetLanguage);
      setPreviewText(translatedText);
      setTranslatedText(translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setError('Translation failed. Please try again.');
      setPreviewText('');
      setTranslatedText('');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleInsert = async (textToInsert) => {
    try {
      await insertText(textToInsert);
      // Clear text after successful insertion
      setText('');
      setPreviewText('');
      setTranslatedText('');
    } catch (error) {
      console.error('Insertion error:', error);
      setError('Please select a text input field in the target tab before inserting.');
    }
  };

  return (
    <div className="popup-container">
      <h1>Voice to Text</h1>
      <LanguageSelector 
        mode={mode}
        onModeChange={handleModeChange}
      />
      <TranscribeToggle 
        isTranscribeMode={isTranscribeMode}
        onToggle={handleTranscribeModeToggle}
      />
      <RecordButton 
        isRecording={isRecording} 
        onToggle={handleRecordToggle}
        disabled={!!error && error.includes('microphone')} 
      />
      {!isTranscribeMode && (
        <TextOutput 
          text={text} 
          onTranslate={handleTranslate}
          onInsert={handleInsert}
          isTranslating={isTranslating}
          previewText={previewText}
          translatedText={translatedText}
          error={error}
          mode={mode}
        />
      )}
      {isTranscribeMode && error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
};

export default PopupComponent;
