import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dndstatpad@gmail.com',
    pass: process.env.EMAIL_PASSWORD
  }
})

function inviteAll(campaign) {
  return Promise.all(campaign.characters.map(function(character) {
    return transporter.sendMail({
      to: character.email,
      from: '"D&D Stat Pad" <dndstatpad@gmail.com>',
      subject: `You've been invited to roll up a character for ${campaign.name}`,
      text: `Come roll the dice at https://dnd-stat-pad.herokuapp.com/characters/${character._id}`
    })
  })).then(() => Promise.resolve(campaign))
}

export default {
  inviteAll: inviteAll,
  invite: Promise.resolve
}