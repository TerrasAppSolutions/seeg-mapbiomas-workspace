
const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger')

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    explorer: true
}));

app.listen(3000, () => {
    console.log("Run on port 3000");
})
