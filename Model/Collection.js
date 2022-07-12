const mongoose = require('mongoose');
const AuthorSchema = mongoose.Schema({
    anSEnrollNumber:String,
    linetoken:String,
    title:String,
    name:String,
    company: String,
    organize: String,
    company_id: String,
})

const Author = mongoose.model("Author",AuthorSchema)

module.exports = Author