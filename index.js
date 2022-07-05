var express = require("express")
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(function (req,res,next){
    next()
});



app.listen(8080,()=>{
    console.log('server start ')
})

