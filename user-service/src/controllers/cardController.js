import Card from '../models/cardModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import { RESPONSE_TYPES } from '../utils/responseTypes.js'
import { isTokenValid } from '../utils/token.js'

const isCardMine = (authorization, existingCard) => {
  const token = isTokenValid(authorization)
  return existingCard.userId === token.data.id
}

const createCard = async (req, res) => {
  const prefix = 'createCard'

  try {
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_INCOMING })

    const { number } = req.body

    const existingCard = await Card.findOne({ number: number })
    if (existingCard) {
      logger.error({ prefix, message: RESPONSE_TYPES.EXISTING_CARD })
      return res.json({ errors: RESPONSE_TYPES.EXISTING_CARD })
    }

    const newCard = new Card({ ...req.body })
    logger.http({
      prefix,
      message: `Creating card with data: ${objectFormatter(newCard)}`
    })
    await newCard.save()

    logger.http({ prefix, message: 'Card created successfully' })
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    res.json(newCard)
  } catch (err) {
    logger.error({ prefix, message: err.message })
  }
}

const updateCard = async (req, res) => {
  const prefix = 'updateCard'

  try {
    const { id } = req.body

    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_INCOMING })
    logger.http({
      prefix,
      message: `Searching card with id: ${objectFormatter(id)}`
    })

    const existingCard = await Card.findOne({ _id: id })
    if (!existingCard) {
      logger.error({ prefix, message: RESPONSE_TYPES.CARD_NOT_FOUND })
      return res.status(400).json({ errors: RESPONSE_TYPES.CARD_NOT_FOUND })
    }

    // check if the card belongs to te user
    if (isCardMine(req.headers.authorization, existingCard)) {
      logger.error({
        prefix,
        message: "You don't have permission to update this card"
      })
      return res
        .status(401)
        .json({ errors: "You don't have permission to update this card" })
    }

    logger.http({
      prefix,
      message: `Updating card with data: ${objectFormatter(req.body)}`
    })

    existingCard.set({ ...req.body })
    await existingCard.save()

    logger.http({ prefix, message: `card updated successfully` })
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    res.json(existingCard)
  } catch (err) {
    logger.error({ prefix, message: err.message })
  }
}

const deleteCard = async (req, res) => {
  const prefix = 'deleteCard'

  try {
    const { id } = req.body

    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_INCOMING })
    logger.http({
      prefix,
      message: `Searching card with id: ${objectFormatter(id)}`
    })

    const existingCard = await Card.findOne({ _id: id })
    if (!existingCard) {
      logger.error({ prefix, message: RESPONSE_TYPES.CARD_NOT_FOUND })
      return res.status(400).json({ errors: RESPONSE_TYPES.CARD_NOT_FOUND })
    }

    // check if the card belongs to te user
    if (isCardMine(req.headers.authorization, existingCard)) {
      logger.error({
        prefix,
        message: "You don't have permission to delete this card"
      })
      return res
        .status(401)
        .json({ errors: "You don't have permission to delete this card" })
    }

    logger.http({
      prefix,
      message: `Deleting card`
    })

    await Card.findByIdAndDelete(id)

    logger.http({ prefix, message: `Card deleted successfully` })
    logger.http({ prefix, message: RESPONSE_TYPES.REQUEST_FINISHED })

    res.json({ message: 'Card deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
  }
}

export { createCard, updateCard, deleteCard }
