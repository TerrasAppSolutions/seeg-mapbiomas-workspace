angular.module('MapBiomas.dtree')
     .factory('DtreeClasses', ['$filter',
        function($filter) {


            var classesV3 = [{
                id:1,
                cod:"1.",
                classe: $filter('translate')('FLORESTA'),
                color: "#274E13"
            },{
                id:2,
                cod:"1.1.",
                classe: $filter('translate')('FLORESTAINUNDADA'),
                color: "#619B48"
            },{
                id:3,
                cod:"1.2.",
                classe: $filter('translate')('FLORESTANAOINUNDADA'),
                color: "#8DBC77"
            },{
                id:4,
                cod:"2.",
                classe: $filter('translate')('ARBUSTAL'),
                color: "#FFC000"
            },{
                id:5,
                cod:"2.1.",
                classe: $filter('translate')('ARBUSTALINUNDADO'),
                color: "#F9CB9C"
            },{
                id:6,
                cod:"2.2",
                classe: $filter('translate')('ARBUSTALNAOINUNDADO'),
                color: "#7F6000"
            },{
                id:7,
                cod:"3.",
                classe: $filter('translate')('HERBACEA'),
                color: "#D85D3D"
            },{
                id:8,
                cod:"3.1.",
                classe: $filter('translate')('HERBACEAINUNDADO'),
                color: "#F6B26B"
            },{
                id:9,
                cod:"4.",
                classe: $filter('translate')('VEGETACAOCAMPESTRE'),
                color: "#7DFF2D"
            },{
                id:10,
                cod:"4.1.",
                classe: $filter('translate')('VEGETACAOCAMPESTREINUNDADO'),
                color: "#46FF87"
            },{
                id:11,
                cod:"4.2.",
                classe: $filter('translate')('VEGETACAOCAMPESTRENAOINUNDADO'),
                color: "#6D9EEB"
            },{
                id:12,
                cod:"5.",
                classe: $filter('translate')('OUTRASCOBERTURASNATURAIS'),
                color: "#B6D7A8"
            },{
                id:13,
                cod:"6.",
                classe: $filter('translate')('AREAMANEJADAOUCULTIVADA'),
                color: "#4C1130"
            },{
                id:14,
                cod:"6.1.",
                classe: $filter('translate')('MANEJOOUCULTIVOEMAREASINUNDADAS'),
                color: "#A64D79"
            },{
                id:15,
                cod:"6.2.",
                classe: $filter('translate')('MANEJOOUCULTIVOEMAREASNAOINUNDADAS'),
                color: "#D5A6BD"
            },{
                id:16,
                cod:"7.",
                classe: $filter('translate')('AREASURBANAS'),
                color: "#666666"
            },{
                id:17,
                cod:"8.",
                classe: $filter('translate')('OUTRASAREASARTIFICIAIS'),
                color: "#999999"
            },{
                id:18,
                cod:"9.",
                classe: $filter('translate')('AGUA'),
                color: "#0000FF"
            }];
            
            var classesV3brasil = [{
                id: 1,
                cod: "1.",
                classe: $filter('translate')('FORMACOESFLORESTAIS'),
                color: "#129912"
            },{
                id: 2,
                cod: "1.1.",
                classe: $filter('translate')('FORMACOESFLORESTAISNATURAIS'),
                color: "#1f4423",
            }, {
                id: 3,
                cod: "1.1.1.",
                classe: $filter('translate')('FLORESTADENSA'),
                color: "#006400",
            }, {
                id: 4,
                cod: "1.1.2.",
                classe: $filter('translate')('FLORESTAABERTA'),
                color: "#00ff00",                
            },{
                id: 5,
                cod: "1.1.3.",
                classe: $filter('translate')('MANGUE'),
                color: "#687537",
            }, {
                id: 6,
                cod: "1.1.4.",
                classe: $filter('translate')('FLORESTAALAGADA'),
                color: "#76a5af",
            }, {
                id: 7,
                cod: "1.1.5.",
                classe: $filter('translate')('FLORESTADEGRADADA'),
                color: "#29eee4",
            }, {
                id: 8,
                cod: "1.1.6.",
                classe: $filter('translate')('FLORESTASECUNDARIA'),
                color: "#77a605",
            }, {
                id: 9,
                cod: "1.2.",
                classe: $filter('translate')('SILVICULTURA'),
                color: "#935132",
            }, {
                id: 10,
                cod: "2.",
                classe: $filter('translate')('FORMACOESNATURAISNAOFLORESTAIS'),
                color: "#ff9966",
            }, {
                id: 11,
                cod: "2.1.",
                classe: $filter('translate')('AREASUMIDASNATURAISNAOFLORESTAIS'),
                color: "#45c2a5",
            }, {
                id: 12,
                cod: "2.2.",
                classe: $filter('translate')('VEGETACAOCAMPESTRE'),
                color: "#B8AF4F"
            }, {
                id: 13,
                cod: "2.3.",
                classe: $filter('translate')('OUTRASFORMACOESNAOFLORESTAIS'),                                             
                color: "#F1C232",
            }, {
                id: 14,
                cod: "3.",
                classe: $filter('translate')('USOAGROPECUARIO'),
                color: "#ffffb2",
            }, {
                id: 15,
                cod: "3.1.",
                classe: $filter('translate')('PASTAGEM'),
                color: "#ffd966",
            }, {
                id: 16,
                cod: "3.1.1.",
                classe: $filter('translate')('PASTAGEMEMCAMPOSNATURAIS'),
                color: "#F6B26B"
            }, {
                id: 17,
                cod: "3.1.2.",
                classe: $filter('translate')('OUTRASPASTAGENS'),
                color: "#A0D0DE"
            }, {
                id: 18,
                cod: "3.2.",
                classe: $filter('translate')('AGRICULTURA'),
                color: "#e974ed",
            }, {
                id: 19,
                cod: "3.2.1.",
                classe: $filter('translate')('CULTURASANUAIS'),
                color: "#d5a6bd"
            }, {
                id: 20,
                cod: "3.2.2.",
                classe: $filter('translate')('CULTURASSEMIPERENE'),
                color: "#c27ba0"
            }, {
                id: 21,
                cod: "3.3.",
                classe: $filter('translate')('AGRICULTURAOUPASTAGEM'),
                color: "#A64D79"
            }, {
                id: 22,
                cod: "4.",
                classe: $filter('translate')('AREASNAOVEGETADAS'),
                color: "#ea9999"
            },{
                id: 23,
                cod: "4.1.",
                classe: $filter('translate')('PRAIASEDUNAS'),
                color: "#dd7e6b"
            },{
                id: 24,
                cod: "4.2.",
                classe: $filter('translate')('AREASURBANAS'),
                color: "#b7b7b7"
            }, {
                id: 25,
                cod: "4.3.",
                classe: $filter('translate')('OUTRASAREASNAOVEGETADAS'),
                color: "#FF99FF"                
            }, {
                id: 26,
                cod: "5.",
                classe: $filter('translate')('CORPOSDAGUA'),
                color: "#0000ff"                
            }, {
                id: 27,
                cod: "6.",
                classe: $filter('translate')('NAOOBSERVADO'),
                color: "#d5d5e5"              
            }];


            var classesV2 = [{
                id: 1,
                cod: "1.",
                classe: $filter('translate')('FORMACOESFLORESTAIS'),
                color: "#129912"
            }, {
                id: 2,
                cod: "1.1.",
                classe: $filter('translate')('FORMACOESFLORESTAISNATURAIS'),
                color: "#1f4423",
            }, {
                id: 3,
                cod: "1.1.1.",
                classe: $filter('translate')('FLORESTADENSA'),
                color: "#006400",
                parent: 2
            }, {
                id: 4,
                cod: "1.1.2.",
                classe: $filter('translate')('FLORESTAABERTA'),
                color: "#00ff00",
                parent: 3
            }, {
                id: 5,
                cod: "1.1.3.",
                classe: $filter('translate')('FLORESTARASA'),
                color: "#65c24b",
                parent: 2
            }, {
                id: 6,
                cod: "1.1.4.",
                classe: $filter('translate')('MANGUE'),
                color: "#687537",
                parent: 5
            }, {
                id: 33,
                cod: "1.1.5.",
                classe: $filter('translate')('FLORESTAALAGADA'),
                color: "#76a5af",
                parent: 5
            }, {
                id: 7,
                cod: "1.1.6.",
                classe: $filter('translate')('FLORESTADEGRADADA'),
                color: "#29eee4",
                parent: 1
            }, {
                id: 8,
                cod: "1.1.7.",
                classe: $filter('translate')('FLORESTASECUNDARIA'),
                color: "#77a605",
                parent: 7
            }, {
                id: 9,
                cod: "1.2.",
                classe: $filter('translate')('SILVICULTURA'),
                color: "#935132",
                parent: 8
            }, {
                id: 10,
                cod: "2.",
                classe: $filter('translate')('FORMACOESNATURAISNAOFLORESTAIS'),
                color: "#ffe599",
                parent: 7
            }, {
                id: 11,
                cod: "2.1.",
                classe: $filter('translate')('FORMACOESNAOFLORESTAISEMAREASUMIDAS'),
                color: "#45c2a5",
                parent: 10
            }, {
                id: 12,
                cod: "2.2.",
                classe: $filter('translate')('DUNASVEGETADAS'),
                color: "#f1c232",
                parent: 7
            }, {
                id: 13,
                cod: "2.3.",
                classe: $filter('translate')('VEGETACAOCAMPESTRE'),
                color: "#b8af4f",
                parent: 1
            }, {
                id: 14,
                cod: "3.",
                classe: $filter('translate')('AGROPECUARIA'),
                color: "#ffffb2",
                parent: 13
            }, {
                id: 15,
                cod: "3.1.",
                classe: $filter('translate')('PASTAGEM'),
                color: "#ffd966",
                parent: 14
            }, {
                id: 16,
                cod: "3.1.1.",
                classe: $filter('translate')('PASTAGEMNAODEGRADADA'),
                color: "#ffe599",
                parent: 0
            }, {
                id: 17,
                cod: "3.1.2.",
                classe: $filter('translate')('PASTAGEMDEGRADADA'),
                color: "#f6b26b",
                parent: 16
            }, {
                id: 18,
                cod: "3.2.",
                classe: $filter('translate')('AGRICULTURA'),
                color: "#e974ed",
                parent: 17
            }, {
                id: 19,
                cod: "3.2.1.",
                classe: $filter('translate')('CULTURASANUAIS'),
                color: "#d5a6bd",
                parent: 18
            }, {
                id: 20,
                cod: "3.2.2.",
                classe: $filter('translate')('CULTURASSEMIPERENE'),
                color: "#c27ba0",
                parent: 18
            }, {
                id: 21,
                cod: "3.2.3.",
                classe: $filter('translate')('CULTURASPERENES'),
                color: "#a64d79",
                parent: 17
            }, {
                id: 22,
                cod: "4.",
                classe: $filter('translate')('AREASNAOVEGETADAS'),
                color: "#ea9999",
                parent: 21
            }, {
                id: 23,
                cod: "4.1.",
                classe: $filter('translate')('FORMACOESNATURAISNAOVEGETADAS'),
                color: "#cc4125",
                parent: 21
            }, {
                id: 24,
                cod: "4.1.1.",
                classe: $filter('translate')('PRAIASEDUNAS'),
                color: "#dd7e6b",
                parent: 16
            }, {
                id: 25,
                cod: "4.1.2.",
                classe: $filter('translate')('AFLORAMENTOSROCHOSOS'),
                color: "#e6b8af",
                parent: 24
            }, {
                id: 26,
                cod: "4.1.3.",
                classe: $filter('translate')('RECIFESDECORAIS'),
                color: "#980000",
                parent: 25
            }, {
                id: 27,
                cod: "4.2.",
                classe: $filter('translate')('OUTRASAREASNAOVEGETADAS'),
                color: "#999999",
                parent: 24
            }, {
                id: 28,
                cod: "4.2.1.",
                classe: $filter('translate')('AREASURBANAS'),
                color: "#b7b7b7",
                parent: 27
            }, {
                id: 29,
                cod: "4.2.2.",
                classe: $filter('translate')('MINERACAO'),
                color: "#434343",
                parent: 27
            }, {
                id: 30,
                cod: "4.2.3.",
                classe: $filter('translate')('OUTRASAREASNAOVEGETADAS'),
                color: "#d9d9d9",
                parent: 27
            }, {
                id: 31,
                cod: "5.",
                classe: $filter('translate')('CORPOSDAGUA'),
                color: "#0000ff",
                parent: 27
            }, {
                id: 32,
                cod: "6.",
                classe: $filter('translate')('NAOOBSERVADO'),
                color: "#d5d5e5",
                parent: 27
            }];


            var classesV1 = [{
                id: 1,
                cod: "1.",
                classe: $filter('translate')('FLORESTA'),
                color: "#006630",
                parent: 0,
            }, {
                id: 2,
                cod: "1.1.",
                classe: $filter('translate')('NAOFLORESTA'),
                color: "#000000",
                parent: 1
            }, {
                id: 3,
                cod: "1.1.1.",
                classe: $filter('translate')('AGUA'),
                color: "#0000FF",
                parent: 2
            }, {
                id: 4,
                cod: "1.1.1.1.",
                classe: $filter('translate')('FLORESTACONSERVADATERRAFIRME'),
                color: "#15A352",
                parent: 3
            }, {
                id: 5,
                cod: "1.1.2.",
                classe: $filter('translate')('FLORESTACONSERVADAVARZEA'),
                color: "#94CC92",
                parent: 2
            }, {
                id: 6,
                cod: "1.1.2.1.",
                classe: $filter('translate')('FLORESTACONSERVADAVARZEA'),
                color: "#94CC92",
                parent: 5
            }, {
                id: 7,
                cod: "1.2.",
                classe: $filter('translate')('FLORESTACOMSINAISDEDISTURBIO'),
                color: "#D4E3FA",
                parent: 1
            }, {
                id: 8,
                cod: "1.2.1.",
                classe: $filter('translate')('FLORESTASOBPLANODEMANEJOFLORESTAL'),
                color: "#707000",
                parent: 7
            }, {
                id: 9,
                cod: "1.2.1.1.",
                classe: $filter('translate')('FLORESTASOBPLANODEMANEJOFLORESTAL'),
                color: "#707000",
                parent: 8
            }, {
                id: 10,
                cod: "1.2.2.",
                classe: $filter('translate')('FLORESTADEGRADADAOUEMDEGRADACAO'),
                color: "#FF6766",
                parent: 7
            }, {
                id: 11,
                cod: "1.2.2.1.",
                classe: $filter('translate')('FLORESTADEGRADADAOUEMDEGRADACAO'),
                color: "#FF6766",
                parent: 10
            }, {
                id: 12,
                cod: "1.2.3.",
                classe: $filter('translate')('FLORESTAEMREGENERACAO'),
                color: "#FE8FAB",
                parent: 7
            }, {
                id: 13,
                cod: "1.3.",
                classe: $filter('translate')('REFLORESTAMENTO'),
                color: "#FBB2CC",
                parent: 1
            }, {
                id: 14,
                cod: "1.3.1.",
                classe: $filter('translate')('REFLORESTAMENTO'),
                color: "#A15989",
                parent: 13
            }, {
                id: 15,
                cod: "1.3.1.1.",
                classe: $filter('translate')('REFLORESTAMENTO'),
                color: "#A15989",
                parent: 14
            }, {
                id: 16,
                cod: "2.",
                classe: $filter('translate')('NAOFLORESTACOMVEGETACAO'),
                color: "#A57000",
                parent: 0
            }, {
                id: 17,
                cod: "2.1.",
                classe: $filter('translate')('CAMPO'),
                color: "#E9FFBF",
                parent: 16
            }, {
                id: 18,
                cod: "2.1.1.",
                classe: $filter('translate')('CAMPONATIVO'),
                color: "#eaf7d2",
                parent: 17
            }, {
                id: 19,
                cod: "2.1.1.1.",
                classe: $filter('translate')('CAMPONATIVODEGRADADO'),
                color: "#FF6766",
                parent: 18
            }, {
                id: 20,
                cod: "2.1.1.2.",
                classe: $filter('translate')('CAMPONATIVOSECUNDARIO'),
                color: "#BFBF77",
                parent: 18
            }, {
                id: 21,
                cod: "2.1.2.",
                classe: $filter('translate')('PASTAGEMPLANTADA'),
                color: "#FFFF00",
                parent: 17
            }, {
                id: 22,
                cod: "2.1.2.1.",
                classe: $filter('translate')('PASTAGEMPLANTADA'),
                color: "#FBB2CC",
                parent: 21
            }, {
                id: 23,
                cod: "2.1.2.2.",
                classe: $filter('translate')('PASTAGEMPLANTADABEMMANEJADA'),
                color: "#E5E504",
                parent: 21
            }, {
                id: 24,
                cod: "2.2.",
                classe: $filter('translate')('AREAAGRICOLA'),
                color: "#0DA84F",
                parent: 16
            }, {
                id: 25,
                cod: "2.2.1.",
                classe: $filter('translate')('CULTURASPERENES'),
                color: "#3C8A5D",
                parent: 24
            }, {
                id: 26,
                cod: "2.2.1.1.",
                classe: $filter('translate')('CULTURASPERENES'),
                color: "#3C8A5D",
                parent: 25
            }, {
                id: 27,
                cod: "2.2.2.",
                classe: $filter('translate')('CULTURASTEMPORARIAS'),
                color: "#837B6B",
                parent: 24
            }, {
                id: 28,
                cod: "2.2.2.1.",
                classe: $filter('translate')('CANA'),
                color: "#B07CFE",
                parent: 27
            }, {
                id: 29,
                cod: "2.2.2.2.",
                classe: $filter('translate')('SOJA'),
                color: "#267000",
                parent: 27
            }, {
                id: 30,
                cod: "2.2.2.3.",
                classe: $filter('translate')('ALGODAO'),
                color: "#FE2624",
                parent: 27
            }, {
                id: 31,
                cod: "2.2.2.4.",
                classe: $filter('translate')('MILHO'),
                color: "#FFD401",
                parent: 27
            }, {
                id: 32,
                cod: "2.2.2.5.",
                classe: $filter('translate')('ARROZDESEQUEIRO'),
                color: "#01A7E1",
                parent: 27
            }, {
                id: 33,
                cod: "2.2.2.6.",
                classe: $filter('translate')('ARROZHIRRIGADO'),
                color: "#12B6ED",
                parent: 27
            }, {
                id: 34,
                cod: "2.2.2.7.",
                classe: $filter('translate')('OUTRAS'),
                color: "#08090C",
                parent: 27
            }, {
                id: 35,
                cod: "2.3.",
                classe: $filter('translate')('AREASUMIDASNATURAIS'),
                color: "#7CB0B1",
                parent: 16
            }, {
                id: 36,
                cod: "2.3.1.",
                classe: $filter('translate')('AREASUMIDASNATURAIS'),
                color: "#7CB0B1",
                parent: 35
            }, {
                id: 37,
                cod: "2.3.1.1.",
                classe: $filter('translate')('AREASUMIDASNATURAIS'),
                color: "#7CB0B1",
                parent: 36
            }, {
                id: 38,
                cod: "3.",
                classe: $filter('translate')('CORPOSDAGUA'),
                color: "#3112E2",
                parent: 0
            }, {
                id: 39,
                cod: "3.1.",
                classe: $filter('translate')('RIOSLAGOSERESERVATORIOS'),
                color: "#366196",
                parent: 38
            }, {
                id: 40,
                cod: "3.1.1.",
                classe: $filter('translate')('RIOSLAGOSELAGUNAS'),
                color: "#1E0D89",
                parent: 39
            }, {
                id: 41,
                cod: "3.1.1.1.",
                classe: $filter('translate')('RIOSLAGOSELAGUNAS'),
                color: "#1E0D89",
                parent: 40
            }, {
                id: 42,
                cod: "3.1.2.",
                classe: $filter('translate')('RESERVATORIOS'),
                color: "#6955ED",
                parent: 39
            }, {
                id: 43,
                cod: "3.1.2.1.",
                classe: $filter('translate')('RESERVATORIOS'),
                color: "#6955ED",
                parent: 42
            }, {
                id: 44,
                cod: "4.",
                classe: $filter('translate')('NAOFLORESTASEMVEGETACAO'),
                color: "#C9D7A3",
                parent: 0
            }, {
                id: 45,
                cod: "4.1.",
                classe: $filter('translate')('OUTROS'),
                color: "#060606",
                parent: 44
            }, {
                id: 46,
                cod: "4.1.1.",
                classe: $filter('translate')('AREASNAOVEGETADASANTROPICAS'),
                color: "#FBB2CC",
                parent: 45
            }, {
                id: 47,
                cod: "4.1.1.1.",
                classe: $filter('translate')('ASSENTAMENTOHUMANO'),
                color: "#FBB2CC",
                parent: 46
            }, {
                id: 48,
                cod: "4.1.1.2.",
                classe: $filter('translate')('AREASNAOVEGETADASANTROPICAS'),
                color: "#999999",
                parent: 46
            }, {
                id: 49,
                cod: "4.1.2.",
                classe: $filter('translate')('AREASNAOVEGETADASNATURAIS'),
                color: "#FBB2CC",
                parent: 45
            }, {
                id: 50,
                cod: "4.1.2.1.",
                classe: $filter('translate')('AREASNAOVEGETADASNATURAIS'),
                color: "#CBC2AC",
                parent: 49
            }, {
                id: 51,
                cod: "5.",
                classe: $filter('translate')('NAOOBSERVADO'),
                color: "#DEA60B",
                parent: 0
            }, {
                id: 52,
                cod: "5.1.",
                classe: $filter('translate')('NAOOBSERVADO'),
                color: "#DEA60B",
                parent: 51
            }, {
                id: 53,
                cod: "5.1.1.",
                classe: $filter('translate')('AREANAOOBSERVADA'),
                color: "#FFCC66",
                parent: 52
            }, {
                id: 54,
                cod: "5.1.1.1.",
                classe: $filter('translate')('AREANAOOBSERVADA'),
                color: "#FFCC66",
                parent: 53
            }, {
                id: 55,
                cod: "1.4.",
                classe: $filter('translate')('FLORESTACONSERVADA'),
                color: "#00B04A",
                parent: 1
            }, {
                id: 56,
                cod: "1.1.3.",
                classe: $filter('translate')('FLORESTACONSERVADATERRAFIRME'),
                color: "#15A352",
                parent: 2
            }];
            
            var classesV0 = [{
                id:1,
                cod:"1.",
                classe: $filter('translate')('FLORESTA'),
                color: "#274E13"
            },{
                id:2,
                cod:"1.1.",
                classe: $filter('translate')('FLORESTAINUNDADA'),
                color: "#619B48"
            },{
                id:3,
                cod:"1.2.",
                classe: $filter('translate')('FLORESTANAOINUNDADA'),
                color: "#8DBC77"
            },{
                id:4,
                cod:"2.",
                classe: $filter('translate')('ARBUSTAL'),
                color: "#FFC000"
            },{
                id:5,
                cod:"2.1.",
                classe: $filter('translate')('ARBUSTALINUNDADO'),
                color: "#F9CB9C"
            },{
                id:6,
                cod:"2.2",
                classe: $filter('translate')('ARBUSTALNAOINUNDADO'),
                color: "#7F6000"
            },{
                id:7,
                cod:"3.",
                classe: $filter('translate')('HERBACEA'),
                color: "#D85D3D"
            },{
                id:8,
                cod:"3.1.",
                classe: $filter('translate')('HERBACEAINUNDADO'),
                color: "#F6B26B"
            },{
                id:9,
                cod:"4.",
                classe: $filter('translate')('VEGETACAOCAMPESTRE'),
                color: "#7DFF2D"
            },{
                id:10,
                cod:"4.1.",
                classe: $filter('translate')('VEGETACAOCAMPESTREINUNDADO'),
                color: "#46FF87"
            },{
                id:11,
                cod:"4.2.",
                classe: $filter('translate')('VEGETACAOCAMPESTRENAOINUNDADO'),
                color: "#6D9EEB"
            },{
                id:12,
                cod:"5.",
                classe: $filter('translate')('OUTRASCOBERTURASNATURAIS'),
                color: "#B6D7A8"
            },{
                id:13,
                cod:"6.",
                classe: $filter('translate')('AREAMANEJADAOUCULTIVADA'),
                color: "#4C1130"
            },{
                id:14,
                cod:"6.1.",
                classe: $filter('translate')('MANEJOOUCULTIVOEMAREASINUNDADAS'),
                color: "#A64D79"
            },{
                id:15,
                cod:"6.2.",
                classe: $filter('translate')('MANEJOOUCULTIVOEMAREASNAOINUNDADAS'),
                color: "#D5A6BD"
            },{
                id:16,
                cod:"7.",
                classe: $filter('translate')('AREASURBANAS'),
                color: "#666666"
            },{
                id:17,
                cod:"8.",
                classe: $filter('translate')('OUTRASAREASARTIFICIAIS'),
                color: "#999999"
            },{
                id:18,
                cod:"9.",
                classe: $filter('translate')('AGUA'),
                color: "#0000FF"
            }];

            var DtreeClasses = {
                classes: {
                    '0': classesV0,
                    '1': classesV1,
                    '2': classesV2,
                    '3': classesV3
                },
                getClasses: function(id) {
                    if (!id) {
                        id = 3;
                    }
                    return this.classes[id];
                }
            };

            return DtreeClasses;
        }
    ]);