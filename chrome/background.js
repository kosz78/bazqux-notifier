var BAZ_QUX_URL = 'https://bazqux.com/reader/api/0/unread-count?output=json';
var UPDATE_INTERVAL = 2.0; // 2 min interval
var WIDGET_TITLE = 'BazQux Notifier';

chrome.runtime.onInstalled.addListener(init);

/**
 * Initializes the widget.
 */
function init() {
  console.log('init');
  chrome.browserAction.onClicked.addListener(function(atab) {
      chrome.tabs.query({url: "https://bazqux.com/*"}, function(tabs) {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, {url: "https://bazqux.com/", active: true, highlighted: true});
        } else {
          chrome.tabs.create({url: "https://bazqux.com/"});
        }
      });
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (sender.id === chrome.runtime.id) {
        setUnreadCount(request.count);
      }
    }
  );

  chrome.alarms.onAlarm.addListener(function(alarm) {
    console.log('check count');
    chrome.tabs.query({url: "https://bazqux.com/*"}, function(tabs) {
        if (tabs.length == 0) {
          getUnreadCount();
        }
    });
  });

  chrome.alarms.create('refresh', {periodInMinutes: UPDATE_INTERVAL});
  getUnreadCount();
}

/**
 * Updates widget badge with count. If count = 0 badge hide.
 * @param {int} count count to display
 */
function setUnreadCount(count) {
  chrome.browserAction.setTitle({title: WIDGET_TITLE});
  chrome.browserAction.setBadgeBackgroundColor({color: [31, 95, 127, 200]});
  var txt = String(count > 0 ? (count < 1000 ? count : '999') : '');
  chrome.browserAction.setBadgeText({text: txt});
}

/**
 * Displays error icon and error message in badge.
 *
 * @param {string} msg - error message
 */
function setError(msg) {
  chrome.browserAction.setTitle({title: WIDGET_TITLE + ': ' + msg});
  chrome.browserAction.setBadgeBackgroundColor({color: [255, 58, 75, 200]});
  chrome.browserAction.setBadgeText({text: ' ! '});
}

/**
 * Gets unread count from RestAPI call.
 */
function getUnreadCount() {
  console.log('getUnreadCount');
  var xhr = new XMLHttpRequest ();
  xhr.onreadystatechange = function () {
    if ( this.readyState == 4 ) {
      switch ( this.status ) {
        case 200:
          var json = JSON.parse(xhr.responseText);
          setUnreadCount(json.unreadcounts[0] != null ? json.unreadcounts[0].count : 0);
          break;
        case 401: // Unauthorized
          setError(this.statusText);
          break;
      }
    }
  }
  xhr.open('GET', BAZ_QUX_URL, false );
  xhr.send();
}

/**
 * @returns reader tab or null if tab was not found
 */
function getReaderTab() {
  var tabs = opera.extension.tabs.getAll();
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].url.indexOf("https://bazqux.com") >= 0) {
      return tabs[i];
    }
  }
  return null;
}