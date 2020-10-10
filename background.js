chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "https://www.facebook.com/ooedin.oo"}, function (tab) {
        console.log("");
    });
});