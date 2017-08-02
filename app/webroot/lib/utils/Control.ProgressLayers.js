var progress_image_div;

L.Control.ProgressLayers = L.Control.extend({
  options: {
    // topright, topleft, bottomleft, bottomright
    position: 'topright'
  },
  onAdd: function (map) {
    // happens after added to map
    var container_progress = 'container_progress';
    var progress_image = 'progress_image';

    var container_progress_div = L.DomUtil.create('div', container_progress);

    progress_image_div = L.DomUtil.create('div', progress_image);

    L.DomUtil.get(container_progress_div).appendChild(progress_image_div);



    return container_progress_div;
  },
  setProgress: function(progress){
    L.DomUtil.get(progress_image_div).style.width = (progress*100)+"%";
  }
  //onRemove: function (map) {
  //   // when removed
  //}
});

L.control.progressLayers = function() {
  return new L.Control.ProgressLayers();
}
