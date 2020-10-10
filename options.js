var enabled = null;
var disabled = null;
window.onload = function() {
    enabled = document.querySelector('#enabled');
    disabled = document.querySelector('#disabled');
    var browser = browser || chrome;
    var backgroundPage = browser.extension.getBackgroundPage();
    var status = backgroundPage.getStatus();
    status ? enable() : disable();
    enabled.addEventListener('click', function() {
        backgroundPage.enable();
        enable();
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.reload(tab.id);
        });
    });
    disabled.addEventListener('click', function() {
        backgroundPage.disable();
        disable();
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.reload(tab.id);
        });
    });
};

function enable() {
    enabled.className = 'checked';
    enabled.querySelector('input')
        .checked = true;
    disabled.className = '';
    disabled.querySelector('input')
        .checked = false;
}

function disable() {
    disabled.className = 'checked';
    disabled.querySelector('input')
        .checked = true;
    enabled.className = '';
    enabled.querySelector('input')
        .checked = false;
}
