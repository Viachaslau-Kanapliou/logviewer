angular.module('LogViewer.Menu.Navigation', [])
    .controller('NavigationCtrl', ['$scope',
        function ($scope) {
            $scope.isCollapsed = true;
        }]);