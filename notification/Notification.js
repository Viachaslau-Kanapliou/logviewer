angular.module('LogViewer.Notification', [])
    .controller('NotificationCtrl', ['$scope', '$timeout',
        function ($scope, $timeout) {
            var msgTypes = [
                'success',
                'info',
                'warning',
                'danger'
            ];
            $scope.message = null;
            $scope.visibility = false;
            $scope.msgType = msgTypes[0];
            $scope.timeout = 1000;


            $scope.$on('logsNotLoaded', function (event, arg) {
                processAlert(event,arg);
            });
            $scope.$on('commonAlert', function (event, arg) {
                processAlert(event,arg);
            });

            function processAlert(event, arg){
                $scope.message = arg.msg;
                $scope.msgType = setType(arg.msgType);
                $scope.visibility = true;
                $timeout(function () {
                    $scope.visibility = false;
                    $scope.message = null;
                }, $scope.timeout);
            }
            function setType(msgType) {
                if (msgType && msgTypes.indexOf(msgType) > -1) {
                    return msgType;
                }
                return msgTypes[0];
            }
        }]);


