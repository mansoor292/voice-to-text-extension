const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error('Speech recognition not supported in this browser');
}

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

let onResultCallback = null;
let onTranscribeCallback = null;
let isInitialized = false;
let currentText = '';
let lastFinalText = '';

export const startRecognition = async (callback, language = 'en-US', transcribeCallback = null) => {
  try {
    recognition.lang = language;
    onResultCallback = callback;
    onTranscribeCallback = transcribeCallback;
    currentText = '';
    lastFinalText = '';
    
    if (!isInitialized) {
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const transcript = result[0].transcript.trim();
            // Only process if this is new text
            if (transcript !== lastFinalText) {
              finalTranscript = transcript;
              lastFinalText = transcript;
              currentText = transcript;
              
              // If in transcribe mode, send only the new final transcript
              if (onTranscribeCallback && finalTranscript) {
                onTranscribeCallback(finalTranscript);
              }
            }
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        // For normal mode, update the display with current text
        if (finalTranscript && onResultCallback) {
          onResultCallback(currentText);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          if (onResultCallback) {
            onResultCallback('Error: Microphone access was denied. Please allow microphone access and try again.');
          }
        }
      };

      recognition.onend = () => {
        // Only restart if we're supposed to be recording
        if (onResultCallback || onTranscribeCallback) {
          try {
            recognition.start();
          } catch (error) {
            console.error('Error restarting recognition:', error);
          }
        }
      };

      isInitialized = true;
    }

    recognition.start();
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    if (error.name === 'NotAllowedError') {
      if (onResultCallback) {
        onResultCallback('Please allow microphone access when prompted and try again.');
      }
    } else {
      if (onResultCallback) {
        onResultCallback('Error: ' + error.message);
      }
    }
    throw error;
  }
};

export const setRecognitionLanguage = (language) => {
  recognition.lang = language;
};

export const stopRecognition = () => {
  try {
    recognition.stop();
    onResultCallback = null;
    onTranscribeCallback = null;
    currentText = '';
    lastFinalText = '';
  } catch (error) {
    console.error('Error stopping speech recognition:', error);
  }
};

export default {
  startRecognition,
  stopRecognition,
  setRecognitionLanguage
};
