chrome.contextMenus.create({
    title: "Download Webfont", 
    contexts: ["selection"],
    onclick: performDownload
});

function performDownload(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
            download(response.url);
        });
    });
}

function download(url) {
    chrome.downloads.download({
        url: url,
        conflictAction: 'uniquify'
    });
}