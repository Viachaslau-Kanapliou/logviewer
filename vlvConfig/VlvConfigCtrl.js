angular.module('LogViewer.VlvConfig',[])
    .controller('VlvConfigCtrl',
    ['$scope', '$http', 'messageService', '$rootScope', function ($scope, $http, messageService, $rootScope) {
        var V_HOST = "V_HOST";
        var D_SERVICE = "D_SERVICE";
        var H_VALUE = "H_VALUE";
        var templeURL = V_HOST + "/" + D_SERVICE + "('" + H_VALUE + "')/OsaRequests?$format=json";

        $scope.velvetHost = "";
        $scope.reqID = "";
        $scope.versions = [
            {code: 0, label: 'old', value: 'rsi-v1-debug.svc/ServiceRequests'},
            {code: 1, label: 'new', value: 'debug.svc/ServiceRequests'},
            {code: 2, label: 'other', value: ''}
        ];
        $scope.debugService = $scope.versions[0];
        $scope.username = null;
        $scope.password = null;
        $scope.startBtnLbl = "Go";
        $scope.requestTypes = [];
        $scope.results = [];


        //public
        $scope.getLogs = getLogs;
        $scope.updateLogsType = updateLogsType;

        function getLogs() {
            var url = templeURL.replace(V_HOST, $scope.velvetHost);
            url = url.replace(D_SERVICE, $scope.debugService.value);
            url = url.replace(H_VALUE, $scope.reqID);

            var authdata = btoa($scope.username + ':' + $scope.password);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $http.get(url)
                .success(function (data) {
                    if (data && data.d && data.d.results && data.d.results.length > 0) {
                        $scope.startBtnLbl = "Update";
                        $scope.results = data.d.results;
                        var logs = parseLogs($scope.results[0]);
                        updateLogs(logs, url);
                        $scope.requestTypes = getRequestTypes($scope.results);
                    } else {
                        messageService.showError("No logs were found in response");
                        $rootScope.$broadcast('noLogsLoaded', {});
                    }
                })
                .error(function () {
                    messageService.showError("Network or server side error. Please, check configs");
                    $rootScope.$broadcast('noLogsLoaded', {});
                });
        }
        function updateLogs(logs, url){
            $rootScope.$broadcast('logsLoaded', {
                logs: logs,
                url: url
            });
        }
        function updateLogsType(ind){
            if ($scope.results.length > ind){
                var resp = $scope.results[ind];
                var logs = parseLogs(resp);
                updateLogs(logs)
            }
        }
        function getRequestTypes(results){
            var names = [];
            var req = "";
            var candidates = null;
            for (var i=0; i<results.length; i++){
                req = parseLogs(results[i]).reqXML;
                if (req){
                    candidates = req.match(/<([a-zA-Z]+)/);
                    if (candidates.length>1){
                        names.push(candidates[1]);
                    }
                }
            }
            return names;
        }
        function parseLogs(resp){
            return logs = {
                reqXML: resp.RequestBody ? resp.RequestBody.toString() : null,
                respXML: resp.ResponseBody ? resp.ResponseBody.toString() : null
            };
        }
        function mockData() {
            $scope.username = "wkscvesta1@nj.se";
            $scope.password = "sinlab1";
            $scope.velvetHost = "http://velvet-zeteo3-dev.cloudapp.net";
            $scope.reqID = "150525113649890cf241b45b284f63bf642301c0881f8c";
            $scope.debugService = $scope.versions[1];
        }

        mockData();
    }]);
