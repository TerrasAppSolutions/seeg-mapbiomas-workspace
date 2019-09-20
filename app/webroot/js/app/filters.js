'use strict';
/* Filters */
angular.module('MapBiomas.filters')
    .filter('numberFixTo', [function() {
        return function(value) {
            return new Number(value).toFixed(2);
        };
    }])
    .filter('formatDate', [function() {
        return function(value) {
            return moment(value).format('DD/MM/YYYY');
        };
    }])
    .filter('formatDatehms', [function() {
        return function(value) {
            return moment(value).format('DD/MM/YYYY h:mm:ss');
        };
    }])
    .filter('areaclasse', ['DtreeClasses', function(DtreeClasses) {
        return function(value) {
            var areaclasse = _.findWhere(DtreeClasses.getClasses(), {
                id: value
            });
            return areaclasse.classe;
        };
    }])
    .filter('dtreevstr', [function() {
        return function(value) {
            
            var dtreevstr = JSON.stringify(value);

            return dtreevstr.replace(/[\"\{\}]/g,'').replace(/\,/g,' / ');
        };
    }])
    .filter('renderSymbol', [function () {
        return function (val) {
            // código para separação de string
            var name_arr = val.split("%%%***$$$####");
            if (name_arr[0] == "true") {
                val = "&#10003; " + name_arr[1];
            } else {
                val = name_arr[1];
            }
            var symbol = document.createElement('div');
            symbol.innerHTML = val;
            return symbol.childNodes[0].nodeValue;
        }
    }])
    .filter('areaclassecolor', ['DtreeClasses', function(DtreeClasses) {
        return function(value) {            
            var color = "#000000";
            if (value) {
                var areaclasse = _.findWhere(DtreeClasses.getClasses(), {
                    id: parseInt(value)
                });
                color = areaclasse.color;
            }
            return color;
        };
    }]);