'use strict';

angular.module('MapBiomas.services').factory('GEEImageService', ['$http',
    function ($http) {

      var hostname = window.location.hostname;
      var serviceUrl = "http://" + hostname + ":8000/gee/imagens/classificacao/";

      var CartaResultadoService = {
         getResultados: function(postData, callbackSuccess, callbackError){
           console.log(postData);
           $http.post(serviceUrl, postData).then(callbackSuccess, callbackError);

         }
       };

       return CartaResultadoService;

    }
]);
