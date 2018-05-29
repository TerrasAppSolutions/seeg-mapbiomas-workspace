/**
 * Service de comunicação google earth engine
 * @argument func getElevation
 */

'use strict';

angular.module('MapBiomas.services').factory('LeafletCustomService', [
    function () {

        var dom = {};

        var markerMap = {};

        var LeafletCustomService = {
            /**
             * Configura nome e posição do DomUtil
             */
            setDomUtil: function (name, position) {
                dom[name] = L.control({
                    position: position
                });
            },
            /**
             * Obtém o DomUtil
             */
            getDomUtil: function (name) {
                return dom[name];
            },
            /**
             * Remove dom util
             */
            removeDomUtil: function (name, map) {
                if (this.getDomUtil(name)) {
                    this.getDomUtil(name).removeFrom(map);
                    // destroi o objeto
                    delete dom[name];
                }
            },
            /**
             * Cria um novo domUtil
             * recebe objeto no formato:
             * * @name: nome do módulo;
             * * @position: posição do módulo;
             * * @className: nome das classes utilizadas
             * * @dom: html do dom exibido
             * * @map: mapa que será adicionado o módulo
             */
            createDomUtil: function (obj) {
                this.setDomUtil(obj.name, obj.position)
                // adiciona valor de elevação em um caixa de fundo branco                    
                this.getDomUtil(obj.name).onAdd = function (map) {

                    var div = L.DomUtil.create('div', obj.className);

                    div.innerHTML = obj.dom;

                    return div;
                };

                this.getDomUtil(obj.name).addTo(obj.map);
            },
            setCustomMarker: function (name, className, latlng) {
                // adiciona marcador do ponto clicado
                var crossIcon = L.divIcon({
                    className: className
                });
                
                markerMap[name] = L.marker([latlng.lat, latlng.lng], {
                    icon: crossIcon
                });                
            },
            getCustomMarker: function (name) {
                return markerMap[name];
            },
            removeCustomMarker: function (name, map) {               
                if (this.getCustomMarker(name)) {
                    map.removeLayer(this.getCustomMarker(name));
                    // destroi o objeto
                    delete markerMap[name];
                }
            },
            /**
             * Cria um marcador customizado
             * Recebe objeto no formato:
             * * @name: nome do módulo;
             * * @className: nome das classes utilizadas
             * * @map: mapa que será adicionado o módulo
             * * @latlng: valores de latitude e longitude
             */
            createCustomMarker: function (obj) {

                this.setCustomMarker(obj.name, obj.className, obj.latlng)

                this.getCustomMarker(obj.name).addTo(obj.map);
            }
        };

        return LeafletCustomService;

    }
]);