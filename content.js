chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Sending response to background.js:" + typeface2URL[computedStyle]);
    sendResponse({url: typeface2URL[computedStyle]}); 
});

var typeface2URL = {};

var computedStyle = null;
document.addEventListener("mousedown", function(event){
    // right click
    if (event.button == 2) { 
        var clickedEl = event.target;
        computedStyle = getComputedStyle(clickedEl).getPropertyValue("font-family");
        if (computedStyle.indexOf(",") != -1) {
            computedStyle = computedStyle.substring(0, computedStyle.indexOf(","));
        }
        // console.log(computedStyle);
    }
}, true);

// finds all CSS font rules on this page
var fontCssRules = []
for (i in document.styleSheets) {
    try {
        for (j in document.styleSheets[i].cssRules) {
            if (document.styleSheets[i].cssRules[j].constructor.name == "CSSFontFaceRule") {
                fontCssRules.push({
                        "href": document.styleSheets[i].href,
                        "cssText": document.styleSheets[i].cssRules[j].cssText
                    })
            }
        }
    } catch(e) {
      if (e instanceof DOMException){
      } else {
          throw e;
      }
    }
}

// create a mapping between all the font faces and their download URLs
for (i in fontCssRules) {
    var cssFont = fontCssRules[i].cssText;
    var cssFontSplit = cssFont.split(';');

    var rawFontFamily = cssFontSplit.find(function(element){
        return element.includes('font-family')
    });
    var fontFamily = findFontName(rawFontFamily);
    
    cssFontSplit = cssFontSplit.map(s => s.trim());
    var rawURL = cssFontSplit.find(function(element) {
        return element.startsWith('src: url(')
    });
    var urlArr = findUrl(rawURL);
    var bestType = findBestType(urlArr);
    var prettyURL = urlSurgery(fontCssRules[i].href, bestType)

    // connection.postMessage(prettyURL);

    typeface2URL[fontFamily] = prettyURL;    
}

// console.log(typeface2URL);

function findUrl(urlInput) {
    var urlOutput = [];
    var end = 0;
    while (true){
        var start = urlInput.indexOf("url", end);
        if(start == -1) {
            return urlOutput;
        }
        end = urlInput.indexOf(")", start);
        urlOutput.push(urlInput.substring(start + 5, end - 1));
    }
}

function findFontName(fontInput){
    var fontOutput;
    var start = fontInput.indexOf("font-family:");
    var end = fontInput.length;
    fontOutput = fontInput.substring(start + 13, end);
    return fontOutput;
}

// Find Best File Format for Downloaded Font (TTF/OTF if exists > Webfont)
function findBestType(){
    var ttf = urlArr.find(function(element){
        return element.includes('.ttf')
    });

    var otf = urlArr.find(function(element){
        return element.includes('.otf')
    });

    var woff = urlArr.find(function(element){
        return element.includes('.woff')
    });

    var woff2 = urlArr.find(function(element){
        return element.includes('.woff2')
    });

    var eot = urlArr.find(function(element){
        return element.includes('.eot')
    });

    if(typeof ttf !== "undefined"){
        return ttf;
    }
    if(typeof otf !== "undefined"){
        return otf;
    }
    if(typeof woff !== "undefined"){
        return woff;
    }
    if(typeof woff2 !== "undefined"){
        return woff2;
    }
    if(typeof eot !== "undefined"){
        return eot;
    }
    return null;
}

function urlSurgery(urlCss, urlType) {
    if(urlType.startsWith("/")){
        var urlComplete = document.URL + urlType;
        return urlComplete;
    } else {
        var slashPos = urlCss.lastIndexOf("/");
        urlCss = urlCss.substring(0, slashPos);
        var urlComplete = urlCss + "/" + urlType;
        return urlComplete;
    }
}