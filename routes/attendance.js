const attendance = require('../controller/attendance')
module.exports = function (app) { 

    app.post('/insertAttendance',attendance.insertAttendance)
}