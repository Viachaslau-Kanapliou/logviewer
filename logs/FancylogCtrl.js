angular.module('LogViewer.Fancylog', [])
.controller('FancylogCtrl', ['$scope','$window',function ($scope,$window) {
    $scope.LOG_TYPE=["req","resp","full"];
    $scope.logs = null;
    $scope.url = null;
    $scope.logType=$scope.LOG_TYPE[0];
    $scope.isFormatted = false;
    $scope.result = null;

    $scope.$on('noLogsLoaded',function(event, arg){
        clearLogs();
        showLogs();
    });
    $scope.$on('logsLoaded',function(event, arg){
        $scope.logs = arg.logs;

        //do not change url if it's empty - switch request type case
        if (arg.url){
            $scope.url = arg.url;
        }
        showLogs();
    });

    $scope.clearLogs = clearLogs;
    $scope.showLogs = showLogs;

    function clearLogs(){
        $scope.logs.reqXML="";
        $scope.logs.respXML="";
        $scope.result="";
    }

    function showLogs(){
        if ($scope.LOG_TYPE[0]==$scope.logType){
            $scope.result = $scope.logs.reqXML;
            _jqManageText($scope.isFormatted,$scope.result);
        } else if ($scope.LOG_TYPE[1]==$scope.logType){
            $scope.result = $scope.logs.respXML;
            _jqManageText($scope.isFormatted,$scope.result);
        } else {
            $scope.result = "";
            _jqManageFullLog($scope.url);
        };

    }

    /* jQuery block due to issue with prettyPrint\Angular.
     * Content of the result block is not controlled by Angular
     */
    function _jqManageFullLog(url){
        var target = $(".result pre");
        if (url) {
            var a = $("<a>", {'href': url, 'target': '_blank'});
            a.text("Open link in new tab");
            target.html(a);
        }else{
            target.html("");
        }

    }
    function _jqManageText(isFormatted, text){
        var target = $(".result pre");
        if (text) {
            target.text(text);
            if (isFormatted) {
                target.removeClass("prettyprinted");
                window.prettyPrint();
            }
        }else{
            target.html("");
        }
    }
}]);