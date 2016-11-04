var mongoose = require('mongoose')

var historySchema = new mongoose.Schema({
    type: String,
    artType: String,
    title: String,
    subtitle: String,
    subject: String,
    link: String,
    img: String,
    create_time: Number,
    update_time: Number
})

var History = mongoose.model('History', historySchema)

module.exports = History
