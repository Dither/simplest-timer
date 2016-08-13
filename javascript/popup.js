// adapters
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') browser = chrome;
var delay = 19000;
var storage = typeof window.opera === "object" ? widget.preferences : localStorage;
var send_message = function (message) {
    typeof window.opera === "object" ? opera.extension.postMessage(message) : browser.runtime.sendMessage(message);
}

//main
var timer_running = false;
window.addEventListener("load",
    function() {
        var form = document.forms[0].elements,
            minutes = form["minutes"],
            seconds = form["seconds"],
            button = form["button"];

        if (!!storage["minutes"] && !isNaN(parseInt(storage["minutes"], 10))) {
            minutes.value = parseInt(storage["minutes"], 10);
        } else {
            minutes.value = 8;
            storage["minutes"] = 8;
        }
        if (!!storage["seconds"] && !isNaN(parseInt(storage["seconds"], 10)) && parseInt(storage["seconds"], 10) < 60) {
            seconds.value = parseInt(storage["seconds"], 10);
        } else {
            seconds.value = 0;
            storage["seconds"] = 0;
        }

        timer_running = ((parseInt(storage["stop_time"], 10) || 0) + delay > Date.now());
        if (timer_running) {
            minutes.disabled = true;
            seconds.disabled = true;
            button.value = "Stop";
        } else {
            minutes.disabled = false;
            seconds.disabled = false;
            button.value = "Start";
            minutes.focus();
            minutes.select();
        }
        document.forms[0].addEventListener("submit", onFormSubmit, false);
    }, false
);

function onFormSubmit(event) {
    var form = document.forms[0].elements,
        minutes = form["minutes"],
        seconds = form["seconds"],
        message = "STOP",
        mvalue = parseInt(minutes.value, 10),
        svalue = parseInt(seconds.value, 10);

    minutes.style.borderColor = "#72a4f3";
    seconds.style.borderColor = "#72a4f3";

    if (isNaN(mvalue) || isNaN(svalue)) {
        if (isNaN(mvalue)) {
            minutes.style.borderColor = "#ff5512";
        }
        if (isNaN(svalue)) {
            seconds.style.borderColor = "#ff5512";
        }
        event.preventDefault();
    } else {
        if ( mvalue === 0 && svalue < 10) return;
        storage["minutes"] = mvalue;
        storage["seconds"] = svalue;

        if (!timer_running) {
            storage["stop_time"] = Date.now() + mvalue * 60000 + svalue * 1000;
            message = "START";
            window.close();
        } else {
            storage["stop_time"] = 0;
        }

        send_message(message);
    }
}
