'use strict';

angular.module('MapBiomas.services').factory('GeeImageService', ['$http', 'AppConfig',
    function($http, AppConfig) {
        var CartaResultadoService = {
            getResultados: function(postData, callbackSuccess, callbackError,
                callbackPermissionError, allvars) {

                setTimeout(function() {
                    try {
                        geeImageProcess(postData, callbackSuccess, allvars);
                    } catch (err) {

                        var isError404 = err.toString().search(
                            'HTTP code: 404') >= 0 ? true : false;

                        if (isError404) {
                            ee.data.authenticateViaPopup(
                                function() {
                                    geeImageProcess(postData,
                                        callbackSuccess, allvars);
                                },
                                function() {
                                    callbackPermissionError();
                                }
                            );
                        } else {
                            console.log(err);
                            callbackError(err);
                        }
                    }
                }, 1000);
            }
        };

        var geeImageProcess = function(postData, callbackSuccess, allvars) {  

            // força converção dos valores da decisiontree para inteiro
            var nodes = Object.keys(postData.DecisionTree.dtree);
            nodes.forEach(function(node, index) {
                var dtreeNode = postData.DecisionTree.dtree[node];
                if(dtreeNode.kind == "decision"){
                    postData.DecisionTree.dtree[node].rule.thresh = parseInt(dtreeNode.rule.thresh);
                }
            });                        

            var _allvars = allvars ? allvars : false;

            var mbs = new MapbiomasService(postData.Classificacao, postData.DecisionTree
                .dtree, false, _allvars);
            // get mapids
            var mapids = mbs.getMapIds();

            callbackSuccess({
                data: mapids
            });
        };

        return CartaResultadoService;

    }
]);