### Swagger UI

O UI é utilizado para visualizar e testar a documentação.

https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/installation.md

Instalação
```
npm install swagger-ui-express express --save
```

```
cd documentation

docker pull swaggerapi/swagger-ui

docker run -p 8990:8080 -e SWAGGER_JSON=/documentation/swagger.json -v `pwd`/documentation:/documentation swaggerapi/swagger-ui:v3.21.0
```
