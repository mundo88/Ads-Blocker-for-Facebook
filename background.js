var useragent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36"; // Chrome
var enabled = true;
var invertAmount = 0.9;
var isNightModeEnabled = true;
var excludedWebsites = {};
var matchRegExp = RegExp("(https?://)|(file://)|(ftp://)");
var domainRegexStr = "(\\w+)?\\.\\w+.\\w+(?=\\/)";
var chromeUrlRegExp = RegExp("chrome://");

function syncSettings(callback) {
    chrome.storage.sync.get(['setting_isNightModeEnabled', 'setting_invertAmount', 'setting_excludedWebsites'], function(result) {
        if (result.setting_isNightModeEnabled != undefined) {
            isNightModeEnabled = result.setting_isNightModeEnabled;
        }
        if (result.setting_invertAmount != undefined) {
            invertAmount = result.setting_invertAmount;
        }
        if (result.setting_excludedWebsites != undefined) {
            excludedWebsites = result.setting_excludedWebsites;
        }
        callback();
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    syncSettings(function() {
        updateNightMode(tab);
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    syncSettings(function() {
        chrome.tabs.get(activeInfo.tabId, function(tab) {
            updateNightMode(tab);
        });
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    syncSettings(function() {
        if (request.setting_isNightModeEnabled != undefined) {
            isNightModeEnabled = request.setting_isNightModeEnabled;
            chrome.storage.sync.set({
                setting_isNightModeEnabled: isNightModeEnabled
            });
        }
        if (request.setting_invertAmount != undefined) {
            invertAmount = request.setting_invertAmount;
            chrome.storage.sync.set({
                setting_invertAmount: invertAmount
            });
        }
        if (request.setting_newExcludedWebsite != undefined) {
            excludedWebsites[request.setting_newExcludedWebsite.website] = request.setting_newExcludedWebsite.isExcluded ? true : undefined;
            chrome.storage.sync.set({
                setting_excludedWebsites: excludedWebsites
            });
        }
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function(tabs) {
            updateNightMode(tabs[0]);
        });
    });
});

function updateNightMode(tab) {

    if (!matchRegExp.test(tab.url)) {
        return;
    }
    var domainRegex = RegExp(domainRegexStr, 'g');
    var execArr = domainRegex.exec(tab.url);
    var domain = execArr[0];
    var isWebsiteExcluded = excludedWebsites[domain] ? true : false;

    if (isNightModeEnabled && !isWebsiteExcluded) {
        chrome.tabs.executeScript(tab.id, {
            //file: "/content.css"
            code: 'document.documentElement.classList.add("night-mode");' +
                'document.documentElement.style.cssText = ' +
                'document.documentElement.style.cssText.split("--nightModeAmount")[0] + "--nightModeAmount:' + invertAmount * 100.0 + '%;"',
            runAt: "document_start"
        });
    } else {
        chrome.tabs.executeScript(tab.id, {
            //file: "/content.css"
            code: 'document.documentElement.classList.remove("night-mode");',
            runAt: "document_start"
        });
    }


}

function rewriteUserAgentHeader(o) {
  for (var header of o.requestHeaders) {
    if (enabled && header.name.toLowerCase() === "user-agent") {
      header.value = useragent;
    }
  }
  return {
    "requestHeaders": o.requestHeaders
  };
}
chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: ["*://*.facebook.com/*"]},
  ["blocking", "requestHeaders"]
);
function getStatus() {
  return enabled;
}
function enable() {
  enabled = true;
}
function disable() {
  enabled = false;
}
chrome.runtime.onInstalled.addListener(function (object) {
    chrome.tabs.create({url: "https://sites.google.com/view/old-facebook/home"}, function (tab) {
        console.log("");
    });
});
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab) {
        if (info.menuItemId === "context1"){
            var code = "location.reload()";
            chrome.tabs.executeScript(tab.id, { code: code });
            enabled = true;
            return enabled;

        }
        if (info.menuItemId === "context2"){
            var code = "location.reload()";
            chrome.tabs.executeScript(tab.id, { code: code });
            enabled = false;
            return enabled;
         }          
        if (info.menuItemId === "context3"){
            var code = window.open("https://www.facebook.com/ooedin.oo/", "_blank");            
         }
    }
});
function getStatus() {
  return enabled;
}
function enable() {
  enabled = true;
}
function disable() {
  enabled = false;
}

chrome.contextMenus.create({
    id: "context1",
    title: "Giao diện cũ", type:"radio",
    contexts: ["all"]
});

chrome.contextMenus.create({
    id: "context2",
    title: "Giao diện mới", type:"radio",
    contexts: ["all"]

});
chrome.contextMenus.create({
    id: "context3",
    title: "Follow Me ❤", 
    contexts: ["all"]

});


