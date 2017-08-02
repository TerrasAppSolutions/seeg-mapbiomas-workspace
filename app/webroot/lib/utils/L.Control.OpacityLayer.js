L.Control.Classification = L.Control.extend({
    options: {
        position: 'bottomleft',
    },
    _classes: [],
    _$container: null,
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
        var map = _this.options.map;

        /*
         * inicia o container no controle
         */
        var container = L.DomUtil.create('div', 'control_container leaflet-control');

        var $container = $(container);

        _this._$container = $container;

        // template do controle
        var template = '<div class="control-label" style="margin-left: 10px; margin-top:5px; margin-bottom:5px;"></div>' +
            '<div style="padding:0px 2px"><div class="slider-control"></div></div>' +
            '<ul class="classes-control" style="list-style-type: none; margin-left: 5px; margin-top: 10px; padding-left: 10px;"></ul>';

        var $template = $(template);

        // adiciona template ao container do controle        
        $container.append($template);

        /*
         * inicia componentes do controle
         */

        // label do controle
        var $controlLabel = $container.find('.control-label');
        $controlLabel.html(_this.options.label);

        // slide do controle
        var $controlSlider = $container.find('.slider-control');

        $controlSlider.slider({
            orientation: "horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: 100,
            step: 5,
            start: function(event, ui) {
                //When moving the slider, disable panning.                                           
                map.dragging.disable();
                map.once('mousemove', function(e) {
                    map.dragging.enable();
                });
            },
            slide: function(event, ui) {
                var slider_value = ui.value / 100;
                classificationLayer.setOpacity(slider_value);
            }
        });

        if (_this._classes.length) {
            _this.setClasses(_this._classes);
        }

        return $container[0];
    },
    setClasses: function(classes) {

        var _this = this;

        _this._classes = classes;

        if (!_this._$container) {
            return;
        }

        var $container = _this._$container;

        var $classesControl = $container.find('.classes-control');

        $classesControl.html('');

        _this._classes.forEach(function(classe) {
            var $classe = $('<li style="text-transform:capitalize"><input type="checkbox" style="margin-right: 5px;" checked></li>');
            $classe.append(classe.name);
            $classe.find('input').attr('data-color', classe.color);
            $classesControl.append($classe);
        });

        $classesControl.find('input').change(function(){            
            var uncheckedColors = [];            
            $classesControl.find('input:not(:checked)').each(function(index,elem){                
                uncheckedColors.push($(elem).attr('data-color'));
            });
            _this.options.classification.setFilterColors(uncheckedColors);
            setTimeout(function(){
                _this.options.classification.reclassify();                            
            },100);
        });        
    }
});