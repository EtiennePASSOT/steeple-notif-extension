const alreadyStart = [];

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (alreadyStart.includes(details.url)) return;

    alreadyStart.push(details.url);

    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      args: [details.url],
      func: injected,
    });
  },
  {
    urls: [
      "wss://api.steeple.fr/*",
      "wss://api.steeple-dev.fr/*",
      "wss://api.steeple-recette.fr/*",
    ],
  }
);

function injected(url) {
  const mySocket = new WebSocket(url);

  if (Notification.permission === "default") {
    Notification.requestPermission().then(function (result) {
      console.log(result);
    });
  }

  mySocket.addEventListener("open", (event) => {
    mySocket.send(
      JSON.stringify({
        command: "subscribe",
        identifier: '{"channel":"V2::AppearanceChannel"}',
      })
    );
  });

  mySocket.addEventListener("message", (e) => {
    const data = JSON.parse(e.data);

    if (data.message.event === "newMessage") {
      new Notification("Nouveau message Steeple");
    } else if (data.message.event === "newPost") {
      new Notification("Nouvelle publication Steeple");
    }
  });
}
