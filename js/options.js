function OptionsController($scope) {

    var defaultBoard = { id: '', description: '', enabled: true, overageColor: '#BF3030', warningColor: '#E6BF00', messageColor: '#E6BF00', message: '' };

    $scope.boards = JSON.parse(localStorage.getItem("boards")) || [];
    $scope.saveButton = { text: 'Save', disabled: '' };

    $scope.newBoard = $.extend({ }, defaultBoard);

    $scope.save = function() {
        OnSaving();

        if ($scope.newBoard.id.length > 0) {
            $scope.boards.push($scope.newBoard);
            $scope.newBoard = $.extend({ }, defaultBoard);
        }

        SaveToLocalStorage();
        OnSaved();
    }

    $scope.remove = function(boardId) {
        if (boardId) {
            OnSaving();

            var i = $scope.boards.length;

            while (i--) {
                if ($scope.boards[i].id === boardId) {
                    $scope.boards.splice(i, 1);
                    break;
                }
            }

            SaveToLocalStorage();
            OnSaved();
        }
    }

    $scope.add = function() {
        if ($scope.newBoard.id.length > 0) {
            OnSaving();

            $scope.boards.push($scope.newBoard);
            $scope.newBoard = $.extend({ }, defaultBoard);

            SaveToLocalStorage();
            OnSaved();
        }
    }

    function OnSaving() {
        $scope.saveButton.text = 'Saving...';
        $scope.saveButton.disabled = 'disabled';
    }

    function OnSaved() {
        setTimeout(function() {
            $scope.$apply(function() {
                $scope.saveButton.text = 'Save';
                $scope.saveButton.disabled = '';
            });
        }, 500);
    }

    function SaveToLocalStorage() {
        localStorage.setItem("boards", JSON.stringify($scope.boards));
    }

    $(window).bind('keydown', function(event) {
        if (event.which == 83 && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();

            $scope.$apply(function() {
                $scope.save();
            });
        }
    });
}