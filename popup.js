var invertAmount = 0.9;
var isNightModeEnabled = true;
var excludedWebsites = {};

var enableBtnElement = undefined;
var containerElement = undefined;
var invertAmountSliderElement = undefined;
var excludeWebsiteBtnElement = undefined;
var isWebsiteExcluded = false;

var currentTab = undefined;

var domainRegexStr = "(\\w+)?\\.\\w+.\\w+(?=\\/)";

chrome.tabs.query({
    currentWindow: true,
    active: true
}, function(tabs) {
    currentTab = tabs[0];
});

window.onload = function() {
    enableBtnElement = document.getElementById("night-mode-enable");
    enableBtnElement.addEventListener("click", onEnableBtnClick);
    excludeWebsiteBtnElement = document.getElementById("night-mode-exclude");
    excludeWebsiteBtnElement.addEventListener("click", onExcludeWebsiteBtnClick);
    containerElement = document.getElementById("container");
    invertAmountSliderElement = document.getElementById("night-mode-invertAmount");
    invertAmountSliderElement.addEventListener("change", onInvertAmountSliderChange);
    chrome.storage.sync.get(['setting_isNightModeEnabled', 'setting_invertAmount', 'setting_excludedWebsites'], function(result) {
        console.log(result);
        if (result.setting_isNightModeEnabled != undefined) {
            isNightModeEnabled = result.setting_isNightModeEnabled;
        }
        if (result.setting_invertAmount != undefined) {
            invertAmount = result.setting_invertAmount;
        }
        if (result.setting_excludedWebsites != undefined) {
            excludedWebsites = result.setting_excludedWebsites;
            var domainRegex = RegExp(domainRegexStr, 'g');
            var execArr = domainRegex.exec(currentTab.url);
            var domain = execArr[0];
            if (excludedWebsites[domain]) {
                isWebsiteExcluded = true;
            }
        }
        updateExtensionState();

    });
}

function updateExtensionState() {
    if (isNightModeEnabled) {
        enableBtnElement.classList.add("on");
    } else {
        enableBtnElement.classList.remove("on");
    }
    invertAmountSliderElement.value = invertAmount;
    document.documentElement.style.cssText = "--nightModeAmount:" + invertAmount * 100.0 + "%;";
    if (isWebsiteExcluded) {
        excludeWebsiteBtnElement.classList.add("on");
    } else {
        excludeWebsiteBtnElement.classList.remove("on");
    }
    if (isNightModeEnabled) {
        containerElement.classList.add("night-mode");
    } else {
        containerElement.classList.remove("night-mode");
    }
}

function onEnableBtnClick(mouseEvent) {
    isNightModeEnabled = !isNightModeEnabled;
    updateExtensionState();
    sendEnableToBackground(isNightModeEnabled);
}

function onInvertAmountSliderChange(sliderEvent) {
    invertAmount = sliderEvent.target.value;
    updateExtensionState();
    sendInvertAmountToBackground(invertAmount);
}

function onExcludeWebsiteBtnClick(mouseEvent) {
    var domainRegex = RegExp(domainRegexStr, 'g');
    var execArr = domainRegex.exec(currentTab.url);
    var domain = execArr[0];
    isWebsiteExcluded = !isWebsiteExcluded;
    excludedWebsites[domain] = isWebsiteExcluded ? true : undefined;
    updateExtensionState();
    sendExcludeWebsiteToBackground(domain, isWebsiteExcluded);

}

function sendEnableToBackground(newEnabled) {
    chrome.runtime.sendMessage({
        setting_isNightModeEnabled: newEnabled
    });
}

function sendInvertAmountToBackground(newInvertAmount) {
    chrome.runtime.sendMessage({
        setting_invertAmount: newInvertAmount
    });
}

function sendExcludeWebsiteToBackground(newExcludedWebsite, newIsExcluded) {
    chrome.runtime.sendMessage({
        setting_newExcludedWebsite: {
            website: newExcludedWebsite,
            isExcluded: newIsExcluded
        }
    });
}