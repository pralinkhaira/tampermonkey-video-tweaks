// ==UserScript==
// @name         Auto refresh, popup, volume - final (criccoder264)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Reloads page if video stops playing for too long
// @match        *://criccoder264.pages.dev/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

window.alert = function () { console.log("📛 Popup blocked (alert)"); return; };
window.confirm = function () { console.log("📛 Popup blocked (confirm)"); return false; };
window.prompt = function () { console.log("📛 Popup blocked (prompt)"); return null; };
alert("⚠️ Custom Popups are now disabled!");

const maxTries = 20;
let attempts = 0;

function monitorVideo() {
    const video = document.querySelector("video");
    if (!video) {
        if (attempts < maxTries) {
            attempts++;
            setTimeout(monitorVideo, 1000);
        } else {
            console.log("❌ Video not found");
        }
        return;
    }

    console.log("✅ Monitoring video...");
    video.muted = false;
    video.volume = 1.0;
    alert("🔊 Video unmuted and volume set to 100%");
    video.autoplay = true;
    video.play().catch(() => {});

    let lastTime = video.currentTime;
    let stalledCounter = 0;

    setInterval(() => {
        if (video.paused || video.currentTime === lastTime) {
            stalledCounter++;
            console.log(`⚠️ Video not playing... (${stalledCounter}s)`);
        } else {
            stalledCounter = 0;
        }
        lastTime = video.currentTime;
        if (stalledCounter >= 5) {
            console.log("🔁 Reloading page due to stalled video...");
            location.reload();
        }
    }, 1000);
}

window.addEventListener("load", monitorVideo);
