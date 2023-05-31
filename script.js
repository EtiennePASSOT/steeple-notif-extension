function steeplePageOpened() {
  chrome.tabs.query({ url: "https://www.steeple.fr/*" }, (tabs) => {
    console.log("steeple detected!");
    document.getElementById("pageSteepleActive").innerHTML = "open";
  });
}

steeplePageOpened();
