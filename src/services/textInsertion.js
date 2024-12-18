export const insertText = async (text) => {
  try {
    // First try to copy to clipboard
    await navigator.clipboard.writeText(text);
    
    // Then try to insert into active element
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
      throw new Error('No active tab found');
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        const activeElement = document.activeElement;
        if (activeElement.isContentEditable || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.tagName === 'INPUT') {
          const start = activeElement.selectionStart;
          const end = activeElement.selectionEnd;
          const value = activeElement.value || activeElement.textContent;
          const before = value.substring(0, start);
          const after = value.substring(end);
          const newValue = before + text + after;
          
          if (activeElement.isContentEditable) {
            activeElement.textContent = newValue;
          } else {
            activeElement.value = newValue;
            // Trigger input event for React and other frameworks
            const event = new Event('input', { bubbles: true });
            activeElement.dispatchEvent(event);
          }

          // Set cursor position after inserted text
          const newPosition = start + text.length;
          if (!activeElement.isContentEditable) {
            activeElement.setSelectionRange(newPosition, newPosition);
          }
        }
      },
      args: [text]
    });
  } catch (error) {
    console.error('Error inserting text:', error);
    // If tab insertion fails, at least the text is in clipboard
    if (!error.message.includes('clipboard')) {
      throw error;
    }
  }
};

export default {
  insertText
};
