// ==UserScript==
// @include https://bazqux.com/*
// ==/UserScript==

/**
 * Registers unread checker on document load.
 */
window.addEventListener('DOMContentLoaded', function() {
  opera.extension.postMessage('init');
  window.setInterval(bazQuxNotifierListener, 1000); // check each second
}, false);

/**
 * Checks unread count from JS object and send message to widget. 
 */
function bazQuxNotifierListener() {
  if (window.subItems && window.subItems[0]) {
    var c = window.subItems[0]._Counters.data;
    opera.extension.postMessage(c._TotalPosts - c._ReadPosts);
  }  
}
