const attendance = require('../controller/attendance')
module.exports = function (app) {
    app.get('/getattendance/', attendance.get) 
    app.get('/getall', attendance.getall) 
    app.post('/insertAttendance',attendance.insertAttendance)
}