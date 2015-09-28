angular.module('LogViewer.Menu', [])
/**
 * Listen 'headerSizeChanged' do 'setElHeight'
 */
    .directive('setHeight', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function(scope, el) {
                    var setElHeight = function() {
                        var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                        var contributedHeight = el.prop('offsetTop');
                        el.css('height', screenHeight - contributedHeight + 'px');
                    };
                    scope.$on('headerSizeChanged', setElHeight);
                }

            }
        }]);
