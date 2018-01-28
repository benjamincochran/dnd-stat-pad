const subjectTemplate = 'You\'ve been invited to roll up a character for {{ campaignName }}'
const textTemplate = 'Come roll the dice at https://dnd-stat-pad.herokuapp.com/characters/{{ characterId }}'

function generateSubject (campaign) {
  return subjectTemplate.replace('{{ campaignName }}', campaign.name)
}

function generateText (character) {
  return textTemplate.replace('{{ characterId }}', character._id)
}

export default {
  generateSubject,
  generateText
}
