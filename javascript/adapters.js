var storage = typeof window.opera === "object" ? widget.preferences : localStorage;
var button = null, set_badge, update_badge, set_button, message_listener;

if (typeof browser === 'undefined' && typeof chrome !== 'undefined') browser = chrome;
if (typeof window.opera === "object") { // Opera 1X
    set_button = function(){
        var itemProperties = {
            disabled: false,
            title: "Simplest Timer",
            icon: "images/timer-19.png",
            popup: {
                href: "popup.html",
                width: "330px",
                height: "35px",
            },
            badge: {
                textContent: "0",
                backgroundColor: "#318730",
                color: "#FFFFFF",
                display: "none",
            }
        };

        button = opera.contexts.toolbar.createItem(itemProperties);
        opera.contexts.toolbar.addItem(button);
    }
    update_badge = function (mleft) {
        button.badge.textContent = (mleft >= 1 ? (mleft > 99 ? "99+" : mleft) : "<1");
    };
    hide_badge =function () {
        button.badge.display='none';
    };
    set_badge =function (text, color) {
        button.badge.display='block';
        button.badge.textContent = text;
        button.badge.backgroundColor = color;
    };
    message_listener = function (callback) {
        opera.extension.onmessage = function(event) { callback(event.data); }
    };
} else { // Firefox 46+, Chrome 40+, Opera 30+
    set_button = function(){};
    update_badge = function (mleft) {
        browser.browserAction.setBadgeText({text: (mleft >= 1 ? (mleft > 99 ? "99+" : mleft) : "<1").toString()});
    };
    hide_badge =function (color) {
        browser.browserAction.setBadgeText({text: ''});
        if (color) browser.browserAction.setBadgeBackgroundColor({color: color});
    };
    set_badge = function (text, color) {
        browser.browserAction.setBadgeBackgroundColor({color: color});
        browser.browserAction.setBadgeText({text: text});
    };
    message_listener = function (callback) {
        browser.runtime.onMessage.addListener(callback);
    };
}
