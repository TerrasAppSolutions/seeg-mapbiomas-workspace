'use strict';
/* ----------------------------------------
 *  Auth plugin
 * ----------------------------------------
 */
angular.module('MapBiomas.utils')
    .factory('AppAuth', ['$rootScope', 
        function ($rootScope) {
            var Auth = function () {
                var authUser = angular.fromJson(atob(appvars)).appAuth;
                this.user = authUser;
                $rootScope.appAuthUser = authUser;
                setInterval(function () {
                    if (!authUser) {
                        return;
                    }                    
                }, (60000 * 10));
                this.setUser = function (user) {
                    this.user = user;
                    $rootScope.appAuthUser = user;
                };
            };
            return new Auth();
        }
    ])
    .factory('AppConfig', ['$rootScope',
        function ($rootScope) {
            var config = angular.fromJson(atob(appvars)).appConfig;
            $rootScope.appConfig = config;
            return config;
        }
    ]);