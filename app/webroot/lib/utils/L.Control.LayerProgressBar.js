L.Control.LayerProgressBar = L.Control.extend({
    options: {
        position: 'bottomright',
        layers: []
    },
    _progressBars: {},
    /**
     * Inicia o controle
     * @param  {Object} options parametro de opções do controle
     */
    initialize: function(options) {

        var _this = this;

        L.setOptions(this, options);

        var layers = _this.options.layers;

    },
    /**
     * Adiciona o controle no mapa
     */
    onAdd: function() {

        var _this = this;

        // inicia o container no controle
        var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control');

        var $container = $(container);

        $container.css('padding', '10px');
        $container.css('minWidth', '170px');

        // inicia barra de progresso para cada camada
        var optLayers = _this.options.layers;

        optLayers.forEach(function(optLayer, index) {
            var progressbar = _this._factoryProgressBar($container, optLayer);
        });

        return $container[0];
    },
    _factoryProgressBar: function($container, optLayer) {

        var _this = this;

        var progressBarHtml =
            '<div>' +
            '<div>' +
            '<span class="progress-label"></span>&nbsp&nbsp<span class="progress-number" style="float:right"></span>' +
            '</div>' +
            '<div class="progress progress-sm active" style="width:150px;margin-bottom: 2px;">' +
            '<div class="progress-bar progress-bar-success progress-bar-striped" style="width: 2%"' +
            'role="progressbar">' +
            '</div>' +
            '</div>' +
            '</div>';

        var $pbar = $(progressBarHtml);

        $container.append($pbar);

        $pbar.hide();

        $pbar.attr('perc', 0);      

        var ProgressBar = function($progressbar, optLayer) {

            optLayer.layer = _this._constructProgressOnLayer(optLayer.layer);            

            var $progLabel = $progressbar.find('.progress-label');
            var $progNumber = $progressbar.find('.progress-number');

            $progLabel.html(optLayer.label);

            optLayer.layer.updateProgress = function(perc) {
                $progressbar.find('.progress-bar').css('width', (perc ? perc : "0") + "%");
                $progNumber.html(perc + "%");
                updateVisibility(perc);
            };

            var updateVisibility = function(perc) {
                
                $progressbar.attr('perc', perc);                

                if ($progressbar.is(':visible') == false && perc > 0  && perc < 100) {
                    $progressbar.slideDown('fast');                                                           

                } else if($progressbar.is(':visible') == true && perc == 100){
                    setTimeout(function(){
                        $progressbar.slideUp('fast');                                                                        
                    },1000);                    
                }
                
                updateAllVisibility();                
            };

            var updateAllVisibility = function() {
                var $parent = $progressbar.parent();

                var completed = $parent.find('[perc="100"]');                
                var notinit = $parent.find('[perc="0"]');                
                
                if ((completed.length + notinit.length) == _this.options.layers.length) {
                    $parent.fadeOut('fast');
                } else {
                    $parent.fadeIn('fast');
                }
            };
        };

        var progressbar = new ProgressBar($pbar, optLayer);

        return progressbar;
    },
    _constructProgressOnLayer: function(layer) {

        if (layer._updateProgress) {
            return layer;
        }

        var _updateProgress = function() {
            var perc;

            var tileKeys = Object.keys(layer._tiles);

            var countStatus = {
                total: tileKeys.length,
                loaded: 0,
            };

            tileKeys.forEach(function(tileKey) {
                var tile = layer._tiles[tileKey];
                if (tile.complete) {
                    countStatus.loaded++;
                }
            });

            perc = Math.round((countStatus.loaded / countStatus.total) * 100);

            if(!perc){
                perc = 0;
            }

            layer.updateProgress(perc);
        };

        layer.on('loading', function(e) {
            layer.updateProgress(1);
        });

        layer.on('tileload', function(e) {
            _updateProgress();
        });

        layer.on('tileerror', function(e) {
            setTimeout(function() {
                e.tile.src = e.url;
            }, 2000);
        });

        return layer;
    }
});