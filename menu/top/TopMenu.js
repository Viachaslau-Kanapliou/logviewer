angular.module('LogViewer.Menu.Top', [])
/**
 * throw 'headerSizeChanged' ev = {}
 */
.controller('TopMenuCtrl', ['$scope', '$rootScope', '$timeout',
    function ($scope, $rootScope, $timeout) {
        $scope.isCollapsed = true;

        $scope.toggleCollapsed = function() {
            $scope.isCollapsed = !$scope.isCollapsed;
            $timeout(function(){
                $rootScope.$broadcast('headerSizeChanged');
            },300,false);

        }
}]);