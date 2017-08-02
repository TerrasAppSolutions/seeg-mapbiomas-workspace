L.TileLayer.Classification = L.TileLayer.Canvas.extend({
    /**
     * Objeto de dados das imagens de valor (l1,l2,l3...)
     * @type {Object}
     */
    _tilesImgData: {},
    /**
     * Objeto de dados das imagens resultantes da classificação
     * @type {Object}
     */
    _tilesResultData: {},
    /**
     * Lista de imagens
     * @type {Object}
     */
    _tilesImg: [],
    /**
     * Dimensões do canvas
     * @type {Object}
     */
    _canvasSize: {
        width: 256,
        height: 256
    },
    _progressBar: null,
    _filterColors: [],
    _filterColorsRgb: [],
    _isChangedLayers: false,
    /**
     * Incializa o objeto
     * @param  {Object} options   objeto de opçoes de configurações e parâmetros
     */
    initialize: function(options) {

        var _this = this;

        L.setOptions(this, options);

        this.on('loading', function(e) {
            _this._tiles = {};
            _this._tilesImgData = {};
            _this._tilesResultData = {};
            _this._tilesImg = [];
            _this._updateProgress();
        });

    },
    /**
     * Desenha o tile no mapa
     * @param  {Canvas}   canvas    canvas do tile
     * @param  {Object}   tilePoint objeto com metadados do tile
     * @param  {Integer}  zoom      zoom do tile
     * @return {Object}             objeto de camadas
     */
    drawTile: function(canvas, tilePoint, zoom) {

        var _this = this;

        // carrega todas as imagens da camadas 
        // passadas por parametro (l1.l2,l3...)                        
        _this._loadImagesData({
            x: tilePoint.x,
            y: tilePoint.y,
            zoom: zoom
        }, function(imagesData) {
            try {
                setTimeout(function() {
                    _
                    _this._renderClassification(canvas, imagesData);
                }, 1);
            } catch (err) {
                console.log(err);
                console.log(imagesData);
            }
        });
    },
    /**
     * Executa novamente a classificação
     */
    reclassify: function(redraw) {

        if (this._isChangedLayers) {
            this.redraw();
            this._isChangedLayers = false;
            return;
        }

        var _this = this;

        var tilesKeys = Object.keys(_this._tiles);

        tilesKeys.forEach(function(tileKey) {
            var tileCanvas = _this._tiles[tileKey];
            var tileImagesData = _this._tilesImgData[tileKey];

            var imagesData = {
                imagesData: tileImagesData,
                x: tileKey.split(":")[0],
                y: tileKey.split(":")[1]
            };

            try {
                setTimeout(function() {
                    _this._renderClassification(tileCanvas, imagesData);
                }, 1);
            } catch (err) {
                //console.log(err);
                //console.log(imagesData);
            }
        });
    },
    /**     
     * Atualiza camadas variaveis
     * @param {Object} layerObj Objeto de camadas
     */
    setLayers: function(layerObj) {

        this._isChangedLayers = !_.isMatch(this.options.layers, layerObj);

        this.options.layers = layerObj;
    },
    /**     
     * Atualiza cores filtradas
     * @param {Array} lista de cores hex
     */
    setFilterColors: function(colorsHex) {
        var _this = this;

        this._filterColors = colorsHex;

        _this._filterColorsRgb = [];

        colorsHex.forEach(function(color) {
            color = color.replace('#', '');
            var bigint = parseInt(color, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;
            _this._filterColorsRgb.push([r, g, b, 255]);
        });

    },
    getPointValues: function(x, y) {

        var _this = this;

        var point = {
            x: x,
            y: y
        };

        var tileOnPoint;

        var tileImageData;

        if (!_this._tiles) {
            _this._tiles = {};
        }

        var tileKeys = Object.keys(_this._tiles);

        for (var i = 0; i < tileKeys.length; i++) {
            var tileKey = tileKeys[i];
            var tile = _this._tiles[tileKey];

            var isInsideTile = (point.x >= tile._leaflet_pos.x && point.x <= (tile._leaflet_pos.x + 255)) &&
                (point.y >= tile._leaflet_pos.y && point.y <= (tile._leaflet_pos.y + 255));

            if (isInsideTile) {
                tileOnPoint = tile;
                tileImageData = _this._tilesImgData[tileKey];
                //tileImageData['classification'] = _this._tilesResultData[tileKey];
                break;
            }
        }

        var imgDataValues = {};
        var imgDatakeys = Object.keys(_this.options.layers);;
        //var imgDatakeys = Object.keys(tileImageData);;        

        if (tileOnPoint) {

            var tilePoint = {
                x: point.x - tileOnPoint._leaflet_pos.x + 1,
                y: point.y - tileOnPoint._leaflet_pos.y + 1,
            };

            // (Ix * J) - (J - Jx)
            var tilePixelIndex = (tilePoint.y * _this._canvasSize.width) -
                (_this._canvasSize.width - tilePoint.x);

            imgDatakeys.forEach(function(imgDatakey) {
                var variableData = tileImageData[imgDatakey];
                if (variableData) {
                    imgDataValues[imgDatakey] = [
                        variableData.data[((tilePixelIndex * 4) - 3) - 1],
                        variableData.data[((tilePixelIndex * 4) - 2) - 1],
                        variableData.data[((tilePixelIndex * 4) - 1) - 1],
                        variableData.data[((tilePixelIndex * 4)) - 1],
                    ];
                } else {
                    imgDataValues[imgDatakey] = [null, null, null, null];
                }
            });

        } else {
            imgDatakeys.forEach(function(imgDatakey) {
                imgDataValues[imgDatakey] = [null, null, null, null];
            });
        }

        return imgDataValues;

    },
    /**
     * Renderiza camada de classificação
     * @param  {Canvas} canvas      canvas do tile
     * @param  {Object} imagesData  coordenada x do tile
     */
    _renderClassification: function(canvas, data) {

        var _this = this;

        if (!this._tiles[data.x + ":" + data.y]) {
            return;
        }

        /*
        var latLng = this._map
            .layerPointToLatLng(this._tiles[data.x + ":" + data.y]._leaflet_pos);
        */

        // nova instancia imagedata vazio para a imagem resultante
        var resultImageData = canvas.getContext('2d')
            .createImageData(this._canvasSize.width, this._canvasSize.height);

        // chaves de camadas declaradas
        var vlayersKeys = Object.keys(this.options.layers);

        // percorre dados da imagem por valores rgba
        for (var i = 0; i < resultImageData.data.length; i += 4) {

            var rgbaData = {
                tile: {
                    x: data.x,
                    y: data.y
                },
                data: {}
            };

            // valores para todas as camadas declaradas
            for (var li = 0; li < vlayersKeys.length; li++) {
                try {
                    rgbaData.data[vlayersKeys[li]] = [
                        data.imagesData[vlayersKeys[li]].data[i],
                        data.imagesData[vlayersKeys[li]].data[i + 1],
                        data.imagesData[vlayersKeys[li]].data[i + 2],
                        data.imagesData[vlayersKeys[li]].data[i + 3]
                    ];

                } catch (e) {
                    rgbaData.data[vlayersKeys[li]] = [0,0,0,0];
                }
            }

            // resultado da classificação declarada
            var result = this.options.classification(rgbaData);

            result = _this._filterResult(result);

            resultImageData.data[i] = result[0];
            resultImageData.data[i + 1] = result[1];
            resultImageData.data[i + 2] = result[2];
            resultImageData.data[i + 3] = result[3];
        }

        canvas.getContext("2d").putImageData(resultImageData, 0, 0);

        _this._tilesResultData[data.x + ":" + data.y] = resultImageData;

        this.tileDrawn(canvas);
    },
    /**
     * Carrega dados das imagens formam a camada decisiontree
     * @param  {Canvas} canvas   canvas do tile
     * @param  {Integer} x       coordenada x do tile
     * @param  {Integer} y       coordenada y do tile
     * @param  {Integer} z       zoom do tile
     */
    _loadImagesData: function(params, callback) {

        var _this = this;

        // camadas de valor
        var vlayers = _this.options.layers;

        // coodenadas
        var x = params.x;
        var y = params.y;
        var zoom = params.zoom;

        // dimensões
        var width = _this._canvasSize.width;
        var height = _this._canvasSize.height;

        _this._tilesImgData[x + ":" + y] = {};

        // evento de conclusão de carregamento da imagem
        var imgOnLoad = function(e) {

            var imgv = e.target;

            imgv.loadStatus = "loaded";

            var canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');

            ctx.drawImage(imgv, 0, 0);

            var imgvData = ctx.getImageData(0, 0, width, height);

            if (!_this._tilesImgData[x + ":" + y]) {
                _this._tilesImgData[x + ":" + y] = {};
            }

            _this._tilesImgData[x + ":" + y][imgv.vlayer] = imgvData;

            _this._checkTileImgsLoaded(x, y, zoom, callback);

            _this._updateProgress();
        };

        // evento de erro de carregamento da imagem
        var imgOnError = function(e) {
            var imgv = e.target;
            imgv.loadStatus = "error";
            setTimeout(function() {
                imgv.load();
                _this._updateProgress();
            }, 2000);
        };

        // instancia imagem para cada camada de valor
        $.each(vlayers, function(keyLayer, value) {

            var imgv = new Image();

            imgv.width = width;
            imgv.height = height;

            imgv.setAttribute('crossOrigin', '');

            imgv.onload = imgOnLoad;
            imgv.onerror = imgOnError;
            imgv.vlayer = keyLayer;
            imgv.x = x;
            imgv.y = y;

            imgv.load = function() {
                imgv.src = _this._factoryImgUrl(vlayers[keyLayer].url, x, y, zoom);
                imgv.loadStatus = "loading";
            };

            _this._tilesImg.push(imgv);

            imgv.load();
        });
    },
    /**
     * Executa quando cada imagem de dados é carreda e verifica se todas foram carregadas
     * @param  {Integer}  x         coordenada x do tile
     * @param  {Integer}  y         coordenada y do tile
     * @param  {Integer}  zoom      zoom do tile
     * @param  {Function} callback  função que executa quando todas as imagens do tile forem carredadas
     */
    _checkTileImgsLoaded: function(x, y, zoom, callback) {
        var imagesData = this._tilesImgData[x + ":" + y];
        if (Object.keys(imagesData).length == Object.keys(this.options.layers).length) {
            callback({
                x: x,
                y: y,
                zoom: zoom,
                imagesData: imagesData
            });
        }
    },
    /**
     * Constroí url da imagem com as coodenadas
     * @param  {String}  url     canvas do tile
     * @param  {Integer} x       coordenada x do tile
     * @param  {Integer} y       coordenada y do tile
     * @param  {Integer} z       zoom do tile
     * @return {String}          url com as coordenadas
     */
    _factoryImgUrl: function(url, x, y, zoom) {
        url = url.replace('{x}', x);
        url = url.replace('{y}', y);
        url = url.replace('{z}', zoom);
        return url;
    },
    /**
     * Filtra cores do resultado da classificacao
     * @param  {Array}  result  array rgb
     * @return {Array}         array rgb
     */
    _filterResult: function(result) {

        var _this = this;

        if (_this._filterColors.length == 0) {
            return result;
        }

        for (var i = 0; i < _this._filterColorsRgb.length; i++) {
            var color = _this._filterColorsRgb[i];
            var iscolor = (color[0] == result[0]) &&
                (color[1] == result[1]) &&
                (color[2] == result[2]);
            if (iscolor) {
                result[3] = 0;
                break;
            }
        }

        return result;
    },
    _indexArrayToLatLng: function(index, x, y, width) {

        var p = (index / 4) + 1;

        var tilePixelX = Math.ceil(p / width);
        var tilePixelY = (p % width) != 0 ? p % width : width;

        var leafletPixelX = this._tiles[x + ":" + y]._leaflet_pos.x + tilePixelX;
        var leafletPixelY = this._tiles[x + ":" + y]._leaflet_pos.y + tilePixelY;

        var latLng = this._map.layerPointToLatLng(L.point(leafletPixelX, leafletPixelY));

        return latLng;
    },
    _updateProgress: function() {

        var _this = this;

        var perc;

        var countStatus = {
            total: _this._tilesImg.length,
            loaded: 0,
        };

        _this._tilesImg.forEach(function(img) {
            if (img.loadStatus == "loaded") {
                countStatus.loaded++;
            }
        });

        perc = Math.round((countStatus.loaded / countStatus.total) * 100);

        if (!perc) {
            perc = 0;
        }

        if (_this.updateProgress) {
            _this.updateProgress(perc);
        }
    }
});