angular.module('LogViewer.Fancylog', [])
/**
 * listen 'settingsUpdated' do 'showLogs'
 * listen 'logsLoaded' do 'showLogs'
 */
    .controller('FancylogCtrl', ['$scope', 'logService',
        function ($scope, logService) {
            $scope.isFormatted = logService.isFormatted();
            $scope.logs = null;

            $scope.showLogs = function showLogs() {
                $scope.isFormatted = logService.isFormatted();
                $scope.logs = logService.getActiveLogs();
            };

            $scope.$on('settingsUpdated', function (event, arg) {
                $scope.showLogs();
            });
            $scope.$on('logsLoaded', function (event, arg) {
                $scope.showLogs();
            });
        }])
/**
 * throw 'logsLoaded' event {type='success' || 'error', msg : 'String'}
 * throw 'settingsUpdated' event {}
 */
    .service('logService', ['$http', 'vlvConfigService', '$rootScope',
        function ($http, vlvConfigService, $rootScope) {
            var formatted = false;
            var activeOsaCall = null;
            var osaCalls = null;
            var isRequest = true;
            var isResponse = false;
            var logs = null;

            var service = {
                getLogs: getLogs,
                getActiveLogs: getActiveLogs,
                getOsaCalls: getOsaCalls,
                getActiveOsaCall: getActiveOsaCall,
                setActiveOsaCall: setActiveOsaCall,
                isFormatted: isFormatted,
                setFormatted: setFormatted,
                setDisplayLogs: setDisplayLogs
            };

            function getLogs(loggerID) {
                var url = vlvConfigService.getDebugURL(loggerID);
                var authdata = vlvConfigService.getBasicToken();
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'Basic ' + authdata
                    }
                })
                    .success(function (logsObj) {
                        if (logsObj && logsObj.d && logsObj.d.results && logsObj.d.results.length > 0) {
                            logs = logsObj.d.results;
                            osaCalls = findOsaCalls();
                            activeOsaCall = osaCalls[0];
                            $rootScope.$broadcast('logsLoaded', {type: 'success'});
                        } else {
                            $rootScope.$broadcast('logsLoaded', {type: 'error', msg: 'No logs founds'});
                        }
                    })
                    .error(function () {
                        $rootScope.$broadcast('logsLoaded', {type: 'error', msg: 'Connection issue'});
                    })
            }

            function getActiveLogs() {
                var index = osaCalls.indexOf(activeOsaCall);
                var singleLog = parseLogs(logs[index]);
                if (isRequest && isResponse) {
                    return singleLog
                } else if (isRequest) {
                    return singleLog.reqXML
                } else if (isResponse) {
                    return singleLog.respXML
                }
                return null;
            }

            function getOsaCalls() {
                return osaCalls;
            }

            function findOsaCalls() {
                var names = [];
                var req = "";
                var candidates = null;
                for (var i = 0; i < logs.length; i++) {
                    req = parseLogs(logs[i]).reqXML;
                    if (req) {
                        candidates = req.match(/<([a-zA-Z]+)/);
                        if (candidates.length > 1) {
                            names.push(candidates[1]);
                        }
                    }
                }
                return names;
            }

            function parseLogs(resp) {
                return {
                    reqXML: resp.RequestBody ? resp.RequestBody.toString() : null,
                    respXML: resp.ResponseBody ? resp.ResponseBody.toString() : null
                };
            }

            function getActiveOsaCall() {
                return activeOsaCall;
            }

            function setActiveOsaCall(osaCall) {
                activeOsaCall = osaCall;
                $rootScope.$broadcast('settingsUpdated');
            }

            function setFormatted(isFormatted) {
                formatted = isFormatted;
                $rootScope.$broadcast('settingsUpdated');
            }

            function isFormatted() {
                return formatted;
            }

            function setDisplayLogs(isReqVisible, isRespVisible) {
                isRequest = isReqVisible;
                isResponse = isRespVisible;
                $rootScope.$broadcast('settingsUpdated');
            }

            return service;
        }
    ])
    .directive('prettyprint', [
        function () {
            function printLogs(isFormatted, logs, element) {
                //string expected
                if (""+isFormatted == "true") {
                    var el = angular.element("<div>").text(logs);
                    element.html(prettyPrintOne(el.html()));
                } else {
                    element.text(logs);
                }
            }

            return {
                scope: {
                    format: '@',
                    logs: '@'
                },
                restrict: 'C',
                link: function (scope, element, attrs) {
                    printLogs(scope.format, scope.logs, element);

                    scope.$watch('format', function (newValue) {
                        printLogs(newValue, attrs.logs, element)
                    });
                    scope.$watch('logs', function (newValue) {
                        printLogs(attrs.format, newValue, element)
                    });
                }
            }
        }
    ]);
