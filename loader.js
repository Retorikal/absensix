var s = document.createElement('script');
s.src = chrome.extension.getURL('absen_utils.js');
(document.head||document.documentElement).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s); // Remove from page after all necessary stuff are loaded
};