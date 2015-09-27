angular.module('LogViewer.Menu.Left', [])
/**
 * Listen 'logsLoaded' do 'set disabled false'
 * Listen 'logsNotLoaded' do 'set disabled true'
 */
    .controller('LeftMenuCtrl', ['$scope', 'logService',
        function ($scope, logService) {
            $scope.formatted = false;
            $scope.disabled = true;
            $scope.toggleFormatted = function() {
                $scope.formatted = ! $scope.formatted;
                logService.setFormatted($scope.formatted);
            };
            $scope.showRequest = function(){
                logService.setDisplayLogs(true, false);
            };
            $scope.showResponse = function(){
                logService.setDisplayLogs(false, true);
            }
            $scope.$on('logsLoaded', function () {
               $scope.disabled = false;
            });
            $scope.$on('logsNotLoaded', function () {
                $scope.disabled = true;
            });

        }]);
