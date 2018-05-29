L.TileLayer.GeeScript = L.TileLayer.extend({    
    /**
     * Incializa o objeto
     * @param  {Object} options   objeto de opçoes de configurações e parâmetros
     */
    initialize: function (geescript, options) {
		
		options = L.setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);
			options.zoomOffset++;

			if (options.minZoom > 0) {
				options.minZoom--;
			}
			this.options.maxZoom--;
		}

		if (options.bounds) {
			options.bounds = L.latLngBounds(options.bounds);
		}

		this._url = '';
		
		this._geescript = geescript;

		var subdomains = this.options.subdomains;

		if (typeof subdomains === 'string') {
			this.options.subdomains = subdomains.split('');
		}
	},
	onAdd: function (map) {

		var _this = this;

		setTimeout(function(){
			_this._geescript(function(url){			
				_this.setUrl(url);
			});
		},1000);		
		
		this._map = map;
		this._animated = map._zoomAnimated;

		// create a container div for tiles
		this._initContainer();

		// set up events
		map.on({
			'viewreset': this._reset,
			'moveend': this._update
		}, this);

		if (this._animated) {
			map.on({
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnim
			}, this);
		}

		if (!this.options.updateWhenIdle) {
			this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
			map.on('move', this._limitedUpdate, this);
		}

		this._reset();
		this._update();
	},
	reprocess:function(){		
		var _this = this;				
		setTimeout(function(){
			_this._geescript(function(url){			
				_this.setUrl(url);
				_this.redraw();
			});
		},1000);
	}
});