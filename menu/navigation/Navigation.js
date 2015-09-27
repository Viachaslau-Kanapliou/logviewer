angular.module('LogViewer.Menu.Navigation', [])
/**
 * Listen 'logsLoaded' do 'setOsaCalls'
 */
    .controller('NavigationCtrl', ['$scope', 'messageService', 'logService',
        function ($scope, messageService, logService) {
            $scope.osaCalls = [];
            $scope.activeOsaCall = null;
            $scope.loggerID = null;
            $scope.isCollapsed = true;

            $scope.loggerID = '15092710034991c6c3a060a91646e689fc83d4938ff7bd';

            $scope.getLogs = function () {
                logService.getLogs($scope.loggerID);
            };
            $scope.setActiveOsaCall = function() {
                logService.setActiveOsaCall($scope.activeOsaCall);
            };
            $scope.$on('logsLoaded', function (ev, args) {
                if (args.type == 'success') {
                    $scope.osaCalls = logService.getOsaCalls();
                    $scope.activeOsaCall = logService.getActiveOsaCall();
                } else {
                    $scope.osaCalls = null;
                }
            });
        }]);