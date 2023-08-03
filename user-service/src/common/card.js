import Card from '../models/cardModel.js'
import { isTokenValid } from '../utils/token.js'

const findDefaultCard = (id) => Card.find({ userId: id, default: true })
const findCardById = (id) => Card.findOne({ _id: id })
const findCardByNumber = (number) => Card.findOne({ number })
const findAllCardsById = (id) => Card.find({ userId: id })
const deleteCardById = (id) => Card.findByIdAndDelete(id)

const isCardMine = (authorization, existingCard) => {
  const token = isTokenValid(authorization)
  return existingCard.userId === token.data.id
}

export {
  findDefaultCard,
  findCardById,
  findCardByNumber,
  findAllCardsById,
  deleteCardById,
  isCardMine
}
