const swaggerAutogen = require('swagger-autogen')()
var fs = require("fs");
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: '192.168.4.107:8080',
  schemes: ['http'],
};
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const outputFile = './swagger_output.json'

fs.readdirSync("routes").forEach(function (file) {
if (file[0] == ".") return;

const endpointsFiles = ["./routes/" + 'authen.js',"./routes/" + 'dashboard.js',"./routes/" + 'attendance.js']

swaggerAutogen(outputFile, endpointsFiles,doc)
});

