const dashboard = require('../controller/dashboard')
module.exports = function (app) {
    app.get('/getGraph', dashboard.getGraph) 
}