angular.module('LogViewer.LogHistory', [])
    .service('logHistoryService', ['$rootScope',
        function ($rootScope) {
            $rootScope.loggerIDStorage = [];
            var service = {
                addToHistory: addToHistory,
                clearHistory: clearHistory
            };
            function addToHistory(item){
                if (item && $rootScope.loggerIDStorage.indexOf(item) < 0){
                    $rootScope.loggerIDStorage.push(item);
                }
            }
            function clearHistory(){
                $rootScope.loggerIDStorage = [];
            }

            return service
        }]);