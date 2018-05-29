angular.module('MapBiomas.wgis', []);

angular.module('MapBiomas.wgis').factory('Wgis', [
    function () {

        var Wgis = function () {
            var _wgisCtrl = this;

            this.wgis = {};

            this.setWgis = function (wgis) {
                _wgisCtrl = $.extend(_wgisCtrl, wgis);
                events.onLoad();
            };

            this.onLoad = function (callback) {
                events.onLoad = callback;
            };

            var events = {
                onLoad: function () {}
            };
        };

        return new Wgis();
    }
]);

angular.module('MapBiomas.wgis').factory('StylesGeoJSON', [
    function () {
        var styles = {
            APRT: {
                fillColor: null,
                fillOpacity: 0,
                color: "#dffc10",
                opacity: 1,
                weight: 3,
                className: "feature feature-aprt"
            },
            AUAS: {
                fillColor: 'url(#pattern-auas)',
                fillOpacity: '0.8',
                color: '#000000',
                opacity: 1,
                weight: 3,
                className: "feature feature-auas"
            },
            APPD: {
                fillColor: '#F87C7C',
                fillOpacity: 1,
                color: "#9DACE5",
                opacity: 1,
                weight: 3,
                className: "feature feature-appd"
            },
            APP: {
                fillColor: 'url(#pattern-app)',
                fillOpacity: 1,
                color: "#6CD2F0",
                opacity: 1,
                weight: 3,
                className: "feature feature-app"
            },
            ARL: {
                fillColor: 'url(#pattern-arl)',
                fillOpacity: 1,
                color: "#000000",
                opacity: 1,
                weight: 3,
                className: "feature feature-arl"
            },
            talhao: {
                fillColor: 'url(#pattern-talhao)',
                fillOpacity: 1,
                color: "#B5802B",
                opacity: 1,
                weight: 1,
                className: "feature feature-talhao"
            },
            municipio: {
                fillColor: null,
                fillOpacity: 0,
                color: "#000000",
                opacity: 1,
                weight: 3,
                className: "feature feature-municipio"
            }
        };

        var patterns = "";
        patterns += "<svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" xmlns:xlink=\"http:\/\/www.w3.org\/1999\/xlink\" xml:space=\"preserve\"> ";
        patterns += "  <defs>";
        patterns += "    <pattern id=\"pattern-auas\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:black; stroke-width:1\">";
        patterns += "        <path d=\"M0,0 l10,10\"\/>";
        patterns += "        <path d=\"M10,0 l-10,10\"\/>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-arl\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:#CDCDCD; stroke-width:1\">";
        patterns += "        <path d=\"M 0,10 l 10,-10 M -2.5,2.5 l 5,-5M 7.5,12.5 l 5,-5\" stroke-width=\"1\" shape-rendering=\"auto\" stroke-linecap=\"square\"><\/path>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-app\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:#6CD2F0; stroke-width:1\">";
        patterns += "        <path d=\"M 0,10 l 10,-10 M -2.5,2.5 l 5,-5M 7.5,12.5 l 5,-5\" stroke-width=\"1\" shape-rendering=\"auto\" stroke-linecap=\"square\"><\/path>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-img\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <image xlink:href=\"APP.png\" x=\"0\" y=\"0\" width=\"10\" height=\"10\"> <\/image> ";
        patterns += "    <\/pattern>";
        patterns += "    <pattern id=\"pattern-talhao\" patternUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"10\" height=\"10\">";
        patterns += "        <g style=\"fill:none; stroke:#CE952B; stroke-width:1\">";
        patterns += "        <path d=\"M 0,10 l 10,-10 M -2.5,2.5 l 5,-5M 7.5,12.5 l 5,-5\" stroke-width=\"1\" shape-rendering=\"auto\" stroke-linecap=\"square\"><\/path>";
        patterns += "        <\/g>";
        patterns += "    <\/pattern>";
        patterns += "  <\/defs>    ";
        patterns += "<\/svg>";

        styles.patterns = patterns;

        return styles;
    }
]);