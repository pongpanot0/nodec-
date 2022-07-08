const attendance = require('../controller/attendance')
module.exports = function (app) {
    app.post('/insertattendance', attendance.insert) 
    app.get('/getattendance/', attendance.get) 
    app.post('/linetoken', attendance.insert) 
    app.get('/getall/:id', attendance.getall) 
    
}