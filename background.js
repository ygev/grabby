chrome.contextMenus.create({
    title: "Download Webfont", 
    contexts: ["selection"],
    id: 'download-webfont',
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId == 'download-webfont') {
        performDownload();
    }
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