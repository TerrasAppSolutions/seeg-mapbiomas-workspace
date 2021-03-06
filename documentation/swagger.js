module.exports = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Mapbiomas API"
    },
    "host": "workspace.mapbiomas.org",
    "basePath": "/",
    "schemes": [
        "http"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "paths": {
        "/dashboard/services/territories": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "limit",
                        "type": "integer",
                        "description": "Quantos elementos serão retornados"
                    },
                    {
                        "in": "query",
                        "name": "category",
                        "type": "string",
                        "enum": ["Country", "Estate", "City", "Biome", "Macro Watersheds", "Watersheds Level 2", "Conservation Units", "Indigenous Lands"],
                        "description": "Filtre por categoria"
                    },
                    {
                        "in": "query",
                        "name": "page",
                        "type": "integer",
                        "description": "Paginação dos dados"
                    },
                    {
                        "in": "query",
                        "name": "name",
                        "type": "string",
                        "description": "Dados de acordo com o nome do território"
                    },
                    {
                        "in": "query",
                        "name": "language",
                        "type": "string",
                        "enum": [
                            "en",
                            "pt"
                        ],
                        "description": "Tradução da categoria"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/classifications": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "limit",
                        "type": "integer",
                        "description": "Quantos elementos serão retornados"
                    },
                    {
                        "in": "query",
                        "name": "language",
                        "type": "string",
                        "enum": [
                            "en",
                            "pt"
                        ],
                        "description": "Tradução da categoria"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/transitions": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "territory_id",
                        "type": "integer",
                        "description": "Id do território"
                    },
                    {
                        "in": "query",
                        "name": "year",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/coverage": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "territory_id",
                        "type": "integer",
                        "description": "Id do território"
                    },
                    {
                        "in": "query",
                        "name": "year",
                        "type": "integer",
                        "description": "Ano dos dados"
                    },
                    {
                        "in": "query",
                        "name": "classification_ids",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "Ids das classes"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/groupedcover": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "territory_id",
                        "type": "integer",
                        "description": "Id do território"
                    },
                    {
                        "in": "query",
                        "name": "year",
                        "type": "integer",
                        "description": "Ano dos dados"
                    },
                    {
                        "in": "query",
                        "name": "classification_id",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "Id da classe"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/infrastructure": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "limit",
                        "type": "integer",
                        "description": "limite de dados"
                    },
                    {
                        "in": "query",
                        "name": "ano",
                        "type": "integer",
                        "description": "ano"
                    },
                    {
                        "in": "query",
                        "name": "cat1",
                        "type": "string",
                        "description": "categoria de retorno"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/infra_levels": {
            "get": {
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/infra_hierarchy": {
            "get": {
                "parameters": [{
                    "in": "query",
                    "name": "language",
                    "type": "string",
                    "enum": [
                        "en",
                        "pt"
                    ],
                    "description": "Tradução da categoria"
                }],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/infra_buffer": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "territorio_id",
                        "type": "integer",
                        "description": "Id do território",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "categoria_name",
                        "type": "string",
                        "description": "Ano dos dados",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "categoria_id",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "Ids das classes",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "buffer",
                        "type": "string",
                        "enum": [
                            "5k",
                            "10k",
                            "20k"
                        ],
                        "description": "Buffer de interesse",
                        "required": true
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/coverage_infra": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "territory_id",
                        "type": "integer",
                        "description": "Id do território",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "level_id",
                        "type": "integer",
                        "description": "id do nível",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "buffer",
                        "type": "string",
                        "enum": [
                            "5k",
                            "10k",
                            "20k"
                        ],
                        "description": "Buffer de interesse",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "classification_ids",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "Ids das classes"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        },
        "/dashboard/services/statistics/groupedcover_infra": {
            "get": {
                "parameters": [{
                        "in": "query",
                        "name": "territory_id",
                        "type": "integer",
                        "description": "Id do território",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "level_id",
                        "type": "integer",
                        "description": "id do nível",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "buffer",
                        "type": "string",
                        "enum": [
                            "5k",
                            "10k",
                            "20k"
                        ],
                        "description": "Buffer de interesse",
                        "required": true
                    },
                    {
                        "in": "query",
                        "name": "classification_ids",
                        "type": "array",
                        "items": {
                            "type": "integer"
                        },
                        "description": "Ids das classes"
                    }
                ],
                "responses": {
                    "201": {
                        "description": ""
                    }
                }
            }
        }
    }
}