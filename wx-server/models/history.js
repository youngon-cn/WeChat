var mongoose = require('mongoose')

var historySchema = new mongoose.Schema({
    type: String,
    artType: String,
    title: String,
    subtitle: String,
    subject: String,
    link: String,
    img: String
})

var History = mongoose.model('History', historySchema)

module.exports = History
