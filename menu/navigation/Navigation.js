angular.module('LogViewer.Menu.Navigation', [])
/**
 * Listen 'logsLoaded' do 'setOsaCalls'
 * Listen 'logsNotLoaded' do 'clean'
 * throw 'headerSizeChanged' ev = {}
 */
    .controller('NavigationCtrl', ['$scope', 'logService', '$rootScope', 'logHistoryService',
        function ($scope, logService, $rootScope, logHistoryService) {
            $scope.osaCalls = [];
            $scope.activeOsaCall = null;
            $scope.loggerID = null;
            $scope.isCollapsed = true;


            $scope.clear = function(){
                logHistoryService.clearHistory();
            };
            $scope.getLogs = function (loggerID) {
                if (loggerID) {
                    $scope.loggerID = loggerID;
                }
                logService.getLogs($scope.loggerID);
                logHistoryService.addToHistory($scope.loggerID);
                $rootScope.$broadcast('headerSizeChanged');
            };
            $scope.setActiveOsaCall = function() {
                logService.setActiveOsaCall($scope.activeOsaCall);
            };
            $scope.$on('logsLoaded', function () {
                    $scope.osaCalls = logService.getOsaCalls();
                    $scope.activeOsaCall = logService.getActiveOsaCall();
            });

            $scope.$on('logsNotLoaded', function () {
                $scope.osaCalls = [];
                $scope.activeOsaCall = null;
            });
        }]);