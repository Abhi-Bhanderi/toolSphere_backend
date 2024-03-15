import express from 'express'
import { getAllReview, createReview } from '../controller/reviewController.js'
import { protect } from '../middleware/authMiddleware.js'
import { getToolAndUserID } from '../middleware/reviewMiddleware.js'

const router = express.Router()

router.route('/all').get(getAllReview)
router.route('/create/:toolId').post(protect, getToolAndUserID, createReview)

export default router
