const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')
  
mongoose.connect('mongodb://' + process.env.MONGO_CONNECTION + '/dnd-stat-pad?ssl=true')

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const CharacterSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: emailRegex,
      message: 'Please enter a valid email address'
    }
  },
  finalized: Boolean,
  stats: [Number]
})

const CampaignSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: {
    type: String,
    required: true
  },
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
        return characters.length > 0 && characters.length < 10
      },
      message: 'You must have at least 1 character, and no more than 9'
    }
  }
})

module.exports = {
  Campaign: mongoose.model('Campaign', CampaignSchema)
}