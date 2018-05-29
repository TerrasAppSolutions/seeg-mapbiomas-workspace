'use strict';

angular.module('MapBiomas.services').factory('GEEImageService', ['$http','AppConfig',
    function ($http,AppConfig) {      

      var hostname = "http://" + window.location.hostname + ":8000";

      if(AppConfig.GEE){
          hostname = AppConfig.GEE.servicehost;
      }      

      var serviceUrl = hostname + "/gee/imagens/classificacao/";

      var CartaResultadoService = {
         getResultados: function(postData, callbackSuccess, callbackError){           
           $http.post(serviceUrl, postData).then(callbackSuccess, callbackError);
         }
      };

      return CartaResultadoService;

    }
]);
