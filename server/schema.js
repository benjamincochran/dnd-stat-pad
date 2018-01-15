const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
const connection = require('./connection')
  
mongoose.connect('mongodb://' + connection + '/dnd-stat-pad?ssl=true')

const CharacterSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  email: String,
  finalized: Boolean,
  stats: [Number]
})

const CampaignSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: String,
  diceCount: Number,
  fixedOrder: Boolean,
  created: { 
    type: Date, 
    default: Date.now, 
    expires: '14d' // TODO: make this variable, expose value on page
  }, 
  characters: {
    type: [CharacterSchema],
    validate: {
      validator: function(characters) {
        console.log('characters.length', characters.length)
        return characters.length > 0 && characters.length < 10
      },
      message: 'You must have at least one character, and mo more than 9'
    }
  }
})

module.exports = {
  Campaign: mongoose.model('Campaign', CampaignSchema)
}