import nodemailer from 'nodemailer'
import mailTemplates from './templates'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dndstatpad@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
})

function inviteOne (campaign, character) {
  return transporter.sendMail({
    to: character.email,
    from: '"D&D Stat Pad" <dndstatpad@gmail.com>',
    subject: mailTemplates.generateSubject(campaign),
    text: mailTemplates.generateText(character)
  })
}

function inviteAll (campaign) {
  var inviteOneWithCampaign = inviteOne.bind(this, campaign)
  return Promise.all(campaign.characters.map(inviteOneWithCampaign)).then(() => Promise.resolve(campaign))
}

export default {
  inviteAll,
  inviteOne
}
