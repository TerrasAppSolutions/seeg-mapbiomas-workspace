L.TileLayer.Dtree = L.TileLayer.Canvas.extend({
  options: {
    async: true,
    unloadInvisibleTiles: true,
    updateWhenIdle: true,
  },
  EARTH_ENGINE_TILE_SERVER: 'https://earthengine.googleapis.com/map/',
  initialize: function () {
        this.tiles = {};
        this.mask_images_list = {};
        this.v1 = this.v1 || 40;
        this.v2 = this.v2 || 70;
        this.v3 = this.v3 || 170;
        this.v4 = this.v4 || 190;
        this.show_water = 255;
        this.show_nonforest = 255;
        this.show_forest = 255;
        this.loadImagesGv = new ImageLoad();
        this.loadImagesCloud = new ImageLoad();
        this.loadImagesSoil = new ImageLoad();
        this.loadImagesNpv = new ImageLoad();
        this.loadImagesClassification = new ImageLoad();
        this.progress = (this.loadImagesGv.p + this.loadImagesCloud.p + this.loadImagesSoil.p + this.loadImagesNpv.p + this.loadImagesClassification.p)/5;
        this.progressLayersControl = L.control.progressLayers();
  },
  progressCalc: function(){
    this.progress = (this.loadImagesGv.p + this.loadImagesCloud.p + this.loadImagesSoil.p + this.loadImagesNpv.p + this.loadImagesClassification.p)/5;

    // if(this.progress < 1.0){
    //   this.progressLayersControl.setProgress(this.progress);
    // }

    console.log("Progress: "+this.progress);
  },
  onAdd: function(map){
    this._map = map;
    this.tiles = {};
    this.mask_images_list = {};

    this.on("tileunload", function(e) {
            if(e.tile._tileIndex){
                var pos = e.tile._tileIndex,
                tileID = [pos.x, pos.y, pos.z].join('_');
                delete this.tiles[tile_id];
                if(tileID in this.tiles){
                     this.tiles[tile_id].parentNode.removeChild(this.tiles[tile_id]);
                     delete this.tiles[tile_id];
                     delete this.mask_images_list[tile_id];
                }
            }
        });

    this._map.on("zoomstart",function() {
            this.tiles = {};
            this.mask_images_list = {};
        }, this);

    return L.TileLayer.Canvas.prototype.onAdd.call(this, this._map);
  },
  drawTile: function(canvas, tilePoint, zoom) {
      // if(Object.keys(this.tiles).length === 0){
      //   this._map.addControl(this.progressLayersControl);
      //   this.loadImagesGv.restart();
      //   this.loadImagesCloud.restart();
      //   this.loadImagesSoil.restart();
      //   this.loadImagesNpv.restart();
      //   this.loadImagesClassification.restart();
      // }

      var tile_id = tilePoint.x + '_' + tilePoint.y + '_' + zoom;
      canvas.setAttribute('id', tile_id);

      if(tile_id in this.tiles) {
         delete this.tiles[tile_id];
      }

      this._setCanvasPos(canvas);
      this.tiles[tile_id] = canvas;

      this._create_extra_images(tilePoint, zoom);

      var that = this;
      this._load_extra_images(tilePoint, zoom, function(){
          var ctx = canvas.getContext('2d');
          canvas.image = new Image();
          canvas.coord = tilePoint;

          var key = "classification";
          var url_class = that.EARTH_ENGINE_TILE_SERVER+ that.mapIds[key] +'/'+ zoom + '/'+ tilePoint.x + '/' + tilePoint.y +'?token='+ that.tokens[key];
          that.loadImagesClassification.newImage(url_class, function(status){
            if (!status.err && document.getElementById(tile_id)) {
               if(that.tiles[tile_id]){
                 canvas.image = status.img;
                 ctx.drawImage(canvas.image, 0, 0);
                 that.tiles[tile_id].image_data = ctx.getImageData(0, 0, that.tiles[tile_id].width, that.tiles[tile_id].height);
                 that.filter_tile_canvas(that.tiles[tile_id], that.mask_images_list[tile_id]);
              }
            }
          }, that.progressCalc());
      });
  },
  _create_extra_images: function(tilePoint, zoom){
    var canvas_name = tilePoint.x + '_' + tilePoint.y + '_' + zoom;
    var extra_images = {};
    var keys = {'cloud': '', 'soil': '', 'npv': '','gv': '', 'elevationrescaled':''};

    for(var key in keys){
      extra_images[key] = {};
      extra_images[key].image = new Image();
    }

    this.mask_images_list[canvas_name] = extra_images;
  },
  _load_extra_images: function(tilePoint, zoom, callback){
    var loaded = {'gv': false, 'cloud': false, 'soil': false, 'npv': false};
    var canvas_name = tilePoint.x + '_' + tilePoint.y + '_' + zoom;
    var extra_images = this.mask_images_list[canvas_name];
    var that = this;

    //TODO: Inserir um loop aqui
    if(extra_images){

      //for(var key in extra_images){

      var key_gv = "gv";
      var url_gv = this.EARTH_ENGINE_TILE_SERVER + this.mapIds[key_gv] + "/"+ zoom + "/"+ tilePoint.x + "/" + tilePoint.y +"?token=" + this.tokens[key_gv];
      this.loadImagesGv.newImage(url_gv, function(status){
        if (!status.err) {
           loaded[key_gv] = true;

           if(!(false in _.values(loaded))){
             if(that.tiles[canvas_name]){
               extra_images[key_gv].image = status.img;
               var ctx = that.tiles[canvas_name].getContext("2d");
               ctx.drawImage(status.img, 0 , 0);
               extra_images[key_gv].imagedata = ctx.getImageData(0, 0, that.tiles[canvas_name].width, that.tiles[canvas_name].height);
               callback();
             }
           }
        }
      }, this.progressCalc());

      var key_cloud = "cloud";
      var url_cloud = this.EARTH_ENGINE_TILE_SERVER + this.mapIds[key_cloud] + "/"+ zoom + "/"+ tilePoint.x + "/" + tilePoint.y +"?token=" + this.tokens[key_cloud];
      this.loadImagesCloud.newImage(url_cloud, function(status){
        if (!status.err) {
           loaded[key_cloud] = true;
           if(!(false in _.values(loaded))){
             if(that.tiles[canvas_name]){
               extra_images[key_cloud].image = status.img;
               var ctx = that.tiles[canvas_name].getContext("2d");
               ctx.drawImage(status.img, 0 , 0);
               extra_images[key_cloud].imagedata = ctx.getImageData(0, 0, that.tiles[canvas_name].width, that.tiles[canvas_name].height);
               callback();
             }
           }
        }
      }, this.progressCalc());

      var key_soil = "soil";
      var url_soil = this.EARTH_ENGINE_TILE_SERVER + this.mapIds[key_soil] + "/"+ zoom + "/"+ tilePoint.x + "/" + tilePoint.y +"?token=" + this.tokens[key_soil];
      this.loadImagesSoil.newImage(url_soil, function(status){
        if (!status.err) {
           loaded[key_gv] = true;

           if(!(false in _.values(loaded))){
             if(that.tiles[canvas_name]){
               extra_images[key_soil].image = status.img;
               var ctx = that.tiles[canvas_name].getContext("2d");
               ctx.drawImage(status.img, 0 , 0);
               extra_images[key_soil].imagedata = ctx.getImageData(0, 0, that.tiles[canvas_name].width, that.tiles[canvas_name].height);
               callback();
             }
           }
        }
      }, this.progressCalc());

      var key_npv = "npv";
      var url_npv = this.EARTH_ENGINE_TILE_SERVER + this.mapIds[key_npv] + "/"+ zoom + "/"+ tilePoint.x + "/" + tilePoint.y +"?token=" + this.tokens[key_npv];
      this.loadImagesNpv.newImage(url_npv, function(status){
        if (!status.err) {
           loaded[key_npv] = true;

           if(!(false in _.values(loaded))){
             if(that.tiles[canvas_name]){
               extra_images[key_npv].image = status.img;
               var ctx = that.tiles[canvas_name].getContext("2d");
               ctx.drawImage(status.img, 0 , 0);
               extra_images[key_npv].imagedata = ctx.getImageData(0, 0, that.tiles[canvas_name].width, that.tiles[canvas_name].height);
               callback();
             }
           }
        }
      }, this.progressCalc());
    }
  },
  loadImg: function(img, url,callback) {
      var that = this;

      $(img).load(function() {
            if (img.complete) {
                if (img.width && img.height) {
                    callback({
                        img: img
                    });
                    return;
                }
                callback({
                    err: '429'
                });
                return;
            }
      }).error(function(e) {
            img.src = url;
      });

      img.src = url;
  },
  loadNewImg: function(url,callback) {
      var that = this;
      var img = new Image();
      img.crossOrigin = '';

      $(img).load(function() {
            if (img.complete) {
                if (img.width && img.height) {
                    callback({
                        img: img
                    });
                    return;
                }
                callback({
                    err: '429'
                });
                return;
            }
      }).error(function(e) {
            img.src = url;
      });

      img.src = url;
  },
  setFilter: function(vv1, vv2, vv3, vv4){
    this.v1 = vv1;
    this.v2 = vv2;
    this.v3 = vv3;
    this.v4 = vv4;
    this.filter_tiles_canvas();
  },
  filter_tile_canvas: function(canvas, mask_images) {
        var mask_images_data = {};
        var ctx = canvas.getContext('2d');

        for(var key in mask_images){
          if(mask_images[key].imagedata){
            mask_images_data[key] = mask_images[key].imagedata.data;
          }
        }

        if(canvas.image_data){
          this.filter(canvas.image_data.data, mask_images_data, canvas.width, canvas.width);
          ctx.putImageData(canvas.image_data,0,0);
          this.tileDrawn(canvas);
        }

  },
  filter_tiles_canvas: function() {
      var tile_id = "";
      var that = this;
      Object.keys(this.tiles).reduce(function(previous, key){
            that.filter_tile_canvas(that.tiles[key], that.mask_images_list[key]);
            return previous;
      }, {value: 0});
  },
  class_visibility: function(layer_id, enabled) {
        if(enabled === false){
          this['show_' + layer_id] = 255;
        }else{
          this['show_' + layer_id] = 0;
        }
        this.filter_tiles_canvas();
  },
  filter: function(image_class, mask_images, w, h) {
      var components = 4; //rgba
      var FOREST_COLOR =    [ 11, 98,  56, 255];
      var WATER_COLOR =     [  0,  0, 255, 255];
      var NONFOREST_COLOR = [  0,  0,   0, 255];

      if(!mask_images.gv || !mask_images.npv || !mask_images.soil || !mask_images.cloud){
        return;
      }


      var pp; // pixel position
      var isWater = 0;
      var ndfi = [];

      var show_water = this.show_water;
      var show_nonforest = this.show_nonforest;
      var show_forest = this.show_forest;

      var pp,a,p_gv,p_npv,p_soil,p_cloud,p_shd,p_gvs,p_ndfi,isWater;

      for(var i=0; i < w; ++i) {
          for(var j=0; j < h; ++j) {
              pp = (j*w + i) * components;
              a = image_class[pp + 3];

              p_gv    = mask_images.gv[pp];
              p_npv   = mask_images.npv[pp];
              p_soil  = mask_images.soil[pp];
              p_cloud = mask_images.cloud[pp];
              p_shd = 100 - (p_gv + p_npv + p_soil + p_cloud)
              p_gvs = 100 * (p_gv / (100 - p_shd));

              p_ndfi = (p_gvs - (p_npv + p_soil + p_cloud))/(p_gvs + (p_npv + p_soil + p_cloud));
              p_ndfi = (p_ndfi * 100) + 100;

              /* Regras da árvore de decisão */
              isWater = p_shd >= 65 && p_gvs <= 15 && p_soil <= 5;


              if (isWater){ //TODO: inserir a fração SOIL
                    image_class[pp + 0] = WATER_COLOR[0];
                    image_class[pp + 1] = WATER_COLOR[1];
                    image_class[pp + 2] = WATER_COLOR[2];
                    image_class[pp + 3] = show_water;
                } else if (!isWater && p_ndfi > this.v4){
                    image_class[pp + 0] = FOREST_COLOR[0];
                    image_class[pp + 1] = FOREST_COLOR[1];
                    image_class[pp + 2] = FOREST_COLOR[2];
                    image_class[pp + 3] = show_forest;
                } else if (!isWater && p_ndfi <= this.v4 && p_gvs >= this.v1 && p_gv >= this.v2){
                    image_class[pp + 0] = NONFOREST_COLOR[0];
                    image_class[pp + 1] = NONFOREST_COLOR[1];
                    image_class[pp + 2] = NONFOREST_COLOR[2];
                    image_class[pp + 3] = show_nonforest;
                } else if (!isWater && p_ndfi <= this.v4 && p_gvs < this.v1){
                    image_class[pp + 0] = NONFOREST_COLOR[0];
                    image_class[pp + 1] = NONFOREST_COLOR[1];
                    image_class[pp + 2] = NONFOREST_COLOR[2];
                    image_class[pp + 3] = show_nonforest;
                } else if (!isWater && p_ndfi <= this.v4 && p_gvs >= this.v1 && p_gv < this.v2 && p_ndfi <= this.v3){
                    image_class[pp + 0] = NONFOREST_COLOR[0];
                    image_class[pp + 1] = NONFOREST_COLOR[1];
                    image_class[pp + 2] = NONFOREST_COLOR[2];
                    image_class[pp + 3] = show_nonforest;
                } else if (!isWater && p_ndfi <= this.v4 && p_gvs >= this.v1 && p_gv < this.v2 && p_ndfi > this.v3){
                    image_class[pp + 0] = FOREST_COLOR[0];
                    image_class[pp + 1] = FOREST_COLOR[1];
                    image_class[pp + 2] = FOREST_COLOR[2];
                    image_class[pp + 3] = show_forest;
                }

          }
      }

      delete pp,a,p_gv,p_npv,p_soil,p_cloud,p_shd,p_gvs,p_ndfi,isWater;
    },
    _setCanvasPos: function(canvas){
      canvas.pos =  function(){
        var obj = canvas;
        var top = 0;
        var left = 0;

        var tagName = " ";

        while (tagName != "BODY") {
          top += obj.offsetTop;
          left += obj.offsetLeft;
          obj = obj.offsetParent;
          if(obj != null){
             tagName = obj.tagName;
          }else{
            tagName = "BODY";
          }
        }
        return {
          top: top,
          left: left
        };
      };

    },
    getCanvasFractions: function(canvas_name, x, y){
      var fractions = {};
      var extra_canvas = this.mask_images_list[canvas_name];
      var pixel = (y*256 + x);
      if(extra_canvas){
        for(var f in extra_canvas){
            if(extra_canvas[f].imagedata){

              var imagedata = extra_canvas[f].imagedata;

              fractions[f] = imagedata.data[pixel + 0];

            }else{
              fractions[f] = "...";
            }
        }

        return fractions;
      }else{
        return;
      }
    }
});
L.tileLayer.dtree = function(canvas_setup, filter){
  return new L.TileLayer.Dtree(canvas_setup, filter);
}
