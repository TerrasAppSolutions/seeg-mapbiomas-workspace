# MapBiomas - Documentação da API

# Serviços de Estatísticas

## Territories [/territories]

Listagem dos territórios usados para calcular estatísticas.

__Url:__ [/dashboard/services/territories]  [service_territories_url]

[service_territories_url]: http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories

### Listar territorios [GET]

+ Response 200 (application/json)

        [
            {
                "id":1,
                "name":"AMAZONIA",
                "category":"Bioma",
                "area":343.37,
                "bounds":[[-16.290519,-73.990944],[5.272156,-43.016913]]
            },
            {
                "id": 2,
                "name": "Acre",
                "category": "Estado",
                "bounds": [[8.40,-79.23],[-36.87,-31.06]],
                "area": 1000
            }            
        ]
        
+ Atributos
    + id (required, number) - Id do território.
    + name (required, string) - Nome do território.
    + category (required, string) - Categoria do território.
    + bounds (required, array) - Localização do território,
    + area (required, number) - Área do território.

__Exemplos:__

``` html
<script>
    // jQuery 
    $.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories', function(response) {
        console.log("Data Loaded:",response);
    },"json");

    // AngularJs
    $http.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories').then(function(response){
        console.log("Data Loaded:",response.data);        
    });
</script>
```


### Listar territorios (paginação) [GET]

+ Parâmetros
    + page (required, number) ... Número da página.
    + limit (required, number) ... Limite de registros da página.
    + name (string) ... Nome do território. 


+ Response 200 (application/json)

        {
            "data": [{
                "id": 1,
                "name": "AMAZONIA",
                "category": "Bioma",
                "area": 343.37,
                "bounds": [
                    [-16.290519, -73.990944],
                    [
                        5.272156, -43.016913
                    ]
                ]
            }, {
                "id": 2,
                "name": "MATA ATLANTICA",
                "category": "Bioma",
                "area": 97.94,
                "bounds": [
                    [-29.95134, -55.665731],
                    [-3.830065, -28.835629]
                ]
            }],
            "page": "1",
            "totalPages": 2802
        }
        
+ Atributos
    + data (required, array) - Registros da página.
    + name (required, number) - Número da página.
    + totalPages (required, number) - Total de páginas calculadas.    


__Exemplos:__

``` html
<script>
    // Parâmetros de consulta
    // url requisitada
    // http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories?page=1&limit=10
    
    var params = {
        page:1,
        limit:10        
    };

    // jQuery     
    $.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories', params,function(response) {
        console.log("Data Loaded:",response.data);
    },"json");

    // AngularJs
    $http.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories',{data:params}).then(function(response){
        console.log("Data Loaded:",response.data.data);        
    });

    // Select2 Config
    $(".select2-ajax").select2({
        ajax: {
            url: "http://seeg-mapbiomas.terras.agr.br/dashboard/services/territories",
            dataType: 'json',
            delay: 250,
            data: function(params) {
                var query = {
                    limit: 10,
                    page: 1,
                };
                if (params.page) {
                    query.page = params.page;
                }
                if (params.term) {
                    query.name = params.term;
                }
                return query;
            },
            processResults: function(data, params) {
                var more = data.data.length > 0;

                var results = [];

                $.each(data.data, function(index, value) {
                    var text = value.name + " (" + value.category + ")";
                    results.push({
                        id: value.id,
                        text: text
                    });
                });
                return {
                    results: results,
                    pagination: {
                        more: more
                    }
                };
            },
            cache: true
        },        
        minimumInputLength: 0
    });
</script>

<select class="select2-ajax">
  <option>Territórios</option>
</select>

```

## Classifications [/classifications]

Listagem das classes geradas no processamento das imagens de satélites.

__Url:__ [/dashboard/services/classifications]  [service_classifications_url]

[service_classifications_url]: http://seeg-mapbiomas.terras.agr.br/dashboard/services/classifications

### Listar classes [GET]

+ Response 200 (application/json)

        [
            {
                "id": 1,
                "name": "Água",
                "color": "#74c6df"
            },
            {
                "id": 2,
                "name": "Pastagem",
                "color": "#dbdb77"
            },
            {
                "id": 3,
                "name": "Formações florestais",
                "color": "#74e2a8"
            }
        ]
        
+ Atributos
    + id (required, number) - ID da classe.
    + name (required, string) - Nome da classe.
    + color (required, string) - Cor da classe.


__Exemplos:__

``` html
<script>
    // jQuery 
    $.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/classifications', function(response) {
        console.log("Data Loaded:",response);
    },"json");

    // AngularJs
    $http.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/classifications').then(function(response){
        console.log("Data Loaded:",response.data);        
    });
</script>
```

## Coverage [/coverage]

Listagem de dados de estatísticas por território.

__Url:__ [/dashboard/services/statistics/coverage]  [service_stats_coverage_url]

[service_stats_coverage_url]: http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/coverage


+ Parâmetros
    + year (required, number, `2012`) ... Ano da estatística.
    + territory_id (required, number, `1`) ... ID do Território.
    + classification_ids (required, number, `1,2,3`) ... ID de Classes, separado por vírgula.

### Listar estatísticas por território [GET]

+ Response 200 (application/json)
    
        [
            {
                "id": 1,
                "percentage": 50,
                "area": 1000
            },
            {
                "id": 2,
                "percentage": 40,
                "area": 800
            },
            {
                "id": 3,
                "percentage": 5,
                "area": 100
            },
            {
                "id": 4,
                "percentage": 5,
                "area": 100
            }
        ]
        
+ Atributos
    + id (required, number) - ID da Classe.
    + percentage (required, number) - Porcentagem de ocorrência da classe no território.
    + area (required, number) - Área da classe no território.


__Exemplos:__

``` html
<script>
    // Parâmetros de consulta
    var params = {
        territory_id:15,
        classification_ids: "1,2,3,4,5",
        year:2015
    };

    // jQuery     
    $.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/coverage', params,function(response) {
        console.log("Data Loaded:",response);
    },"json");

    // AngularJs
    $http.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/coverage',{data:params}).then(function(response){
        console.log("Data Loaded:",response.data);        
    });
</script>
```

## Transitions [/transitions]

Listagem de dados de transição por território.

__Url:__ [/dashboard/services/statistics/transitions]  [service_stats_transitions_url]

[service_stats_transitions_url]: http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/transitions

+ Parâmetros
    + year (required, number, `2012,2014`) ... Intervalo de ano separado por vírgula.
    + territory_id (required, number, `1`) ... ID do território.

### Listar transições [GET]

+ Response 200 (application/json)
    
        {
            "transitions": [
                {
                    "from": 1,
                    "to": 2,
                    "percentage": 10,
                    "area": 1000
                },
                {
                    "from": 2,
                    "to": 3,
                    "percentage": 4,
                    "area": 400
                },
                {
                    "from": 2,
                    "to": 4,
                    "percentage": 12,
                    "area": 120
                }
            ],
            "coverages": [
                {
                    "id": 1,
                    "year": 2012,
                    "percentage": 8,
                    "area": 8000
                },
                {
                    "id": 1,
                    "year": 2013,
                    "percentage": 5,
                    "area": 500
                },
                {
                    "id": 1,
                    "year": 2014,
                    "percentage": 7,
                    "area": 700
                }
            ]
        }

+ Atributos
    + from (required, number) - ID da classe inicial.
    + to (required, number) - ID da classe final.
    + percentage (required, number) - Porcentagem da transição.
    + area (required, number) - Área da transição.   


__Exemplos:__

``` html
<script>
    // Parâmetros de consulta
    var params = {
        territory_id: 15,
        year:"2008,2009"        
    };

    // jQuery     
    $.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/transitions', params,function(response) {
        console.log("Data Loaded:",response);
    },"json");

    // AngularJs
    $http.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/statistics/transitions',{data:params}).then(function(response){
        console.log("Data Loaded:",response.data);        
    });
</script>
```

## Qualities [/qualities]

Listagem de qualidade dos mosaicos das cartas processadas.

__Url:__ [/dashboard/services/qualities]  [service_qualities_url]

[service_qualities_url]: http://seeg-mapbiomas.terras.agr.br/dashboard/services/qualities

+ Parâmetros
    + year (required, number) ... Ano do carta processada.
    + bioma (string) ... Bioma da carta processada. Valores possíveis: "AMAZONIA","MATA ATLANTICA","PANTANAL","CERRADO","CAATINGA","PAMPA","ZONA COSTEIRA"
    + chart (string) ...  Carta processada.

### Listar qualidades [GET]

+ Response 200 (application/json)

        [
            {
                "chart": "NA-22-X-C",
                "bioma": "ZONA COSTEIRA",
                "year": ​2008,
                "quality": ​1
            },
            {
                "chart": "NA-22-X-C",
                "bioma": "AMAZONIA",
                "year": ​2010,
                "quality": ​1
            }           
        ]
        
+ Atributos    
    + chart (required, string) - Carta processada.
    + bioma (required, string) - Bioma da carta processada.
    + year (required, number) - Ano do carta processada.
    + quality (required, number) - Qualidade do mosaico processado. { 1: "RUIM", 2: "REGULAR", 3: "BOM" }


__Exemplos:__

``` html
<script>
    var params = {
        year: 2008,
        bioma:"MATA ATLANTICA",      
        chart:"NA-22-X-C"     
    };

    // jQuery     
    $.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/qualities', params,function(response) {
        console.log("Data Loaded:",response);
    },"json");

    // AngularJs
    $http.get('http://seeg-mapbiomas.terras.agr.br/dashboard/services/qualities',{data:params}).then(function(response){
        console.log("Data Loaded:",response.data);        
    });
</script>
```


# Serviços de Imagens


## Coverage WMS

Serviço WMS de cobertura de classes por território.
        
+ Parâmetros
    + layers (required, string) [wms] - Valor obrigatório "coverage".
    + format (required, string) [wms] - Valor padrão "image/png".
    + transparent (required, strng) [wms] - Valor padrão "true"   
    + map (required, string) [wms] - Valor obrigatório "wms/classification/coverage.map".
    + year (required, number) - Ano da cobertura.
    + territory_id (required, number) - ID do território visualisado.
    + classification_ids (required, array) - IDs das classes visualizadas.
    
    
__Exemplos:__

``` html
<script>
    // Laeftlet Layer
    var covarage = L.tileLayer.wms("http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv", {
        layers: 'coverage',
        map: "wms/classification/coverage.map",
        year: 2009,
        territory_id: 23,
        classification_ids: [1,3],                            
        format: 'image/png',
        transparent: true,
        attribution: "MapBiomas Workspace"
    });
</script>
```
__Imagem exemplo:__

![Tile map image](http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=coverage&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&URL=http%3A%2F%2Fdev.seeg-mapbiomas.terras.agr.br&MAP=wms%2Fclassification%2Fcoverage.map&YEAR=2015&TERRITORY_ID=10&TRANSITION_ID=undefined&CLASSIFICATION_IDS=1%2C3%2C4%2C5%2C6%2C7%2C8%2C0%2C2&SRS=EPSG%3A3857&OPACITY=0.6&ATTRIBUTION=MapBiomas%20Workspace&BBOX=-5557277.704445453,-1526294.5807983999,-5518141.945963444,-1487158.8223163888)

## Transition WMS

Serviço WMS de transições das classes por ano e território.
        
+ Parâmetros
    + layers (required, string) [wms] - Valor obrigatório "transitions".
    + format (required, string) [wms] - Valor padrão "image/png".
    + transparent (required, strng) [wms] - Valor padrão "true"   
    + map (required, string) [wms] - Valor obrigatório "wms/classification/transitions.map".
    + years (required, string) - Intervalo de ano da transição.
    + territory_id (required, number) - ID do território visualizado.
    + transition_id (required, number) - ID da transição ("from" + "to").
    
    
__Exemplos:__

``` html
<script>
    // Laeftlet Layer
    var transition = L.tileLayer.wms("http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv", {
        layers: 'transitions',
        map: "wms/classification/transitions.map",
        years: "2008-2009",
        territory_id: 10,
        transition_id: 12,    // ("from" + "to")
        format: 'image/png',
        transparent: true
    });
</script>
```
__Imagem exemplo:__

![Tile map image](http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=transitions&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&URL=http%3A%2F%2Fdev.seeg-mapbiomas.terras.agr.br&MAP=wms-b%2Fclassification%2Ftransitions.map&YEAR=2012%2C2013&TERRITORY_ID=3&TRANSITION_ID=22&CLASSIFICATION_IDS=1%2C3%2C4%2C5%2C6%2C7%2C8%2C0%2C2&SRS=EPSG%3A3857&OPACITY=0.6&ATTRIBUTION=MapBiomas%20Workspace&BBOX=-6261721.357121638,-2113330.958028553,-6183449.840157617,-2035059.441064532)


## RGB WMS

Serviço WMS de imagens rgb.
        
+ Parâmetros
    + layers (required, string) [wms] - Valor obrigatório "rgb".
    + format (required, string) [wms] - Valor padrão "image/png".
    + transparent (required, strng) [wms] - Valor padrão "true"   
    + map (required, string) [wms] - Valor obrigatório "wms/classification/rgb.map".
    + year (required, string) - Ano da imagem.    
    
    
__Exemplos:__

``` html
<script>
    // Laeftlet Layer
    var rgb = L.tileLayer.wms("http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv", {
        layers: 'rgb',
        map: "wms/classification/rgb.map",
        year: "2008",        
        format: 'image/png',
        transparent: true
    });
</script>
```
__Imagem exemplo:__

![Tile map image](http://seeg-mapbiomas.terras.agr.br/cgi-bin/mapserv?SERVICE=WMS&REQUEST=GetMap&VERSION=1.1.1&LAYERS=rgb&STYLES=&FORMAT=image%2Fpng&TRANSPARENT=true&HEIGHT=256&WIDTH=256&MAP=wms%2Fclassification%2Frgb.map&YEAR=2008&SRS=EPSG%3A3857&BBOX=-6261721.357121638,-1252344.2714243273,-5948635.289265556,-939258.2035682459)