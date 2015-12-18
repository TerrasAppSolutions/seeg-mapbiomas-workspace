L.Control.InspectPixel = L.Control.extend({
  options: {
      position: 'bottomleft',
      latitudeText: 'lat.',
		  longitudeText: 'lon.',
  		rText: 'R. ',
  		gText: 'G. ',
      bText: 'B. ',
  		aText: 'a. ',
  		promptText: 'Passe o mouse sobre o mapa',
  		precision: 4
  },
  initialize: function (layer) {
    this.layer = layer;
  },
  onAdd: function(map){
		var className = 'leaflet-control-coordinates';
		var that = this;
		var container = this._container = L.DomUtil.create('div', className);
		this.visible = false;

		L.DomUtil.addClass(container, 'hidden');

		L.DomEvent.disableClickPropagation(container);

		this._addText(container, map);

    //document.getElementById('workmap').style.cursor = "crosshair";
		map.on('mousemove', this._onMouseMove, this);

		return container;
	},
  show: function(){

  },
  setLayer: function(layer){

  },
  onRemove: function (map) {
    map.off('mousemove', this._onMouseMove);
  },
  _onMouseMove: function (e) {
    //$(e.target).css('cursor','crosshair');
    //e.target.container.style.cursor = "crosshair";
    var lat = L.DomUtil.get(this._lat);
    var lng = L.DomUtil.get(this._lng);

    var rgba = this._getPixelByLayerPoint(e.layerPoint);

    if(rgba){
      if (!this.visible) {
        L.DomUtil.removeClass(this._container, 'hidden');
      }
      //=================================================================================================
      var shade = Math.ceil(100 - (rgba.gv + rgba.npv + rgba.soil + rgba.cloud));
      var gvs   = Math.ceil(100 * (rgba.gv / (100 - shade)));
      var ndfi  = (gvs - (rgba.npv + rgba.soil + rgba.cloud)) / (gvs + (rgba.npv + rgba.soil + rgba.cloud));
      ndfi = Math.ceil((ndfi * 100) + 100);

      // ( shade < 0 ) ? shade = 0: (shade > 100)? shade = 100);

      if (shade < 0) {shade = 0;} else if (shade > 100){shade = 100;} // TODO: Ajusta
      if (gvs < 0)   {gvs = 0;} else if (gvs > 100) {gvs = 100;}
      if (rgba.gv < 0) {rgba.gv = 0;} else if (rgba.gv > 100) {rgba.gv  = 100;}
      if (rgba.npv < 0) {rgba.npv = 0;} else if (rgba.npv > 100) {rgba.npv = 100;}
      if (rgba.soil < 0) {rgba.soil = 0;} else if (rgba.soil > 100) {rgba.soil = 100;}
      if (rgba.cloud < 0) {cloud = 0;} else if (rgba.cloud > 100) {rgba.cloud = 100;}
      if (ndfi < 0)  {ndfi = 0;} else if (ndfi > 200) {ndfi = 200;}

      if(isNaN(shade)){
        shade = "...";
      }

      if(isNaN(gvs)){
        gvs = "...";
      }

      if(isNaN(ndfi)){
        ndfi = "...";
      }

      //=================================================================================================

      L.DomUtil.get(this._lat).innerHTML =
        '<strong class="md-body-1" style="color: black; background: white; margin-botton: 16px;">' +
            ' ndfi:  ' + ndfi +
            ' <br>  gvs:   ' + gvs +
            ' <br>  gv:    ' + rgba.gv +
            ' <br>  npv:   ' + rgba.npv +
            ' <br>  soil:  ' + rgba.soil +
            ' <br>  cloud: ' + rgba.cloud +
            ' <br>  shade: ' + shade + '</strong>';
    }

  },
  _getPixelByLayerPoint: function(point){
    for(var c in this.layer.tiles) {
        var ctx = this.layer.tiles[c].getContext("2d");

        var pos = this.layer.tiles[c].pos();

        var bx = point.x >= pos.left &&  point.x <= (pos.left + 256);
        var by = point.y >= pos.top &&  point.y <= (pos.top + 256);

        if(bx && by){
          var xInCanvas = point.x - pos.left;
          var yInCanvas = point.y - (pos.top-49);
          var fractions = this.layer.getCanvasFractions(c, xInCanvas, yInCanvas);
          if(fractions){
            return fractions;
          }
          //var pixel = ctx.getImageData(xInCanvas, yInCanvas, 1, 1);

          // if(pixel){
          //     return pixel.data;
          // }
        }
    }
  },
  _addText: function(container, context){
		this._lat = L.DomUtil.create('span', 'leaflet-control-coordinates-lat' , container),
		this._lng = L.DomUtil.create('span', 'leaflet-control-coordinates-lng' , container);

		return container;
	},
	setCoordinates: function(obj){

	}
});

L.Map.mergeOptions({
    positionControl: false
});

L.Map.addInitHook(function () {
    if (this.options.positionControl) {
        this.positionControl = new L.Control.MousePosition();
        this.addControl(this.positionControl);
    }
});

L.Control.InspectPixelControl = function(canvasDTreeLayer){
	return new L.Control.InspectPixel(canvasDTreeLayer);
}
