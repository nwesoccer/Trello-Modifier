(function() {
    var currentBoardId;
    var oldLocation = location.href;
    var titleReg = /.*\[([0-9]*)\]/;
    var numCardsReg = /([0-9]*) .*/;

    $(document).ready(function() {
        DetectBoard();

        setInterval(function() {
            if(location.href != oldLocation) {
                oldLocation = location.href

                setTimeout(DetectBoard, 1000);
            }
        }, 1000);
    });

    function DetectBoard() {
        var boardId = null;
        var matches = location.pathname.match(/\/b\/(.{8})/);

        if (matches) {
            boardId = matches[1];
        }

        if (boardId && boardId != currentBoardId) {
            currentBoardId = boardId;
            BoardDetected(boardId);
        }
    }

    function BoardDetected(boardId) {
        chrome.extension.sendRequest({ boardId: boardId }, function(response) {

            if (!response || !response.enabled) return;

            var board = response;

            if (board.message) {
                $('div.header-message').remove();

                $('<div>')
                    .addClass('header-message')
                    .css('color', board.messageColor)
                    .html(board.message)
                    .appendTo($('#board-header'));
            }

            if (board.warningColor || board.overageColor) {
                var config = { childList: true, subtree: true };

                var observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        var list = $(mutation.target).closest('div.list');
                        ListChanged(list);
                    });
                });

                $('div.list').each(function() {
                    var list = $(this);
                    var header = list.find('div.list-header');
                    var title = header.find('div.list-title h2');
                    var numCards = header.find('p.num-cards');

                    if (title.length && numCards.length) {
                        observer.observe(title.get(0), config);
                        observer.observe(numCards.get(0), config);

                        ListChanged(list);
                    }
                });
            }

            function ListChanged(list) {
                var header = list.find('div.list-header');
                var title = header.find('div.list-title h2');
                var numCards = header.find('p.num-cards');

                var titleMatches = title.text().match(titleReg);

                if (titleMatches)
                {
                    var numCardsMatches = numCards.text().match(numCardsReg);

                    if(numCardsMatches)
                    {
                        var limit = parseInt(titleMatches[1]);
                        var numCards = parseInt(numCardsMatches[0]);

                        list.removeClass('warning').removeClass('overage');

                        if (board.warningColor && numCards === limit) {
                            list.addClass('warning');
                            ChangeListColor(list, board.warningColor);
                        }
                        else if (board.overageColor && numCards > limit) {
                            list.addClass('overage');
                            ChangeListColor(list, board.overageColor);
                        }
                        else {
                            ChangeListColor(list, '#e3e3e3');
                        }
                    }
                }
            }
        });
    }

    function ChangeListColor(list, color) {
        list.css('background-color', color);

        list.find('div.list-gradient-top')
            .css('background', 'linear-gradient(to bottom, ' + color + ' 0%, rgba(227, 227, 227, 0) 100%)');

        list.find('div.list-gradient-bottom')
            .css('background', 'linear-gradient(to bottom, rgba(227, 227, 227, 0) 0%, ' + color + ' 100%)');
    }
})();