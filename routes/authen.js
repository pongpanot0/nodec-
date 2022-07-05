const authen = require('../controller/authen')
module.exports = function (app) {
    app.post('/register', authen.register) 
    app.post('/login',authen.login)
}