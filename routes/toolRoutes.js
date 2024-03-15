import express from 'express'
const router = express.Router()

import { protect, restrictTo } from '../middleware/authMiddleware.js'
import { isUserLogged, pagination } from '../middleware/toolMiddleware.js'
import {
   getAllTools,
   getSingleTool,
   getDataWithParams,
   createTool,
   updateTool,
   deleteTool,
   getRelatedData,
   addToFavorites,
   getFavorites,
   removeFavorites,
   removeAllFavorites,
   getAllHashtags,
   createHashtag,
   updateHashtag,
   deleteHashtag,
} from '../controller/toolController.js'

// -> Everyone can access this routes -
router.route('/all').get(isUserLogged, pagination, getAllTools)
router.route('/tool/:id').get(isUserLogged, getSingleTool)
router.route('/filtered/').get(isUserLogged, pagination, getDataWithParams)
router.route('/related/').get(getRelatedData)

// -> Only admin can access this routes
router
   .route('/create')
   .post(protect, restrictTo('admin', 'moderator'), createTool)
router.route('/update/:id').put(protect, restrictTo('admin'), updateTool)
router.route('/delete/:id').delete(protect, restrictTo('admin'), deleteTool)

// -> For hashtags
router.route('/hashtag/all').get(protect, restrictTo('admin'), getAllHashtags)
router
   .route('/create/hashtag/')
   .post(protect, restrictTo('admin'), createHashtag)
router.route('/update/:id').put(protect, restrictTo('admin'), updateHashtag)
router.route('/delete/:id').put(protect, restrictTo('admin'), deleteHashtag)

// -> Both user and admin can access this routes
router.route('/add/user/favorite/:toolID').post(protect, addToFavorites)
router.route('/get/user/favorite/all').get(protect, getFavorites)
router.route('/remove/user/favorite/:toolID').delete(protect, removeFavorites)
router.route('/remove/user/favorites/all').delete(protect, removeAllFavorites)

export default router
