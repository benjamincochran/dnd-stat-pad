import { Router } from 'express'
import Roll from 'roll'
import { Campaign } from '../schema'
import mailer from '../mailer'
  
const router = Router()
const sides = 6

const rerollOnes = function(results) {
  let onesCount = results.filter(function (result) {
    return result === 1
  }).length
  if (!onesCount) {
    return results
  }
  let rerolledResults = results.concat([])
  for (let i = 0; i < onesCount; i++) {
    rerolledResults.push(Math.floor(Math.random() * (sides - 1))%(sides - 1) + 2)
  }
  return rerolledResults
}

function unsortedEquals(a1, a2) {
  if (!a1 || !a2 || a1.length !== a2.length) return false
  let as1 = a1.slice().sort()
  let as2 = a2.slice().sort()
  for (let i = 0, ii = as1.length; i < ii; i++) {
    if (as1[i] !== as2[i]) return false
  }
  return true
}

router.get('/characters/:id', function (req, res, next) {
  Campaign
    .findOne({'characters._id': req.params.id}, 'diceCount fixedOrder rerollOnes created name characters.$')
    .then((campaign) => {
      if (!campaign || campaign.characters.length !== 1) return res.sendStatus(404)
      res.json({
        campaign: {
          name: campaign.name,
          diceCount: campaign.diceCount,
          fixedOrder: campaign.fixedOrder,
          rerollOnes: campaign.rerollOnes,
          created: campaign.created
        },
        character: campaign.characters[0]
      })
    })
    .catch((e) => res.status(500).end(e.message));
})

router.post('/characters/:id/roll', function(req, res, next) {
  // expect index; generate die values, calculate sum, store sum, return both dice and total
  Campaign
    .findOne({'characters._id': req.params.id}, 'diceCount fixedOrder rerollOnes characters.$')
    .then((campaign) => {
      if (!campaign || campaign.characters.length !== 1) return res.sendStatus(404)
      if (!Number.isInteger(req.body.index) || campaign.characters[0].stats[req.body.index]) {
        return Promise.reject({message: 'No munchkins allowed! (bad roll)'})
      }
      let transformations = [['best-of', 3], 'sum']
      if (campaign.rerollOnes) {
        transformations.splice(0, 0, rerollOnes)
      }
      let roll = (new Roll()).roll({
        quantity: campaign.diceCount,
        sides,
        transformations
      })
      let setArgs = {}
      setArgs['characters.$.stats.' + req.body.index] = roll.result
      if (campaign.fixedOrder && campaign.characters[0].stats.filter((stat) => !stat).length <= 1) {
        setArgs['characters.$.finalized'] = true
      }
      return Campaign.findOneAndUpdate(
        { 'characters': { $elemMatch: { '_id': req.params.id, 'finalized': false } } }, 
        { $set: setArgs },
        { new: true, projection: { 'characters': { $elemMatch: { '_id': req.params.id } } } }
      ).then((campaign) => Promise.resolve({
        campaign, 
        stat: roll.result,
        dice: roll.calculations[2]
      }))
    })
    .then((response) => res.json(response))
    .catch((e) => {
      console.error(e)
      res.status(500).end(e.message)
    })
})

router.post('/characters/:id/arrange', function(req, res, next) {
  let arrangedStats = req.body.stats // [7, 12, 16, 11, 10, 16]
  if (!arrangedStats) res.sendStatus(500)
  Campaign
    .findOne({ 'characters': { $elemMatch: {'_id': req.params.id, 'finalized': false } } })
    .then((campaign) => {
      if (!campaign || campaign.fixedOrder || !unsortedEquals(campaign.characters[0].stats, arrangedStats) ) {
        return Promise.reject({message: 'No munchkins allowed! (bad stats)'})
      }
      return Campaign.findOneAndUpdate( 
        { 'characters': { $elemMatch: { '_id': req.params.id, 'finalized': false } } },
        { $set: {'characters.$.stats': arrangedStats } }
      )
    })
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.error(error)
      res.sendStatus(500)
    })
})

router.post('/characters/:id/finalize', function(req, res, next) {
  Campaign.findOneAndUpdate(
    { 'characters': { $elemMatch: {'_id': req.params.id, 'finalized': false } } },
    { $set: { 'characters.$.finalized': true } }
  )
  .then(() => res.sendStatus(204))
  .catch((error) => {
    console.error(error)
    res.sendStatus(500)
  })
})

router.post('/characters/:id/invite', function(req, res, next) {
  Campaign
    .findOne({'characters._id': req.params.id}, 'name characters.$')
    .then((campaign) => {
      if (!campaign || campaign.characters.length !== 1) return res.sendStatus(404)
      return mailer.inviteOne(campaign, campaign.characters[0])
    })
    .then(() => res.sendStatus(204))
    .catch((error) => {
      console.error(error)
      res.status(500).end(error.message)
    })
})

export default router