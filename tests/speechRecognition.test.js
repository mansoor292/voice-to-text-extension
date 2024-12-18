import { startRecognition, stopRecognition } from '../src/services/speechRecognition';

describe('Speech Recognition', () => {
  let recognition;

  beforeEach(() => {
    global.SpeechRecognition = jest.fn().mockImplementation(() => ({
      start: jest.fn(),
      stop: jest.fn(),
      addEventListener: jest.fn(),
    }));
    recognition = new global.SpeechRecognition();
  });

  test('startRecognition should start speech recognition', () => {
    startRecognition();
    expect(recognition.start).toHaveBeenCalled();
  });

  test('stopRecognition should stop speech recognition', () => {
    stopRecognition();
    expect(recognition.stop).toHaveBeenCalled();
  });

  test('recognition should add result event listener', () => {
    startRecognition();
    expect(recognition.addEventListener).toHaveBeenCalledWith('result', expect.any(Function));
  });

  test('recognition should add error event listener', () => {
    startRecognition();
    expect(recognition.addEventListener).toHaveBeenCalledWith('error', expect.any(Function));
  });
});