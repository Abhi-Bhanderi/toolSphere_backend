/* eslint-disable no-unused-vars */
import Review from '../model/reviewModal.js'
import { createOne, getAll } from '../controller/factoryHandler.js'

const getAllReview = getAll(Review)
const createReview = createOne(Review)

export { getAllReview, createReview }
