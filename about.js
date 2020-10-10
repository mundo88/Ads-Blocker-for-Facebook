var invertAmount = 0.9;
var isNightModeEnabled = true;

var containerElement = undefined;
window.onload = function(){
    containerElement = document.getElementById("container");
    chrome.storage.sync.get(['setting_isNightModeEnabled','setting_invertAmount'], function(result) {
        if(result.setting_isNightModeEnabled != undefined){
            isNightModeEnabled = result.setting_isNightModeEnabled;
        }
        if(result.setting_invertAmount != undefined){
            invertAmount = result.setting_invertAmount;
        }
        updateExtensionState();
    });
}

function updateExtensionState(){
    if(isNightModeEnabled){
        containerElement.classList.add("night-mode");
    }
    else{
        containerElement.classList.remove("night-mode");
    }
    document.documentElement.style.cssText = "--nightModeAmount:"+invertAmount * 100.0+"%;";
}
