import { Router } from 'express'
import Roll from 'roll'
import { Campaign } from '../schema'
  
const router = Router()

router.get('/characters/:id', function (req, res, next) {
  Campaign
    .findOne({'characters._id': req.params.id}, 'diceCount fixedOrder characters.$')
    .then((campaign) => {
      if (!campaign || campaign.characters.length !== 1) return res.sendStatus(404)
      console.log("found character", campaign.characters[0])
      res.json({
        diceCount: campaign.diceCount,
        fixedOrder: campaign.fixedOrder,
        character: campaign.characters[0]
      })
    })
    .catch((e) => res.status(500).end(e.message));
})

router.post('/characters/:id/roll', function(req, res, next) {
  // expect index; generate die values, calculate sum, store sum, return both dice and total
  console.log("rolling", req.params.id, req.body.index)
  Campaign
    .findOne({'characters._id': req.params.id}, 'diceCount fixedOrder characters.$')
    .then((campaign) => {
      if (!campaign || campaign.characters.length !== 1) return res.sendStatus(404)
      console.log('rolling for campaign', campaign)
      let roll = (new Roll()).roll(campaign.diceCount + 'd6b3')
      console.log('roll', roll)
      if (!Number.isInteger(req.body.index) || campaign.characters[0].stats[req.body.index]) {
        console.log('No munchkins allowed!')
        return Promise.reject('No munchkins allowed!')
      }
      let setArgs = {}
      setArgs['characters.$.stats.' + req.body.index] = roll.result
      if (campaign.fixedOrder && campaign.characters[0].stats.filter((stat) => !stat).length <= 1) {
        setArgs['characters.$.finalized'] = true
      }
      return Campaign.findOneAndUpdate(
        { 'characters': { $elemMatch: { '_id': req.params.id, 'finalized': false } } }, 
        { $set: setArgs },
        { new: true }
      ).then((campaign) => Promise.resolve({campaign, roll}))
    })
    .then(({campaign, roll}) => {
      console.log('roll2', roll)
      res.json({
        finalized: campaign.characters[0].finalized,
        stat: roll.result,
        dice: roll.rolled
      })
    })
    .catch((e) => res.status(500).end(e.message));
})

router.post('/characters/:id/arrange', function(req, res, next) {
  let stats = req.body.stats // [7, 12, 16, 11, 10, 16]
  if (!stats) res.sendStatus(500) // also check for equality vs values in DB
  Campaign
    .findOneAndUpdate({'characters': { $elemMatch: {'_id': req.params.id, 'finalized': false}}}, {$set: {
      'characters.$.stats': stats, 
      'characters.$.finalized': true
    }})
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.error(error.message)
      res.sendStatus(500)
    })
})

export default router