'use strict';

angular.module('MapBiomas.services').factory('GeeImageService', ['$http','AppConfig',
    function ($http,AppConfig) {      

      var hostname = "http://" + window.location.hostname + ":8001";

      if(AppConfig.GEE){
          //hostname = AppConfig.GEE.servicehost;
      }      

      var serviceUrl = hostname + "/gee/imagens/dtreerecursive/";

      var CartaResultadoService = {
         getResultados: function(postData, callbackSuccess, callbackError){           
           $http.post(serviceUrl, postData).then(callbackSuccess, callbackError);
         }
      };

      return CartaResultadoService;

    }
]);
