chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.boardId)
    {
        var boards = JSON.parse(localStorage.getItem("boards")) || [];

        var i = boards.length;

        while (i--) {
            if (boards[i].id === request.boardId) {
                sendResponse(boards[i]);
                break;
            }
        }

        sendResponse(null);
    }
});

chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
        url: "options.html"
    });
});