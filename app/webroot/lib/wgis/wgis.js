/*!
 * Wgis 
 * Original author: @rcguerrra 
 */
/* global L */

;
(function($, window, document) {

    $.fn.wgis = function(options) {
        return new WgisPlugin(this, options);
    };

    /**
     * Configurações padrão     
     */
    var defaults = {
        lmap: {
            scrollWheelZoom: false
        },
        switchLayer: true,
        google: true,
        osm: true,
        height: "600px",
        styles: {
            padrao: {
                fillColor: '#000', // cor de preenchimento 
                fillOpacity: 0.3, // opacidade de preenchimento
                color: "#000", // cor da linha
                opacity: 1, // opacidade da linha
                weight: 3, // espessura da linha
                className: "feature feature-padrao" // classe css 
            }
        }
    };

    /**
     * Construtor do plugin
     * @constructor
     */
    var WgisPlugin = function(element, options) {

        this.$elem = element;

        this._defaults = defaults;

        this._options = $.extend(true, {}, defaults, options);

        this.init();
    };

    /*
     * Métodos públicos do plugin
     */

    /**
     * Inicializa plugin
     * @public     
     */
    WgisPlugin.prototype.init = function() {
        this._wgis = new WGIS(this.$elem, this._options);
    };

    WgisPlugin.prototype.addBaseLayer = function(layer, layerName) {
        this._wgis.Layers.addBaseLayer(layer, layerName);
    };

    WgisPlugin.prototype.addBaseTileLayer = function(layer, layerName, treePath, visibility, iconPath) {
        this._wgis.Layers.addBaseTileLayer(layer, layerName, treePath, visibility, iconPath);
    };

    WgisPlugin.prototype.addLayer = function(layer, layerName, treePath, visibility, iconPath) {
        this._wgis.Layers.addLayer(layer, layerName, treePath, visibility, iconPath);
    };

    /**
     * Adiciona Layers.WMS para um determinado nó
     * na arvore do switcher layer tree
     * @param Layers.WMS layer
     * @param String treePath
     * @param Boolean visibility
     * @param String iconPath
     */
    WgisPlugin.prototype.addLayerWMS = function(layer, layerName, treePath, visibility, iconPath) {
        if (!$.isArray(layer)) {
            this._wgis.Layers.addWMS(layer, layerName, treePath, visibility, iconPath);
        } else {
            $.each(layer, function(index, value) {
                this._wgis.Layers.addWMS(value, layerName, treePath, visibility, iconPath);
            });
        }
    };

    /**
     * Adiciona Layers.Tile para um determinado nó
     * na arvore do switcher layer tree
     * @param Layers.Tile layer
     * @param String treePath
     * @param Boolean visibility
     * @param String iconPath
     */
    WgisPlugin.prototype.addLayerTile = function(layer, layerName, treePath, visibility, iconPath) {
        if (!$.isArray(layer)) {
            this._wgis.Layers.addTile(layer, layerName, treePath, visibility, iconPath);
        } else {
            $.each(layer, function(index, value) {
                this._wgis.Layers.addTile(value, layerName, treePath, visibility, iconPath);
            });
        }
    };

    /**
     * Adiciona camada geoJSON no mapa
     * @param geoJSON geojson     
     * @param String layerName nome da camada     
     * @param String treePath Caminho para disposição no switchlayer
     * @param Boolean visibility se vai ser exibida inicialmente
     * @param String iconPath url do icone
     * @param Boolean se o mapa será centralizado no geojson adicionado 
     * @return Leaflet.Layer camada adicionada
     */
    WgisPlugin.prototype.addLayerGeoJSON = function(geojson, layerName, treePath, visibility, iconPath, fitbounds) {
        return this._wgis.Layers.addGeoJSON(geojson, layerName, treePath, visibility, iconPath, fitbounds);
    };

    /**
     * Adiciona Layers.WMS como base layer     
     * @param Layers.WMS layer     
     */
    WgisPlugin.prototype.addBaseLayer = function(layer, layerName) {
        this._wgis.Layers.addBaseLayer(layer, layerName);
    };

    /**
     * Adiciona um label no seletor de camadas
     * @param String nome do label
     * @param String caminho no seletor
     * @param String caminho da imagem icone
     */
    WgisPlugin.prototype.addNodeLabel = function(name, treePath, iconPath) {
        this._wgis.Layers.addNodeLabel(name, treePath, iconPath);
    };

    /**
     * Recupera todas as camadas inseridas mapeadas em arvore
     * @return Object objeto mapeado de camadas
     */
    WgisPlugin.prototype.getLayersTree = function() {
        return this._wgis.SwitchLayer.LayerTree.treeObj;
    };

    /**
     * Centraliza o mapa numa determinada coordenada
     * @param int lat coordenada latitude
     * @param int lng coordenada longitude
     * @param int zoom zoom do mapa
     */
    WgisPlugin.prototype.setCenter = function(lat, lng, zoom) {
        this._wgis.Map.setCenter(lat, lng, zoom);
    };

    /**
     * Centraliza o mapa com um geojson
     * @param geojson coordenada latitude     
     */
    WgisPlugin.prototype.setCenterGeoJSON = function(geojson) {
        var center = turf.center(geojson);
        this._wgis.lmap.setView([center.geometry.coordinates[1], center.geometry.coordinates[0]], 10);
    };

    /**
     * Centraliza o mapa numa determinada camada
     * @param Layer layer     
     */
    WgisPlugin.prototype.fitBounds = function(layer) {
        this._wgis.Map.fitBounds(layer);
    };

    /**
     * Remove todas as camadas     
     */
    WgisPlugin.prototype.resetLayers = function() {
        this._wgis.Layers.reset();
    };

    /**
     * Componente WGIS
     * @param jQueryElement elemento selecionado jquery
     */
    var WGIS = function($pluginElem, opts) {

        var _wgis = this;

        this.lmap = null;

        this.init = function() {
            /*
             * inicia componentes
             */

            _wgis.Map.init();

            _wgis.SwitchLayer.init();

            _wgis.Layers.init();

            _wgis.Style.init();
            
        };

        /*
         * Componente de mapa
         */
        this.Map = {
            init: function() {
                /*
                 *  adiciona classe css do plugin
                 */
                $pluginElem.addClass('wgis');

                /*
                 * instancia o elemento dom do mapa 
                 * e o plugin de mapa
                 */
                var $map = $(document.createElement("div"));

                $map.css('height', opts.height);

                $pluginElem.append($map);

                // inicia o mapa             
                _wgis.lmap = L.map($map[0], opts.lmap);

                this.Events.init();

            },
            /**
             * Seta centro do mapa
             * @param int latitude
             * @param int longituide
             * @param int zoom             
             */
            setCenter: function(lat, lng, zoom) {
                var z = zoom || 10;
                _wgis.lmap.setView([lat, lng], z);
            },
            fitBounds: function(layer) {
                _wgis.lmap.fitBounds(layer.getBounds(), {
                    paddingBottomRight: [100, 100],
                    maxZoom: 12
                });
            },
            Events: {
                init: function() {
                    _wgis.lmap.on('click', function(e) {
                        _wgis.Map.Events.click(e);
                    });
                },
                click: function(e) {}
            }
        };

        /*
         * Componente de camadas
         */
        this.Layers = {
            init: function() {
                if (opts.google) {
                    _wgis.Layers.defaults.googleBaseLayer();
                }
                if (opts.osm) {
                    _wgis.Layers.defaults.openStreetMap();
                }
            },
            defaults: {
                openStreetMap: function() {
                    var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
                    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
                    var osm = new L.TileLayer(osmUrl, {
                        attribution: osmAttrib
                    });
                    _wgis.SwitchLayer.LayerTree.addBaseLayer(osm, "Open Street Maps");
                },
                googleBaseLayer: function() {
                    try {
                        var googleTerrain = new L.Google('SATELLITE');
                        _wgis.SwitchLayer.LayerTree.addBaseLayer(googleTerrain, "Google");
                    } catch (e) {
                        console.log("Google API não disponível");
                    }
                }
            },
            viewLayers: [],
            reset: function() {
                $.each(this.viewLayers, function(index, layer) {
                    _wgis.lmap.removeLayer(layer);
                    delete layer;
                });
                this.viewLayers = [];
            },
            /**
             * Adiciona camada WMS ao mapa
             * @param Layer.WMS camada wms 
             * Exemplo:
             * WMS = {
             *     url: "http://wms.url.com...",
             *     params: {
             *         wmsParam1: "...",
             *         wmsParam2: "..."
             *     }
             *  };
             */
            addWMS: function(wmsLayer, layerName, treePath, visibility, iconPath) {
                var wmsUrl = wmsLayer.url;
                var wmsParams = wmsLayer.params;
                var wmsLayer = L.tileLayer.wms(wmsUrl, wmsParams);

                if (visibility) {
                    _wgis.lmap.addLayer(wmsLayer);
                }

                _wgis.SwitchLayer.LayerTree.addLayer(wmsLayer, layerName, treePath, visibility, iconPath);

            },
            /**
             * Adiciona camada Tile ao mapa
             * @param Layer.Tile camada tile
             * Exemplo:
             * tile = {
             *     url: "http://tile.url.com...",
             *     params: {
             *         tileParam1: "...",
             *         tileParam2: "..."
             *     }
             *  };
             */
            addTile: function(tileLayer, layerName, treePath, visibility, iconPath) {
                var tileUrl = tileLayer.url;
                var tileParams = tileLayer.params;
                var tileLayer = L.tileLayer(tileUrl, tileParams);
                if (visibility) {
                    _wgis.lmap.addLayer(tileLayer);
                }

                _wgis.SwitchLayer.LayerTree.addLayer(tileLayer, layerName, treePath, visibility, iconPath);

            },
            /**
             * Adiciona camada GeoJSON ao mapa
             * @param Layer.GeoJSON GeoJSON
             */
            addGeoJSON: function(geojson, layerName, treePath, visibility, iconPath, fitbounds) {

                visibility = visibility !== undefined ? visibility : true;

                fitbounds = fitbounds !== undefined ? fitbounds : true;

                var layerGeoJSON = _wgis.Layers.Utils.createGeoJSONLayer(geojson);

                this.viewLayers.push(layerGeoJSON);

                if (visibility) {
                    _wgis.lmap.addLayer(layerGeoJSON);
                }

                if (fitbounds) {
                    _wgis.lmap.fitBounds(layerGeoJSON.getBounds(), {
                        paddingBottomRight: [100, 100]
                    });
                }

                if (treePath) {
                    _wgis.SwitchLayer.LayerTree.addLayer(layerGeoJSON, layerName, treePath, visibility, iconPath);
                }

                return layerGeoJSON;
            },
            /**
             * Adiciona base layer camada WMS ao mapa
             * @param Layer.WMS camada wms              
             */
            addBaseLayer: function(wmsLayer, layerName) {
                var wmsUrl = wmsLayer.url;
                var wmsParams = wmsLayer.params;
                var wmsLayer = L.tileLayer.wms(wmsUrl, wmsParams);

                _wgis.SwitchLayer.LayerTree.addBaseLayer(wmsLayer, layerName);
            },
            /**
             * Adiciona base tile layer ao mapa
             * @param TileLayer camada tileLaye
             */
            addBaseTileLayer: function(tileLayer, layerName) {
                var tileUrl = tileLayer.url;
                var tileParams = tileLayer.params;
                var tileLayer = L.tileLayer(tileUrl, tileParams);

                _wgis.SwitchLayer.LayerTree.addBaseLayer(tileLayer, layerName);
            },
            /**
             * Adiciona layer ao mapa
             * @param L.Layers layer
             * @param String treePath
             * @param Boolean visibility
             * @param String iconPath 
             */
            addLayer: function(layer, layerName, treePath, visibility, iconPath) {

                if (visibility) {
                    _wgis.lmap.addLayer(layer);
                }

                _wgis.SwitchLayer.LayerTree.addLayer(layer, layerName, treePath, visibility, iconPath);

            },
            /**
             * Adiciona um label no seletor de camadas
             * @param String nome do label
             * @param String caminho no seletor
             * @param String caminho da imagem icone
             */
            addNodeLabel: function(name, treePath, iconPath) {
                _wgis.SwitchLayer.LayerTree.addNode(name, treePath, iconPath);
            },
            setZIndex: function(layer, zindex) {
                if (layer._layers) {
                    $.each(layer.getLayers(), function(i, l) {
                        if (l.setZIndex) {
                            l.setZIndex(zindex);
                        }
                    });
                }
                if (layer.setZIndex) {
                    layer.setZIndex(zindex);
                }
            },
            /**
             * 
             * @param {Object} layer
             * @param {type} visibility             
             */
            setVisibility: function(layer, visibility) {

                var leaflet_id = layer._leaflet_id ? layer._leaflet_id : "";

                var $elemLayer = $pluginElem.find('.layer-id-' + leaflet_id.toString());
                //$elemLayer = [];
                if ($elemLayer.length) {
                    if (visibility) {
                        $elemLayer.show();
                    } else {
                        $elemLayer.hide();
                    }
                } else {
                    if (visibility) {
                        _wgis.lmap.addLayer(layer);
                    } else {
                        _wgis.lmap.removeLayer(layer);
                    }
                }
            },
            Events: {
                apply: function(layer) {
                    layer.on('click', function(e) {
                        _wgis.Layers.Events.click(e);
                    });
                },
                click: function(e) {}
            },
            Utils: {
                createGeoJSONLayer: function(geoJSON) {

                    var layerGeoJSON = L.geoJson(geoJSON);

                    var properties = geoJSON.properties ? geoJSON.properties : {};

                    if (properties.styleClass) {
                        var styleClass = properties.styleClass;
                        _wgis.Style.setStyle(layerGeoJSON, styleClass);
                    }

                    if (properties.popupContent) {
                        var popupContent = properties.popupContent;
                        var popupOptions = {
                            className: properties.popupClass ? properties.popupClass : ""
                        };
                        layerGeoJSON.bindPopup(popupContent, popupOptions);
                    }

                    return layerGeoJSON;
                }
            }
        };

        /*
         * Componente de estilo
         */
        this.Style = {
            init: function() {
                if (opts.styles.patterns) {
                    var $patternDiv = $(document.createElement("div"));
                    $pluginElem.append($patternDiv);
                    $patternDiv.append(opts.styles.patterns);
                    $patternDiv.css({
                        height: '0px',
                        overflow: 'hidden'
                    });
                }
            },
            setStyle: function(layer, styleClass, style2) {
                var style = this.getStyle(styleClass);

                if (layer._leaflet_id) {
                    style.className += " layer-id-" + layer._leaflet_id.toString();
                }

                if (style2) {
                    $.extend(style, style2);
                }

                layer.setStyle(style);

                if (layer.options) {
                    layer.options.style = style;
                } else {
                    layer.options = {
                        style: style
                    };
                }

            },
            getStyle: function(styleClass) {
                var style = opts.styles[styleClass];
                if (!style) {
                    style = opts.styles.padrao;
                }
                return $.extend(true, {}, style);
            }
        };

        /*
         * Componete seletor de camadas
         */
        this.SwitchLayer = {
            $slTree: null,
            $slBaseLayers: null,
            init: function() {
                /*
                 * Elementos dom do switch layer
                 */
                var sltreeHtml = '<div class="btn-toggle"></div><div class="slcontain"><h4>Layers</h4><ul class="baselayers"></ul><div class="slTreeList"></div></div>';

                var $slTreeDiv, $slTreeList, $slToggleBtn;
                $slTreeDiv = $(document.createElement("div"));
                $slTreeDiv.addClass("slTree");
                $slTreeDiv.html(sltreeHtml);
                $slTreeList = $slTreeDiv.find(".slTreeList");
                $slToggleBtn = $slTreeDiv.find(".btn-toggle");

                this.$slBaseLayers = $slTreeDiv.find(".baselayers");

                /*
                 * Botão de exibir o switch layer
                 */
                var slToggleBtnAberto;
                $slToggleBtn.click(function(evt) {
                    if (slToggleBtnAberto) {
                        $slTreeDiv.animate({
                            right: "-355px"
                        }, {
                            duration: 1500,
                            easing: 'easeOutExpo'
                        });
                        $slToggleBtn.css('margin', "18px 0 0 -35px");
                        slToggleBtnAberto = false;
                    } else {
                        $slTreeDiv.animate({
                            right: "-2px"
                        }, {
                            duration: 1500,
                            easing: 'easeOutExpo'
                        });
                        $slToggleBtn.css('margin', "18px 0 0 -30px");
                        slToggleBtnAberto = true;
                    }
                });

                /*
                 * Insere elementos no plugin
                 */
                $pluginElem.prepend($slTreeDiv);

                // inicia plugin jstree e seus eventos de seleção de nós
                $slTreeList
                    .on('select_node.jstree', _wgis.SwitchLayer.Events.selectNode)
                    .on('deselect_node.jstree', _wgis.SwitchLayer.Events.deselectNode)
                    .jstree({
                        'plugins': ["wholerow", "checkbox"],
                        'core': {
                            'data': []
                        }
                    });
                this.$slTree = $slTreeList = $slTreeList.jstree(true);

                if (!opts.switchLayer) {
                    $slTreeDiv.hide();
                }
            },
            Events: {
                selectNode: function(node, selected, event) {
                    var selectedNodeIds = selected.node.children
                        .concat(selected.node.children_d)
                        .concat([selected.node.id]);

                    var nodes = _wgis.SwitchLayer.Jstree.getNodesByIds(selectedNodeIds);
                    _wgis.SwitchLayer.Jstree.selectNodeLayers(nodes, true);

                    /**
                     * Será somente criado quando elevation text
                     */
                    if(selected.node.text === 'Elevation') {
                        // Criação da barra de gradiente no mapa
                        _wgis.createElevationBarOnMap();
                    }
                },
                deselectNode: function(node, selected, event) {
                    var selectedNodeIds = selected.node.children
                        .concat(selected.node.children_d)
                        .concat([selected.node.id]);

                    var nodes = _wgis.SwitchLayer.Jstree.getNodesByIds(selectedNodeIds);

                    _wgis.SwitchLayer.Jstree.selectNodeLayers(nodes, false);

                    /**
                     * Será somente removido quando elevation text
                     */
                    if (selected.node.text === 'Elevation') {
                        // Criação da barra de gradiente no mapa
                        _wgis.removeElevationBarOnMap();
                    }
                },
                timeoutRefresh: null,
                addedLayer: function() {
                    _wgis.SwitchLayer.$slTree.settings.core.data = _wgis.SwitchLayer.LayerTree.tree;
                    if (this.timeoutRefresh) {
                        clearTimeout(this.timeoutRefresh);
                        this.timeoutRefresh = null;
                    }
                    this.timeoutRefresh = setTimeout(function() {
                        _wgis.SwitchLayer.$slTree.refresh();
                    }, 10);
                }
            },
            /*
             * Objeto que gerencia as camadas
             * estrutaradas em arvore            
             */
            LayerTree: {
                tree: [],
                treeObj: {},
                layers: {},
                baseLayers: [],
                layerLastId: 0,
                /**
                 * Adiciona uma camada a um nó arvore, com botao de selecionar
                 * @param Layer nodeName camada a ser adicionada
                 * @param String treePath rota de nós onde será inserido o nó
                 * @param Boolean selected determina de se o nó iniciará selecionado ou não
                 * @param String path url da imagem icone
                 */
                addLayer: function(layer, layerName, treePath, selected, iconPath) {

                    var tree = this.tree;
                    var treeObj = this.treeObj;

                    var node = null;
                    var nodeObj = {};
                    /*
                     *  se for informado o caminho,
                     *  executa recursividade de seleção do nó indicado.
                     *  caso o nó não exista ele será criado na recursividade
                     */
                    if (treePath) {
                        var pathArray = treePath.split('+>');
                        for (var i = 0; i < pathArray.length; i++) {
                            var nText = pathArray[i];
                            if (i === 0) {
                                node = tree;
                                nodeObj = treeObj;
                            }

                            /*
                             *  procura o nó no nivel atual da arvore
                             */

                            // versao jstree data
                            var nextNode = _wgis.SwitchLayer.LayerTree.findNode(node, nText);

                            if (!nextNode) {
                                // caso não exista, cria um novo nó
                                nextNode = {
                                    text: nText,
                                    icon: "img/layergroup.png",
                                    children: []
                                };
                                node.push(nextNode);
                            }
                            node = nextNode.children;

                            // versao objeto 
                            var nextNodeObj = nodeObj[nText];
                            if (!nextNodeObj) {
                                nextNodeObj = {};
                                nodeObj[nText] = nextNodeObj;
                            }
                            nodeObj = nextNodeObj;
                        }
                    } else {
                        node = tree;
                        nodeObj = treeObj;
                    }

                    // se for um array de camadas, insere como nós filhos do nó selecionado
                    if (selected === undefined) {
                        selected = false;
                    }
                    if (iconPath === undefined) {
                        iconPath = "img/layer.png";
                    }

                    var newNode = {
                        id: "sl_" + (++this.layerLastId).toString(),
                        text: layerName,
                        layerId: this.layerLastId,
                        state: {
                            selected: selected
                        },
                        icon: iconPath,
                        li_attr: {
                            "leafletid": layer._leaflet_id,
                            "layerid": this.layerLastId
                        },
                        children: []
                    };

                    node.push(newNode);
                    nodeObj[layerName] = {
                        id: this.layerLastId,
                        layer: layer
                    };

                    this.layers[this.layerLastId] = layer;

                    _wgis.Layers.setZIndex(layer, this.layerLastId);

                    _wgis.Layers.setVisibility(layer, selected);

                    // dispara evento de adição de camada
                    _wgis.SwitchLayer.Events.addedLayer();

                },
                /**
                 * Adiciona um nó na arvore, com funcionalidade informativa,
                 * sem botao de selecionar
                 * @param String nodeName nome do nó, label que sera exibido na árvore
                 * @param String treePath rota de nós onde será inserido o nó
                 * @param String iconPath caminho da imagem icone
                 */
                addNode: function(nodeName, treePath, iconPath) {

                    var tree = this.tree;
                    var treeObj = this.treeObj;

                    var node = null;
                    var nodeObj = {};
                    /*
                     *  se for informado o caminho,
                     *  executa recursividade de seleção do nó indicado.
                     *  caso o nó não exista ele será criado na recursividade
                     */
                    if (treePath) {
                        var pathArray = treePath.split('+>');
                        for (var i = 0; i < pathArray.length; i++) {
                            var nText = pathArray[i];
                            if (i === 0) {
                                node = tree;
                                nodeObj = treeObj;
                            }
                            // procura o nó no nivel atual da arvore
                            var newNode = _wgis.SwitchLayer.LayerTree.findNode(node, nText);
                            if (!newNode) {
                                // caso não exista, cria um novo nó
                                newNode = {
                                    text: nText,
                                    icon: "img/layergroup.png",
                                    children: []
                                };
                                node.push(newNode);
                            }
                            node = newNode.children;

                            // versao objeto 
                            var nextNodeObj = nodeObj[nText];
                            if (!nextNodeObj) {
                                nextNodeObj = {};
                                nodeObj[nText] = nextNodeObj;
                            }
                            nodeObj = nextNodeObj;

                        }
                    } else {
                        node = tree;
                        nodeObj = treeObj;
                    }

                    node.push({
                        text: nodeName,
                        icon: iconPath,
                        state: {
                            disabled: true
                        },
                        children: []
                    });

                    nodeObj[nodeName] = {};

                    // dispara evento de adição de camada
                    _wgis.SwitchLayer.Events.addedLayer();
                },
                /**
                 * Adiciona uma camada base wms
                 * @param LayerWMS camada a ser adicionada                 
                 */
                addBaseLayer: function(wmsLayer, layerName) {
                    var $slBaseLayers = _wgis.SwitchLayer.$slBaseLayers;
                    var baseLayers = this.baseLayers;

                    // insere nova camada
                    baseLayers.unshift({
                        name: layerName,
                        layer: wmsLayer
                    });

                    // recria os radiobox
                    $slBaseLayers.html("");

                    $.each(baseLayers, function(index, value) {
                        var $baselayer = $(document.createElement("li"));

                        $baselayer.layer = value;

                        $baselayer.html('<input type="radio" name="baselayer" value="' + index + '"/><span>' + value.name + '</span>');

                        if (index === 0) {
                            $baselayer.find('input').attr('checked', 'checked');
                            _wgis.lmap.addLayer(baseLayers[index].layer);
                        } else {
                            _wgis.lmap.removeLayer(baseLayers[index].layer);
                        }

                        $slBaseLayers.append($baselayer);
                    });

                    // evento de click nos radioboxs
                    $slBaseLayers.find('input').click(function(evt) {
                        var layerIdChecked = $(evt.target).val();

                        _wgis.lmap.addLayer(baseLayers[layerIdChecked].layer);

                        $.each(baseLayers, function(index, value) {
                            if (parseInt(index) !== parseInt(layerIdChecked)) {
                                _wgis.lmap.removeLayer(value.layer);
                            }
                        });
                    });
                },
                getNodeByPath: function(treePath) {
                    var node = null;
                    var pathArray = treePath.split('+>');
                    for (var i = 0; i < pathArray.length; i++) {
                        var nText = pathArray[i];
                        if (i === 0) {
                            node = tree;
                        }
                        // procura o nó no nivel atual da arvore
                        var newNode = findNode(node, nText);
                        if (!newNode) {
                            break;
                        }

                        if (newNode.children.length > 0) {
                            node = newNode.children;
                        } else {
                            node = newNode;
                        }
                    }
                    return node;
                },
                findNode: function(nodes, nodeText) {
                    var target = null;
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        if (node.text === nodeText) {
                            target = node;
                            break;
                        }
                    }
                    return target;
                }
            },
            Jstree: {
                /**
                 * Recupera nós por array de ids
                 * @param Array nodeIds 
                 * @returns Array array de nós da árvore
                 */
                getNodesByIds: function(nodeIds) {
                    var $slTree = _wgis.SwitchLayer.$slTree;

                    var nodes = [];
                    $.each(nodeIds, function(index, value) {
                        nodes.push($slTree.get_node(value));
                    });
                    return nodes;
                },
                /**
                 * @param Array lista de objetos de nos da arvore
                 * @param Boolean marcar ou desmacar
                 * altera a visibilidade das camadas openlayers
                 * repectivas aos nos selecionados
                 */
                selectNodeLayers: function(nodes, selected) {
                    $.each(nodes, function(index, node) {
                        if (node.original.layerId) {
                            var layer = _wgis.SwitchLayer.LayerTree.layers[node.original.layerId];
                            _wgis.Layers.setVisibility(layer, selected);
                        }
                    });
                }
            },
            selectLayerById: function(layerId) {
                var $slTree = _wgis.SwitchLayer.$slTree;
                var slId = "sl_" + layerId.toString();
                $slTree.select_node(slId);
            },
            deselectLayerById: function(layerId) {
                var $slTree = _wgis.SwitchLayer.$slTree;
                var slId = "sl_" + layerId.toString();
                $slTree.deselect_node(slId);
            },
            deselectLayerAll: function() {
                var $slTree = _wgis.SwitchLayer.$slTree;
                $slTree.deselect_all();
            }
        };

        /*
         * Componente de controle
         */
        this.Control = {
            Draw: {
                _drawFeatureGroup: null,
                _drawControl: null,
                _drawTarget: null,
                init: function(opts, labels) {
                    /*
                     * Aplica labels traduzidos
                     */
                    L.drawLocal = _wgis.Control.Draw.labels;

                    /*
                     * Instancia camada de desenho
                     */
                    var drawFeatureGroup = new L.FeatureGroup();

                    /*
                     * Inicia controle de desenho
                     */
                    this.drawControlInit(drawFeatureGroup);

                    /*
                     * Inicia configuraçao de eventos do controle
                     */
                    this.Events.init();

                },
                exit: function() {
                    if (this._drawControl) {
                        _wgis.lmap.removeControl(this._drawControl);
                        this._drawControl = null;
                    }
                },
                drawControlInit: function(drawFeatureGroup, drawOpts) {
                    /*
                     * camada de desenho
                     */
                    // instancia camada de desenho e adiciona no mapa                    
                    if (!drawFeatureGroup) {
                        drawFeatureGroup = new L.FeatureGroup();
                    }

                    _wgis.lmap.addLayer(drawFeatureGroup);

                    drawFeatureGroup.setZIndex(1000);

                    this._drawFeatureGroup = drawFeatureGroup;

                    /*
                     *  controle de desenho
                     */
                    // aplica nas configurações a camada de desenho
                    if (!drawOpts) {
                        drawOpts = new _wgis.Control.Draw.DefaultOptions();
                    }
                    drawOpts.edit.featureGroup = this._drawFeatureGroup;

                    // instancia o controle e adiciona no mapa
                    if (this._drawControl) {
                        _wgis.lmap.removeControl(this._drawControl);
                    }
                    this._drawControl = new L.Control.Draw(drawOpts);
                    _wgis.lmap.addControl(this._drawControl);
                },
                Events: {
                    /**
                     * Configura eventos de criação e edição de poligonos
                     */
                    init: function() {
                        _wgis.lmap.on('draw:created', function(e) {
                            if (_wgis.Control.Draw.Events.created) {
                                _wgis.Control.Draw.Events.created(e);
                            }
                        });

                        _wgis.lmap.on('draw:edited', function(e) {
                            if (_wgis.Control.Draw.Events.edited) {
                                _wgis.Control.Draw.Events.edited(e);
                            }
                        });
                    },
                    created: function(e) {
                        var type = e.layerType,
                            layer = e.layer;

                        if (type === 'marker') {
                            layer.bindPopup('A popup!');
                        }
                        _wgis.Control.Draw._drawFeatureGroup.addLayer(layer);
                    },
                    edited: function(e) {},
                    layerClick: function(e) {
                        /*
                         * Seleciona camada Polygon que sera editada
                         */
                        var targetPolygon = e.layer;
                        var targetFeatureGroup = e.target;

                        _wgis.Control.Draw.Utils.selectTarget({
                            polygon: targetPolygon,
                            featureGroup: targetFeatureGroup
                        });
                    },
                    mapClick: function(e) {
                        if (_wgis.Control.Draw._drawTarget) {
                            //_wgis.Control.Draw.Utils.deselectTarget(_wgis.Control.Draw._drawTarget);
                        }
                    }
                },
                Utils: {
                    selectTarget: function(selected) {

                        if (_wgis.Control.Draw._drawTarget) {
                            _wgis.Control.Draw.Utils.deselectTarget(_wgis.Control.Draw._drawTarget);
                        }

                        /*
                         * Seleciona camada                         
                         */
                        _wgis.Control.Draw._drawTarget = selected;

                        var polygon = selected.polygon;

                        /*
                         * Adiciona camada Polygon na FeatureGroup de desenho
                         */
                        polygon.addTo(_wgis.Control.Draw._drawFeatureGroup);

                        /*
                         * Aplica estilo selecionado
                         */
                        var styleOriginal = selected.featureGroup.options.style;
                        var styleSelecionado = $.extend({}, styleOriginal, {
                            color: "blue"
                        });
                        _wgis.Control.Draw._drawFeatureGroup.setStyle(styleSelecionado);

                    },
                    deselectTarget: function(selected) {
                        /*
                         * Reinicia controle de desenho
                         */
                        _wgis.Control.Draw.drawControlInit();

                        /*
                         * Retorna camada selecionada para configurações anteriores                         
                         */
                        var polygon = selected.polygon;
                        var featureGroup = selected.featureGroup;

                        /*
                         * aplica estilo original
                         */
                        var styleOriginal = featureGroup.options.style;
                        polygon.setStyle(styleOriginal);

                        /*
                         * adiciona featureGroup de origem
                         */
                        polygon.addTo(featureGroup);
                        featureGroup.setStyle(styleOriginal);

                        _wgis.Control.Draw._drawTarget = null;

                    },
                    geoJSONLayerToPolygons: function(geoJSONLayer) {
                        var polygons = [];
                        $.each(geoJSONLayer.getLayers(), function(ig, gLayer) {
                            $.each(gLayer.getLayers(), function(i, layer) {
                                polygons.push(L.polygon(layer.getLatLngs()));
                            });
                        });
                        return polygons;
                    }
                },
                DefaultOptions: function() {
                    this.draw = {
                        position: 'topleft',
                        polyline: {
                            metric: true,
                            shapeOptions: {
                                color: 'blue'
                            }
                        },
                        polygon: {
                            allowIntersection: false,
                            drawError: {
                                color: '#b00b00',
                                timeout: 1000
                            },
                            shapeOptions: {
                                color: 'blue'
                            },
                            showArea: true
                        },
                        rectangle: {
                            shapeOptions: {
                                color: 'blue'
                            }
                        },
                        circle: {
                            shapeOptions: {
                                color: 'blue'
                            }
                        }
                    };
                    this.edit = {
                        featureGroup: {}
                    };
                },
                labels: {
                    draw: {
                        toolbar: {
                            actions: {
                                title: 'Cancelar desenho.',
                                text: 'Cancelar'
                            },
                            undo: {
                                title: 'Remover último ponto desenhado.',
                                text: 'Remover último ponto.'
                            },
                            buttons: {
                                polyline: 'Desenhar uma linha.',
                                polygon: 'Desenhar um polígono.',
                                rectangle: 'Desenhar um retangulo.',
                                circle: 'Desenhar um circulo.',
                                marker: 'Desenhar um marcador.'
                            }
                        },
                        handlers: {
                            circle: {
                                tooltip: {
                                    start: 'Clique e pressione para desenhar um polígono.'
                                },
                                radius: 'Raio'
                            },
                            marker: {
                                tooltip: {
                                    start: 'Clique no mapa para inserir um marcador.'
                                }
                            },
                            polygon: {
                                tooltip: {
                                    start: 'Clique para começar a desenhar um polígono.',
                                    cont: 'Clique para continuar a desenhar o polígono.',
                                    end: 'Clique no primeiro ponto para fechar o polígono.'
                                }
                            },
                            polyline: {
                                error: '<strong>Erro:</strong> a linha não pode cruzar!',
                                tooltip: {
                                    start: 'Clique para começar a desenhar uma linha.',
                                    cont: 'Clique para continuar a desenhar a linha.',
                                    end: 'Duplo clique para finalizar a linha.'
                                }
                            },
                            rectangle: {
                                tooltip: {
                                    start: 'Clique e arraste para desenha um poligono.'
                                }
                            },
                            simpleshape: {
                                tooltip: {
                                    end: 'Solte para finalizar o desenho.'
                                }
                            }
                        }
                    },
                    edit: {
                        toolbar: {
                            actions: {
                                save: {
                                    title: 'Salvar alterações.',
                                    text: 'Salvar'
                                },
                                cancel: {
                                    title: 'Cancelar edição discartando as alterações.',
                                    text: 'Cancelar'
                                }
                            },
                            buttons: {
                                edit: 'Editar camadas.',
                                editDisabled: 'Sem camadas para editar.',
                                remove: 'Remover camadas.',
                                removeDisabled: 'Sem camadas para editar.'
                            }
                        },
                        handlers: {
                            edit: {
                                tooltip: {
                                    text: 'Arraste os vértices, ou clique para remove-los.',
                                    subtext: 'Clique em "Cancelar" para discartar as alterações.'
                                }
                            },
                            remove: {
                                tooltip: {
                                    text: 'Clique para remover.'
                                }
                            }
                        }
                    }
                }
            }
        };

        /*
         * Componente de analise espacial
         */
        this.SpatialAnalysis = {
            buffer: function(layer) {
                /*
                 * converte para geojson
                 */
                var featureGeojson = layer.toGeoJSON();

                /*
                 * aplica buffer
                 */
                var buffered = turf.buffer(featureGeojson, 30, 'meters');

                var featureGroupBuffer = L.geoJson(buffered);

                var layerBuffer = featureGroupBuffer.getLayers()[0];

                return layerBuffer;
            },
            intersect: function(layer, layer2) {

                /*
                 * converte para geojson
                 */
                var feature1Geojson = layer.toGeoJSON();
                if (feature1Geojson.type === "FeatureCollection") {
                    feature1Geojson = turf.merge(feature1Geojson);
                }

                var feature2Geojson = layer2.toGeoJSON();
                if (feature2Geojson.type === "FeatureCollection") {
                    feature2Geojson = turf.merge(feature2Geojson);
                }

                /*
                 * aplica intersection
                 */

                var featureIntersect = null;

                var intersection = turf.intersect(feature1Geojson, feature2Geojson);

                var layerIntersection = null;

                if (intersection) {
                    var featureGroupBuffer = L.geoJson(intersection);
                    layerIntersection = featureGroupBuffer.getLayers()[0];
                }
                return layerIntersection;
            },
            mergeFeatureGroup: function(featureGroup) {

                var featureGroupGeoJSON = featureGroup.toGeoJSON();

                var fgroupMergedGeoJSON = turf.merge(featureGroupGeoJSON);

                var mergedFeatureGroup = L.geoJson(fgroupMergedGeoJSON).getLayers()[0];

                if (mergedFeatureGroup instanceof L.Polygon) {
                    mergedFeatureGroup = L.featureGroup([mergedFeatureGroup]);
                }

                return mergedFeatureGroup;

            }
        };

        this.init();
    };

})(jQuery, window, document);