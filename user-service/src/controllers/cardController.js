import Card from '../models/cardModel.js'
import { logger, objectFormatter } from '../utils/logger.js'
import { isTokenValid } from '../utils/token.js'
import {
  findDefaultCard,
  isCardMine,
  findCardByNumber,
  findAllCardsById,
  findCardById,
  deleteCardById
} from '../common/card.js'
import { findUserById } from '../common/user.js'

const createCard = async (req, res) => {
  const prefix = 'createCard'

  try {
    logger.http({ prefix, message: 'Request incoming...' })

    const { number, userId } = req.body

    logger.http({
      prefix,
      message: `Searching for existing card with number: ${number}`
    })
    const existingCard = await findCardByNumber(number)
    if (existingCard) {
      logger.error({ prefix, message: 'Card already exists' })
      return res.json({ errors: 'Card already exists' })
    }

    logger.http({
      prefix,
      message: `Searching for existing user to attach the card with id: ${userId}`
    })

    const existingUser = await findUserById(userId)
    if (!existingUser) {
      logger.error({
        prefix,
        message: "The user you're trying to attach this card does not exist"
      })
      return res.json({
        errors: "The user you're trying to attach this card does not exist"
      })
    }

    const newCard = new Card({ ...req.body })
    logger.http({
      prefix,
      message: `Creating card with data: ${objectFormatter(newCard)}`
    })
    await newCard.save()

    logger.http({ prefix, message: 'Card created successfully' })
    logger.http({ prefix, message: 'Request finished...' })

    res.json(newCard)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getCard = async (req, res) => {
  const prefix = 'getCard'

  try {
    logger.info({ prefix, message: 'Request incoming...' })
    const { id } = req.params

    const defaultCard = await findDefaultCard(id)
    if (defaultCard.length === 0) {
      logger.error({ prefix, message: 'Default card not found' })
      return res.json({ errors: 'Default card not found' })
    }

    res.json(defaultCard)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const getAllCards = async (req, res) => {
  const prefix = 'getAllCards'
  try {
    logger.info({ prefix, message: 'Request incoming...' })

    const { id } = req.params

    const cards = await findAllCardsById(id)
    if (!cards) {
      logger.error({ prefix, message: 'No cards found for this ser' })
      return res.json({ errors: 'No cards found for this ser' })
    }

    logger.info({ prefix, message: 'Request finished...' })
    res.json(cards)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const updateCard = async (req, res) => {
  const prefix = 'updateCard'

  try {
    const { id } = req.params
    const { userId } = req.body

    logger.http({ prefix, message: 'Request incoming...' })

    logger.http({
      prefix,
      message: `Searching card with id: ${objectFormatter(id)}`
    })

    const existingCard = await findCardById(id)
    if (!existingCard) {
      logger.error({ prefix, message: 'Card not found' })
      return res.status(400).json({ errors: 'Card not found' })
    }

    logger.http({
      prefix,
      message: `Searching user with id: ${objectFormatter(userId)}`
    })
    const existingUser = await findUserById(userId)
    if (!existingUser) {
      logger.error({
        prefix,
        message: "The user you're trying to attach this card does not exist"
      })
      return res.json({
        errors: "The user you're trying to attach this card does not exist"
      })
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
    logger.http({ prefix, message: 'Request finished...' })

    res.json(existingCard)
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

const deleteCard = async (req, res) => {
  const prefix = 'deleteCard'

  try {
    const { id } = req.params

    logger.http({ prefix, message: 'Request incoming...' })

    const validatedToken = isTokenValid(req.headers.authorization)
    if (validatedToken.err) {
      logger.error({ prefix, message: validatedToken.data })
      return res.status(400).send({ errors: validatedToken.data })
    }
    logger.http({
      prefix,
      message: `Valid token: ${objectFormatter(validatedToken.data)}`
    })

    logger.http({
      prefix,
      message: `Searching card with id: ${objectFormatter(id)}`
    })

    const existingCard = await findCardById(id)
    if (!existingCard) {
      logger.error({ prefix, message: 'Card not found' })
      return res.status(400).json({ errors: 'Card not found' })
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

    await deleteCardById(id)

    logger.http({ prefix, message: `Card deleted successfully` })
    logger.http({ prefix, message: 'Request finished...' })

    res.json({ message: 'Card deleted successfully' })
  } catch (err) {
    logger.error({ prefix, message: err.message })
    return res.json({ errors: 'Something went wrong' })
  }
}

export { createCard, getCard, getAllCards, updateCard, deleteCard }
