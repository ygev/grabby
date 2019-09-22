var clickedEl = null;
// console.log("Hej!");
document.addEventListener("mousedown", function(event){
    // right click
    if (event.button == 2) { 
        clickedEl = event.target;
        // console.log(getComputedStyle(clickedEl).getPropertyValue("font-family"));
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
        //   console.log("caught DOM Exception")
      } else {
          throw e;
      }
    }
}

// prints out all the 'url' values in fontCssRules
for (i in fontCssRules) {
    //var str = fontCssRules[i].cssText.substring(fontCssRules[i].cssText.lastIndexOf("url") + 5, fontCssRules[i].cssText.lastIndexOf(".woff")+ 5 )
    var str = fontCssRules[i].cssText;
    var strArr = str.split(';');
    strArr = strArr.map(s => s.trim());
    var urlStr = strArr.find(function(element) {
        return element.startsWith('src: url(')
    });
    var urlArr = findUrl(urlStr);
    var bestType = findBestType(urlArr);
    // console.log(fontCssRules[i].href)
    // console.log(bestType);
    var prettyURL = urlSurgery(fontCssRules[i].href, bestType)
    console.log(prettyURL);
}

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