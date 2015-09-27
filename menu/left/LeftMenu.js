angular.module('LogViewer.Menu.Left', [])
    .controller('LeftMenuCtrl', ['$scope', 'logService',
        function ($scope, logService) {
            $scope.formatted = false;
            $scope.toggleFormatted = function() {
                logService.setFormatted($scope.formatted);
                $scope.formatted = ! $scope.formatted;
            };
            $scope.showRequest = function(){
                logService.setDisplayLogs(true, false);
            };
            $scope.showResponse = function(){
                logService.setDisplayLogs(false, true);
            }
        }]);
