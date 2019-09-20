/**
 * Service for bands
 * @argument bands bands
 */

'use strict';

angular.module('MapBiomas.services').factory('BandCustomService', [
    function () {
        var season = {};

        var BandCustomService = {
            getBands: function () {
                return angular.copy(availableBands);
            },
            resetSeason: function () {
                season = {};
            },
            /**
             * 
             * @param {bands} bands feature space
             * @param {featuresDictionary} featuresDictionary caso seja edição ou exibição
             * @param {controlDisable} controlDisable controla habilitação ou não / if true -> desabilita
             */
            generateTree: function (bands, featuresDictionary, controlDisable) {
                // var bandas = angular.copy(availableBands);

                var bands = angular.copy(bands);

                console.log("BANDS", bands);
                
                
                for (var i = 0; i < bands.length; i++) {
                    bands[i] = bands[i].FeatureSpace;
                    bands[i].parentId = bands[i].parent_id;                   
                    bands[i]._id = bands[i].valor;                   
                }
                
                
                var bandas = angular.copy(bands);

                bandas.sort(function (a, b) {
                    return a.parentId - b.parentId;
                });

                var tree = {};
                
                for (var i = 0; i < bandas.length; i++) {
                    var elem = bandas[i];
                    var seasonChecked = {};
                    var checkDisabled = {};
                    // var elem = bandas[i].FeatureSpace;

                    
                    // se existir features dictionary para mapear árvore pre-selecionadas
                    if (featuresDictionary) {
                        if (controlDisable) {
                            checkDisabled['wet'] = 'disabled';
                            checkDisabled['dry'] = 'disabled';
                            checkDisabled['none'] = 'disabled';
                        }
                        if (featuresDictionary[elem.id]) {

                            featuresDictionary[elem.id].season.forEach(function (value, key) {
                                // console.log("key", key);
                                // console.log("value", value);
                                seasonChecked[value] = 'checked';                                
                                checkDisabled[value] = '';

                                // map season object
                                if (!season[elem.id]) {
                                    season[elem.id] = {};
                                }
                                // console.log("ELEM", elem);
                                
                                season[elem.id][value] = true;
                                // console.log("elem", elem);
                                
                            });
                        }
                    }
                    

                    if (!elem.parentId) {
                        tree[elem._id] = elem;
                        tree[elem._id].children = [];
                        tree[elem._id].state = {
                            'opened': true
                        };
                        continue;
                    }

                    elem.data = {
                        dry: {
                            name: 'season-' + String(i),
                            class: 'season-control',
                            value: 'dry',
                            id: elem._id,
                            band: elem.band,
                            checked: seasonChecked['dry'],
                            disabled: checkDisabled['dry']
                        },
                        wet: {
                            name: 'season-' + String(i),
                            class: 'season-control',
                            value: 'wet',
                            id: elem._id,
                            band: elem.band,
                            checked: seasonChecked['wet'],
                            disabled: checkDisabled['wet']
                        },
                        none: {
                            name: 'season-' + String(i),
                            class: 'season-control',
                            value: 'none',
                            id: elem._id,
                            band: elem.band,
                            checked: seasonChecked['none'],
                            disabled: checkDisabled['none']
                        },
                    }
                    // elem.data = {
                    //     dry: 'season-' + String(i),
                    //     wet: 'season-' + String(i),
                    //     none: 'season-' + String(i),
                    // }

                    tree[elem.parentId].children.push(elem);
                }

                var result = [];

                for (var key in tree) {
                    result.push(tree[key]);
                }

                return result;
            },
            getSelectedBands: function (tree) {
                var allBands = $(tree).jstree("get_selected", true);

                var bandsSelected = [];

                for (var i = 0; i < allBands.length; i++) {
                    var band = allBands[i];

                    if (!isInArray(band.text, ['Amp', 'Median', 'Min', 'stdDev'])) {
                        bandsSelected.push(band.text);
                    }
                }                

                return JSON.stringify(bandsSelected);
            },
            getBands: function () {
                var bands = [];
                // var bands = {};

                // var allBandsSelected = $("#tree").jstree("get_selected", true);
                // console.log("ALL", allBandsSelected);

                var allBands = $('#tree').jstree(true).get_json('#', {
                    flat: true
                });
                // console.log("treeData", allBands);

                var objBandsId = translateToObjectReference(allBands);
                console.log("objBandsId", objBandsId);

                /* for (var i = 0; i < allBandsSelected.length; i++) {
                    var band = allBandsSelected[i];
                    // console.log("band", band);

                    if (!isInArray(band.text, ['Amp', 'Median', 'Min', 'stdDev'])) {

                        if (!bands[objBandsId[band.parent].text]) {
                            bands[objBandsId[band.parent].text] = [];
                        }

                        bands[objBandsId[band.parent].text].push({
                            'text': band.text,
                            'season': objBandsId[band.id].season
                        });
                    }
                } */

                console.log("EL", season);
                for (var s in season) {
                    var all = [];

                    for (var x in season[s]) {
                        if (season[s][x] == true) {
                            all.push(x);
                        }
                    }

                    // caso não possua nenhum elemento
                    if (!all.length) {
                        continue;
                    }

                    // if (!bands[objBandsId[objBandsId[s].parent].text]) {
                    //     bands[objBandsId[objBandsId[s].parent].text] = [];
                    // }

                    // bands[objBandsId[objBandsId[s].parent].text].push({
                    //     'text': objBandsId[s].text,
                    //     'season': all
                    // });
                    bands.push({
                        'id': objBandsId[s].id,
                        'text': objBandsId[s].text,
                        'season': all,
                        'reduce': objBandsId[objBandsId[s].parent].text,
                        'parent_id': objBandsId[objBandsId[s].parent].id
                    });
                }

                console.log("bands", bands);


                return bands;
                // return JSON.stringify(bands);
            },
            checkSeason: function () {
                setTimeout(function () {
                    $('input[class=season-control]').change(function (e) {
                        // console.log("TESTEEEEE", $(this).attr("data-value"))
                        // console.log("TESTEEEEE", $(this).parent().parent().attr("data-jstreetable"));
                        // console.log("TESTEEEEE", this.checked);
                        // console.log("TESTEEEEE", $(this).parent().parent().children());

                        var id = $(this).parent().parent().attr("data-jstreetable");
                        var value = $(this).attr("data-value");
                        var checked = this.checked;

                        // season[id] = {
                        //     value: $(this).attr("data-value")
                        // };

                        if (!season[id]) {
                            season[id] = {};
                        }

                        season[id][value] = checked

                        console.log("season", season);

                    });
                }, 500);
            },
            createJsTreeTable: function (data) {

                // console.log("DATA", data);


                // se a árvore já existe, ela é removida
                if ($('#tree')) {
                    $('#tree').remove();
                }

                // remove tree table também
                if ($('.jstree-table-wrapper')) {
                    $('.jstree-table-wrapper').remove();
                }

                $('#append-jstreetable').append('<div id="tree"></div>')

                // tree for bands
                $("#tree").jstree({
                    "checkbox": {
                        "keep_selected_style": false,
                        'cascade': "",
                    },
                    //"plugins": ["checkbox"],
                    // "plugins": ["checkbox", "table", "dnd", "contextmenu", ],
                    "plugins": ["table", "dnd", "contextmenu", ],
                    "core": {
                        'data': data,
                        "themes": {
                            "icons": false
                        },
                    },
                    // configure tree table
                    "table": {
                        columns: [{
                                width: 200,
                                header: "Bands"
                            },
                            {
                                width: 100,
                                value: "dry",
                                header: "Dry",
                                format: function (v) {
                                    if (v) {
                                        return '<input type="checkbox" name="' + v.name + '" class="' + v.class + '" data-value="' + v.value + '" data-id="' + v.id + '" ' + v.checked + ' ' + v.disabled + '>'
                                    }
                                }
                            },
                            {
                                width: 100,
                                value: "wet",
                                header: "Wet",
                                format: function (v) {
                                    if (v) {
                                        return '<input type="checkbox" name="' + v.name + '" class="' + v.class + '" data-value="' + v.value + '" data-id="' + v.id + '" ' + v.checked + ' ' + v.disabled + '>'
                                    }
                                }
                            },
                            {
                                width: 100,
                                value: "none",
                                header: "None",
                                format: function (v) {
                                    if (v) {
                                        return '<input type="checkbox" name="' + v.name + '" class="' + v.class + '" data-value="' + v.value + '" data-id="' + v.id + '" ' + v.checked + ' ' + v.disabled + '>'
                                    }
                                }
                            }
                        ],
                        resizable: false,
                        draggable: false,
                        contextmenu: true,
                        width: 303,
                        height: 300
                    }
                });

                this.checkSeason();
            },
            /**
             * Recebe um array e retorna um objeto que toma como referência o id
             * @param {translateToObjectReference} array 
             */
            translateToObjectReference: function (array) {
                var obj = {};
                for (var i = 0; i < array.length; i++) {
                    var element = array[i];
                    console.log("element", element);
                    obj[element.id] = element;
                    // obj[element.text] = element;
                }
                return obj;
            }
        };

        function isInArray(value, array) {
            return array.indexOf(value) > -1;
        }

        /**
         * Recebe um array e retorna um objeto que toma como referência o id
         * @param {translateToObjectReference} obj 
         */
        function translateToObjectReference(array) {
            var obj = {};
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                obj[element.id] = element;

                // ajusta valores que não estão presentes
                // if (!season[element.id]) {
                //     season[element.id] = {
                //         value: ''
                //     };
                // }

                // obj[element.id].season = season[element.id].value;
            }
            return obj;
        } 

        return BandCustomService;

    }
]);