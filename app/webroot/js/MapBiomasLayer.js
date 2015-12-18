L.TileLayer.MapBiomasLayer = L.TileLayer.Canvas.extend({
  options: {
    async: true,
    unloadInvisibleTiles: true,
    updateWhenIdle: true,
  },
  EARTH_ENGINE_TILE_SERVER: 'https://earthengine.googleapis.com/map/',
  initialize: function () {
        this.tiles = {};
        this.mapid = null;
        this.token = null;
        this.loadImagesLayer = new ImageLoad();
        this.progress = 0;

  },
  addData: function(mapid, token){
    this.mapid = mapid;
    this.token = token;
  },
  progressCalc: function(){
    this.progress = this.loadImagesLayer.p;

    console.log("Progress: "+this.progress);
  },
  resetting: function(mapid, token){
    this.mapid = mapid;
    this.token = token;
  },
  onAdd: function(map){
    this._map = map;
    this.tiles = {};

    this.on("tileunload", function(e) {
            if(e.tile._tileIndex){
                var pos = e.tile._tileIndex,
                tileID = [pos.x, pos.y, pos.z].join('_');
                delete this.tiles[tile_id];
                if(tileID in this.tiles){
                     this.tiles[tile_id].parentNode.removeChild(this.tiles[tile_id]);
                     delete this.tiles[tile_id];
                }
            }
        });

    this._map.on("zoomstart",function() {
            this.tiles = {};
        }, this);

    return L.TileLayer.Canvas.prototype.onAdd.call(this, this._map);
  },
  drawTile: function(canvas, tilePoint, zoom) {
      console.log("drawTile");
      var tile_id = tilePoint.x + '_' + tilePoint.y + '_' + zoom;
      canvas.setAttribute('id', tile_id);

      if(tile_id in this.tiles) {
         delete this.tiles[tile_id];
      }

      this._setCanvasPos(canvas);
      this.tiles[tile_id] = canvas;

      var that = this;

      var ctx = canvas.getContext('2d');
      canvas.image = new Image();
      canvas.coord = tilePoint;

      var url = this.EARTH_ENGINE_TILE_SERVER + this.mapid +'/'+ zoom + '/'+ tilePoint.x + '/' + tilePoint.y +'?token='+ this.token;
      this.loadImagesLayer.newImage(url, function(status){
        if (!status.err && document.getElementById(tile_id)) {
           if(that.tiles[tile_id]){
             canvas.image = status.img;
             ctx.drawImage(canvas.image, 0, 0);
          }
        }
      }, this.progressCalc());

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

    }
});
L.tileLayer.mapBiomasLayer = function(){
  return new L.TileLayer.MapBiomasLayer();
}
