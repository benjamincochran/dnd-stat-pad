import { Router } from 'express'
import { Campaign } from '../schema'   

const router = Router()

router.get('/campaigns/:id', function (req, res, next) {
  Campaign
    .findById(req.params.id)
    .then((campaign) => {
      if (!campaign) return res.sendStatus(404)
      res.json(campaign)
    })
    .catch((e) => res.status(500).end(e.message));
})

router.post('/campaigns', function (req, res, next) {
  try {
    let diceCount = req.body.diceCount
    let emails = req.body.emails
    let fixedOrder = req.body.fixedOrder
    let name = req.body.name
    Campaign.create({
      diceCount: diceCount,
      fixedOrder: fixedOrder,
      name: name,
      characters: emails.map((email) => {
        return {
          email: email,
          finalized: false,
          stats: (new Array(6)).fill(null)
        }
      })
    })
    .then((campaign) => res.send({ id: campaign._id }))
    .catch((error) => {
      console.error(error)
      res.status(500).json({
        error: error
      })
    })
  }
  catch (e) {
    console.error(error.message)
    res.status(500).end({
      error: e.message
    });
  }
})

export default router