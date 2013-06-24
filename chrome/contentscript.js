/**
 * Registers unread checker on document load.
 */
window.setInterval(bazQuxNotifierListener, 1000); // check each second


/**
 * Checks unread count from JS object and send message to widget. 
 */
function bazQuxNotifierListener() {
  var el = document.getElementById("uc0");
  if (el) {
    chrome.runtime.sendMessage({count: el.innerText});
  }  
}
