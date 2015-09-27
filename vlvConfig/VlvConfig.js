angular.module('LogViewer.VlvConfig', [])
    .controller('VlvConfigCtrl', ['$scope', 'localStorageService', 'lodash',
        function ($scope,  localStorageService, lodash) {
            $scope.velvetHost;
            $scope.debugService;
            $scope.username;
            $scope.password;

            $scope.versions = [
                {code: 0, label: 'old', value: 'rsi-v1-debug.svc/ServiceRequests'},
                {code: 1, label: 'new', value: 'debug.svc/ServiceRequests'},
                {code: 2, label: 'other', value: ''}
            ];

            var code = localStorageService.get('debugService').code;
            var index = lodash.find($scope.versions, {code: code});
            localStorageService.bind($scope, 'debugService');
            $scope.debugService =  index;

            localStorageService.bind($scope, 'velvetHost');
            localStorageService.bind($scope, 'username');
            localStorageService.bind($scope, 'password');



        }])
    .service('vlvConfigService',['localStorageService',
        function(localStorageService){
            var service = {
                getDebugURL: getDebugURL,
                getBasicToken: getBasicToken
            };

            var V_HOST = "V_HOST";
            var D_SERVICE = "D_SERVICE";
            var H_VALUE = "H_VALUE";
            var templeURL = V_HOST + "/" + D_SERVICE + "('" + H_VALUE + "')/OsaRequests?$format=json";

            function getDebugURL(loggerID){
                var url = templeURL.replace(V_HOST, localStorageService.get('velvetHost'));
                url = url.replace(D_SERVICE, localStorageService.get('debugService').value);
                url = url.replace(H_VALUE, loggerID);
                return url;
            }

            function getBasicToken(){
                return btoa(localStorageService.get('username') + ':' + localStorageService.get('password'))
            }
            return service;
        }
    ]);
