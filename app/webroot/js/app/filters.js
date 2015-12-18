'use strict';
/* Filters */
angular.module('MapBiomas.filters')
    .filter('numberFixTo', [function () {
        return function (value) {
            return new Number(value).toFixed(2);
        };
    }])
    .filter('formatDate', [function () {
        return function (value) {
            return moment(value).format('DD/MM/YYYY');
        };
    }]);