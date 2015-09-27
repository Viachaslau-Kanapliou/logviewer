angular.module('LogViewer.Notification', [])
.controller('NotificationCtrl', ['$scope','$timeout', function ($scope,$timeout) {
    $scope.lastErrorMessage = null;
    $scope.isErrorActive = false;

    $scope.$on('sendMessage',function(event, arg){
        $scope.lastErrorMessage = arg.msg;
        $scope.isErrorActive = true;
        $timeout(function(){
            $scope.isErrorActive = false;
        },2000);
    });
}])

.service('messageService',['$rootScope',function($rootScope){
    //public interface
    var service = {
        showError    : showError
    };

    function showError(msg){
        sendMessage(msg);
    }
    //util
    function sendMessage(msg){
        $rootScope.$broadcast('sendMessage',{
            msg: msg
        });
    }
    return service;
}]);


