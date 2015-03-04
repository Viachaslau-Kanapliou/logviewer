var LogViewer = angular.module('LogViewer', [
    'MsgModule','PrettyPrintModule'
]);

LogViewer.controller('VelvetCtrl',
    ['$scope','$http','messageService','$rootScope', function ($scope,$http,messageService,$rootScope) {
    var V_HOST = "V_HOST";
    var D_SERVICE = "D_SERVICE";
    var H_VALUE = "H_VALUE";
    var templeURL = V_HOST+"/"+D_SERVICE+"('"+H_VALUE+"')/OsaRequests?$format=json";

    $scope.velvetHost = "";
    $scope.reqID = "";
    $scope.versions = [
        {code:0, label: 'old', value: 'rsi-v1-debug.svc/ServiceRequests' },
        {code:1, label: 'new', value: 'debug.svc/ServiceRequests' },
        {code:2, label: 'other', value:''}
    ];
    $scope.debugService = $scope.versions[0];
    $scope.username = null;
    $scope.password=null;
    $scope.startBtnLbl = "Go";


    //public
    $scope.getLogs = getLogs;

    function getLogs(){
        var url = templeURL.replace(V_HOST,$scope.velvetHost);
        url = url.replace(D_SERVICE,$scope.debugService.value);
        url = url.replace(H_VALUE,$scope.reqID);

        var authdata = btoa($scope.username + ':' + $scope.password);
        $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
        $http.get(url)
            .success(function(data){
                if (data && data.d && data.d.results && data.d.results.length>0){
                    $scope.startBtnLbl = "Update";
                    var resp = data.d.results[0];
                    var logs = {
                        reqXML:  resp.RequestBody? resp.RequestBody.toString(): null,
                        respXML: resp.ResponseBody? resp.ResponseBody.toString():null
                    };
                    $rootScope.$broadcast('logsLoaded',{
                        logs: logs,
                        url: url
                    });
                } else{
                    messageService.showError("No logs were found in response");
                    $rootScope.$broadcast('noLogsLoaded',{});
                }
            })
            .error(function(){
                messageService.showError("Network or server side error. Please, check configs");
                $rootScope.$broadcast('noLogsLoaded',{});
            });
    }

}]);
