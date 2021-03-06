angular.module('LogViewer', [
    'ngAnimate',
    'ui.bootstrap',
    'LocalStorageModule',
    'ngLodash',
    'LogViewer.Fancylog',
    'LogViewer.Menu',
    'LogViewer.Menu.Left',
    'LogViewer.Menu.Navigation',
    'LogViewer.Menu.Top',
    'LogViewer.Notification',
    'LogViewer.VlvConfig',
    'LogViewer.LogHistory'
])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('LogViewer');
    });