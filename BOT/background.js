var running = false
var testing = false

chrome.browserAction.onClicked.addListener(function(tab) {
    if(testing) {
        chrome.tabs.sendMessage(tab.id, {type: "test"});
    } else {
        if (running) {
            chrome.tabs.sendMessage(tab.id, {type: "stopBot"});
            running = false
        } else {
            chrome.tabs.sendMessage(tab.id, {type: "startBot"});
            running = true
        }
    }
});
