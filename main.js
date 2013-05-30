var BAZ_QUX_URL = 'https://bazqux.com/reader/api/0/unread-count?output=json';
var UPDATE_INTERVAL = 120000; // 2 min interval
var WIDGET_TITLE = 'BazQux Notifier';

/** widget instance.*/
var button;

/**
 * Initializes the widget.
 */
function init() {
  var ToolbarUIItemProperties = {
        disabled: false,
        title: WIDGET_TITLE,
        icon: 'icons/icon-18.png',
        badge: {},
        onclick: function() {
          var tab = getReaderTab();
          if (tab) {
            tab.focus();
          } else {        
            opera.extension.tabs.create({ url: "https://bazqux.com/", focused: true });
          }
        }
  }
	button = opera.contexts.toolbar.createItem(ToolbarUIItemProperties);
	opera.contexts.toolbar.addItem(button);

  opera.extension.onmessage = function(event) {
    var msg = event.data;
    if (msg !== 'init') {
      setUnreadCount(msg);
    } 
  }
  
  window.setInterval(function() {
    if (getReaderTab() == null) {  
      getUnreadCount();
    }
  }, UPDATE_INTERVAL);
  getUnreadCount();
}

/**
 * Updates widget badge with count. If count = 0 badge hide.
 * @param {int} count count to display
 */
function setUnreadCount(count) {
  button.title = WIDGET_TITLE;
  button.badge.color = 'white';
  button.badge.backgroundColor = 'rgba(31, 95, 127, 0.9)';
  button.badge.display = count > 0 ? 'block' : 'none';   
  button.badge.textContent = count < 1000 ? count : '999';
}

/**
 * Displays error icon and error message in badge.
 * 
 * @param {string} msg - error message
 */
function setError(msg) {
  button.title = WIDGET_TITLE + ': ' + msg;
  button.badge.color = 'white';
  button.badge.backgroundColor = 'rgba(255, 58, 75, 0.9)';
  button.badge.display = 'block';   
  button.badge.textContent = ' ! ';
}

/**
 * Gets unread count from RestAPI call.
 */
function getUnreadCount() {
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
    if (tabs[i].url.indexOf("bazqux.com") >= 0) {
      return tabs[i];
    } 
  }
  return null;
}