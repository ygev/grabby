var clickedEl = null;
console.log("Hej!");
document.addEventListener("mousedown", function(event){
    // right click
    if (event.button == 2) { 
        clickedEl = event.target;
        console.log(getComputedStyle(clickedEl).getPropertyValue("font-family"));
    }
}, true);