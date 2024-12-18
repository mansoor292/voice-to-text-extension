let popupWindow = null;

chrome.action.onClicked.addListener(() => {
  if (popupWindow) {
    // Focus existing window
    chrome.windows.update(popupWindow.id, { focused: true });
  } else {
    // Create new window
    chrome.windows.create({
      url: 'popup.html',
      type: 'popup',
      width: 340,
      height: 600,
      focused: true
    }, (window) => {
      popupWindow = window;
    });
  }
});

// Track window state
chrome.windows.onRemoved.addListener((windowId) => {
  if (popupWindow && popupWindow.id === windowId) {
    popupWindow = null;
  }
});

// Keep the background script alive
chrome.runtime.onConnect.addListener(function(port) {
  port.onDisconnect.addListener(function() {
    // Connection closed
  });
});
