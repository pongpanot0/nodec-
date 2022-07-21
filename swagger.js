const swaggerAutogen = require('swagger-autogen')()
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const outputFile = './swagger_output.json'

fs.readdirSync("routes").forEach(function (file) {
if (file[0] == ".") return;
var routeName = file.substr(0, file.indexOf("."));
const endpointsFiles = ["./routes/" + routeName]
swaggerAutogen(outputFile, endpointsFiles,doc)
});

