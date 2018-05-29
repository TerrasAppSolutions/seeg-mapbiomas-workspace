L.Control.InspectPixel = L.Control.extend({
    options: {
        position: 'bottomleft',
    },
    initialize: function(options) {
        var _this = this;
        L.setOptions(this, options);
    },
    /**
     * Adiciona o controle no mapa
     */
    onAdd: function() {

        var _this = this;

        var classificationLayer = _this.options.classification;
        var map = _this._map;       

        /*
         * inicia o container no controle
         */
        var container = L.DomUtil.create('div', 'leaflet-control-coordinates leaflet-control');

        var $container = $(container);

        _this._$container = $container;

        $container.hide();

        // template do controle
        var template = '<div class="leaflet-control-coordinates-lat">' +
            '<strong class="md-body-1 pixel-values" style="color: black; background: white; margin-botton: 16px;"></strong>' +
            '</div>';

        var $template = $(template);

        // adiciona template ao container do controle        
        $container.append($template);

        /*
         * inicia componentes do controle
         */

        // valores do controle
        var $controlValues = $container.find('.pixel-values');        

         map.on('mousemove', function(e) {

            if(!$container.is(':visible')){
                $container.show();
            }

            var point = e.layerPoint;

            var imgDataValues = classificationLayer.getPointValues(point.x, point.y);

            var pixelvalues = "";

            $.each(imgDataValues,function(index,value){
                pixelvalues += '<div>'+ index + ': ' + (value[0] != null ? value[0]:'...')+'</div>';
            });            

            $controlValues.html(pixelvalues);
        });

        return $container[0];
    }
});