var audio = null, timer = null, timer_running = false, volume = 0.6 /*0..1*/, delay = 17750, stop_time = parseInt(storage["stop_time"] || 0);

set_button();

function start_timer() {
    if (timer_running) return;
    stop_time = parseInt(storage["stop_time"] || 0);
    if (stop_time - 1000 > now()) {
        timer_running = true;
        set_badge("", "#318730");
        update_badge(min_left());
        timer = setInterval(tick, 1000);
    } else {
        stop_timer();
    }
}

function stop_timer() {
    clearInterval(timer);
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    stop_time = storage["stop_time"] = 0;
    hide_badge();
    timer_running = false;
}

function now() {
    return Date.now();
}

function min_left() {
    return Math.round((stop_time - now()) / 60000);
}

message_listener(function(command) {
        if (command == "START") start_timer();
        else if (command == "STOP") stop_timer();
});

function tick() {
    if (stop_time == 0 || (now() > 1000 + delay + stop_time)) {
        stop_timer();
    } else if (stop_time > now()) {
        update_badge(min_left());
    } else if (now() - stop_time <= 1000) {
        set_badge("\u266A", "#DB2C19");
        clearInterval(timer);
        if (audio) {
            audio.volume = volume;
            audio.play();
        }
        setTimeout(stop_timer, delay);
    }
}

window.addEventListener("load", function() {
    audio = document.querySelector("audio"); 
    start_timer();
}, false);