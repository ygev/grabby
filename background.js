function getword(info,tab) {
  console.log("Word " + info.selectionText + " was clicked.");
}
chrome.contextMenus.create({
  title: "You've selected %s", 
  contexts:["selection"], 
  onclick: getword
});