var opacity_layer;
var _layer_filtro_espacial;
var spatial_filter_div;

L.Control.OpacityClassification = L.Control.extend({
  options: {
    // topright, topleft, bottomleft, bottomright
    position: 'bottomleft'
  },
  setLayers: function (layer, layer_filtro_espacial) {
          opacity_layer = layer;
          _layer_filtro_espacial = layer_filtro_espacial;
  },
  onAdd: function (map) {
    // happens after added to map
    var control_container = 'control_container';
    var opacity_slider = 'slider_control';
    var class_spatial_filter = 'spatial_filter';


    var control_container_div = L.DomUtil.create('div', control_container);

    var opacity_slider_div = L.DomUtil.create('div', opacity_slider);

    L.DomUtil.get(opacity_slider_div).innerHTML = '<div style="margin-left: 10px; margin-top:5px; margin-bottom:5px;">Classification</div><div class="opacity_slider_control"></div>';


    //spatial_filter_div = L.DomUtil.create('div', class_spatial_filter);


    //L.DomUtil.get(spatial_filter_div).innerHTML = '<div style="padding-top: 5px; padding-left: 5px;"><input type="checkbox" id="isSpatialFilter" style="margin-right: 5px;"/><span id="checar">Filtro Espacial</span></div>';

    L.DomUtil.get(control_container_div).appendChild(opacity_slider_div);
    //L.DomUtil.get(control_container_div).appendChild(spatial_filter_div);

    $(opacity_slider_div.lastElementChild).slider({
      orientation: "horizontal",
      range: "min",
      min: 0,
      max: 100,
      value: 100,
      step: 5,
      start: function ( event, ui) {
        //When moving the slider, disable panning.
        map.dragging.disable();
        map.once('mousemove', function (e) {
          map.dragging.enable();
        });
      },
      slide: function ( event, ui ) {
        var slider_value = ui.value / 100;
        opacity_layer.setOpacity(slider_value);
      }
    });

    // L.DomUtil.get(spatial_filter_div).firstElementChild.firstElementChild.addEventListener("click", function(){
    //           if(this.checked){
    //              if(_layer_filtro_espacial){
    //                map.removeLayer(opacity_layer);
    //                map.removeLayer(_layer_filtro_espacial);
    //                map.addLayer(_layer_filtro_espacial);
    //                map.addLayer(opacity_layer);
    //              }
    //           }else{
    //              if(_layer_filtro_espacial){
    //                map.removeLayer(_layer_filtro_espacial);
    //              }
    //           }
    // });

    return control_container_div;
  },
  enableSpatialFilter: function(){
    L.DomUtil.get(spatial_filter_div).firstElementChild.firstElementChild.checked = false;
  }
  //onRemove: function (map) {
  //   // when removed
  //}
});

L.control.opacityclassification = function() {
  return new L.Control.OpacityClassification();
}
