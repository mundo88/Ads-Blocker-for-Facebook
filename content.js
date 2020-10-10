(function() {
    let rootEl = null;
    let intervalId = null;
    let prevUrl = null;

    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        }
    }

    const onUrlChange = (cb) => {
      setInterval(() => {
         if(location.href !== prevUrl) {
           prevUrl = location.href;
           cb();
         }
      }, 50);
    }

    const doHack = (feed) => {
        // 1. Find this unique block inside the feed
        const spanWithId = feed.querySelector('span[id]');

        if(!spanWithId) return;

        const spanChildren = spanWithId.children;

        // 2. Check if the second child of spanWithId is not a DIV element
        if(spanChildren && spanChildren.length) {
            if(spanChildren[1]) {
                // if(spanChildren[1].nodeName !== 'SPAN') console.log(spanChildren[1].nodeName);

                return spanChildren[1].nodeName !== 'SPAN';
            }
        }
    }

    const trimAds = () => {
        const feeds = [].slice.call(rootEl.children || []).filter(child => {
            return child.hasAttribute('data-pagelet');
        });
        feeds.forEach((feed, i) => {
            try {
                if(doHack(feed)) {
                    // console.log('killed', feed.querySelector('h4 span'));
                    feed.style.display = "none";
                }
            } catch (e) {}
        });
    }

    const trimAdsForRoot = () => {
        rootEl = null;
        if(intervalId) {
            clearInterval(intervalId);
        }
        intervalId = setInterval(() => {
            if(!rootEl) {
                rootEl = document.querySelector('[role="feed"]');
            } else {
                clearInterval(intervalId);
                trimAds();
            }
        }, 50);
    }

    const runAdsKiller = () => {
        const throttleKill = throttle(trimAdsForRoot, 50);
        trimAdsForRoot();
        window.addEventListener('scroll', trimAdsForRoot);
        window.addEventListener('resize', trimAdsForRoot);
        onUrlChange(trimAdsForRoot);
    }

    const init = () => {
        runAdsKiller();
    }

    init();
})();
const HideAds = () => {
      try {
  const feeds = document.getElementById('contentArea').querySelectorAll('[id*=story]');
  feeds.forEach(feed => {
      if(feed.style.display != "none"){
    try {
            const feedtype = feed
        .querySelector('[data-testid*="story"]')
        .children[0];

                try {
if (feedtype.getAttribute("class").indexOf(" ")!=-1){
          feed.style.display = "none";
        // feed.setAttribute("Hideads", "hiddenfeedtype");
                     }
        } catch (e) {
    }

    try {
     var texthere="";
var alleles = feedtype
.querySelector('[id*="_"]')
        .children[0];
for (var k=0;k<alleles.childElementCount;k++) {
if(getComputedStyle(alleles.children[k].children[0], null).display=="inline"){
texthere=texthere+alleles.children[k].children[0].getAttribute("data-content");
    }}
        if ((texthere.indexOf("Sponsor") != -1) || (texthere.indexOf("مُم") != -1) || (texthere.indexOf("Publicidad") != -1) || (texthere.indexOf("Gesponsert") != -1) || (texthere.indexOf("zato") != -1) || (texthere.indexOf("cinP") != -1) || (texthere.indexOf("Patrocinado") != -1) || (texthere.indexOf("Được tài trợ") != -1) || (texthere.indexOf("Реклама") != -1) || (texthere.indexOf("赞助内容") != -1) || (texthere.indexOf("贊助") != -1) || (texthere.indexOf("Sponsrad") != -1) || (texthere.indexOf("Hirdet") != -1) ) {
          feed.style.display = "none";
         // feed.setAttribute("Hideads", "hiddenfeedtype");
           }
} catch (e) {
    }
        }
    catch (e) {
    }
          }
        try {
          const sponsoredlink = feed
        .querySelector('[class="uiStreamSponsoredLink"]');
      if (sponsoredlink != undefined) {
        feed.style.display = "none";
       // feed.setAttribute("Hideads", "hiddensponsoredlink");
      }
        }
             catch (e) {
    }

  });
     }
    catch (e) {
    }
}
 HideAds()
setTimeout(HideAds, 1000);
(function () {
  window.addEventListener('scroll', () => {
    HideAds()
    setTimeout(HideAds, 1000);
  });


})()
