const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
}

const scheduledSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    guildId: reqString,
    channelId: reqString,
    authorId: reqString,
    messageId: reqString,
    time: reqString,
    clockType: reqString,
})

const name = 'sheduled-posts'

module.exports = mongoose.model[name] || mongoose.model(name, scheduledSchema, name)
