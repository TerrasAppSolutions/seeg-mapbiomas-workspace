'use strict';
/* ----------------------------------------
 *  Auth plugin
 * ----------------------------------------
 */
angular.module('MapBiomas.utils')
    .factory('AppAuth', ['$rootScope',
        function($rootScope) {
            var Auth = function() {
                var authUser = angular.fromJson(atob(appvars)).appAuth;
                this.user = authUser;
                $rootScope.appAuthUser = authUser;
                setInterval(function() {
                    if (!authUser) {
                        return;
                    }
                }, (60000 * 10));
                this.setUser = function(user) {
                    this.user = user;
                    $rootScope.appAuthUser = user;
                };
            };
            return new Auth();
        }
    ])
    .factory('AppConfig', ['$rootScope',
        function($rootScope) {
            var config = angular.fromJson(atob(appvars)).appConfig;
            $rootScope.appConfig = config;
            return config;
        }
    ])
    .factory('Mload', [
        function() {
            var Modal = {
                loaded: [],
                load: function(title, msg, mclass) {

                    if (!mclass) {
                        mclass = 'modal-info';
                    }

                    var dialog = this.dialog({
                        message: msg,
                        title: title,
                        className: mclass,
                        closeButton: true,
                        fade: false
                    });

                    this.loaded.push(dialog);
                },
                hide: function(callback) {
                    angular.forEach(this.loaded, function(value, index) {
                        value.modal('hide');
                    });

                    if(callback){
                        callback();
                    }
                },
                alert: function(title, msg, mclass) {
                    if (!mclass) {
                        mclass = 'modal-info';
                    }
                    var dialog = this.dialog({
                        message: msg,
                        title: title,
                        className: mclass,
                        closeButton: true,
                        fade: true,
                        buttons: {
                            close: {
                                label: "CLOSE",
                                className: "btn-primary"
                            }
                        }
                    });

                    this.loaded.push(dialog);
                },
                modal: function(html) {
                    var dialog = this.alert(html);
                    this.loaded.push(dialog);
                },
                confirms: function(text, callback) {
                    this.confirm(text, callback);
                }
            };
            angular.extend(bootbox, Modal);
            return bootbox;
        }
    ])
    .factory('Notify', [
        function() {

            var opts = {
                position: "top center"
            };

            var Notify = {
                info: function(text, elem) {
                    opts.className = "info";
                    if (elem) {
                        $.notify(elem, text, opts);
                    } else {
                        $.notify(text, opts);
                    }
                },
                success: function(text, elem) {
                    opts.className = "success";
                    if (elem) {
                        $.notify(elem, text, opts);
                    } else {
                        $.notify(text, opts);
                    }
                },
                warning: function(text, elem) {
                    opts.className = "warn";
                    if (elem) {
                        $.notify(elem, text, opts);
                    } else {
                        $.notify(text, opts);
                    }
                },
                error: function(text, elem) {
                    opts.className = "error";
                    if (elem) {
                        $.notify(elem, text, opts);
                    } else {
                        $.notify(text, opts);
                    }
                }
            };
            return Notify;
        }
    ])
    .factory('CacheApp', ['$cacheFactory',
        function($cacheFactory) {
            return $cacheFactory('app');
        }
    ]);;