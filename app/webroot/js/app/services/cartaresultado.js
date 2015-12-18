'use strict';

angular.module('MapBiomas.services').factory('CartaResultadoService', ['$http',
    function ($http) {

      var hostname = window.location.hostname;
      var serviceUrl = "http://" + hostname + ":8000/gee/cartas_parametros/";

      var CartaResultadoService = {
         getResultados: function(cartaName, callbackSuccess, callbackError){
           $http.post(serviceUrl, {"carta": cartaName}).then(callbackSuccess, callbackError);
         }
       };

       return CartaResultadoService;
    }
]);
