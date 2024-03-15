/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import asyncHandler from 'express-async-handler'

import Tool from '../model/toolModel.js'
import User from '../model/userModel.js'
import Hashtag from '../model/hashtagsModal.js'
import {
   createOne,
   createOneWithQuery,
   deleteOne,
   getAll,
   updateOne,
} from './factoryHandler.js'
import AppError from '../utils/appError.js'

// GET ALL THE TOOL
export const getAllTools = asyncHandler(async (req, res, next) => {
   let data
   if (req.headers.authorization) {
      const user = await User.findById(req.userID).populate({
         path: 'favorites',
         select: '_id',
      })

      data = await Tool.find().skip(req.skip).limit(req.limit)
      data = data.map((product) => {
         const isUserFavorite = user.favorites.some((favorite) =>
            favorite._id.equals(product._id)
         )
         return { ...product.toJSON(), isUserFavorite }
      })
   } else {
      data = await Tool.find({}, { isUserFavorite: 0 })
         .skip(req.skip)
         .limit(req.limit)
   }

   res.status(200).json({
      status: true,
      code: 200,
      results: data.length,
      data,
   })
})

// GET Single TOOL
export const getSingleTool = asyncHandler(async (req, res, next) => {
   let data

   if (req.headers.authorization) {
      const user = await User.findById(req.userID).populate('favorites')

      data = await Tool.findById(req.params.id).populate('reviews')

      const isUserFavorite = user.favorites.some((favorite) =>
         favorite._id.equals(data._id)
      )
      data = {
         ...data._doc,
         reviews: [...data.$$populatedVirtuals.reviews],
         isUserFavorite,
      }
   } else {
      data = await Tool.findById(req.params.id, {
         isUserFavorite: 0,
      }).populate('reviews')
   }

   if (!data) {
      return next(
         new AppError(404, 'No AI tool found with this id:' + req.params.id)
      )
   }

   res.status(200).json({
      status: true,
      code: 200,
      data,
   })
})

// GET Related TOOLS
export const getRelatedData = asyncHandler(async (req, res, next) => {
   if (!req.query.hashtags) {
      return next(
         new AppError(
            400,
            'Provide minimum one hashtag to get related data for this AI tool.'
         )
      )
   }
   const data = await Tool.find({
      hashtags: { $in: req.query.hashtags.split(',') },
   })
   res.status(200).json({
      status: true,
      code: 200,
      data,
   })
})

export const getDataWithParams = asyncHandler(async (req, res, next) => {
   const { pricingType, availableFor, sort, search, type } = req.query
   console.log(search)
   const queryObject = {}

   if (pricingType) {
      queryObject.pricingType = pricingType.split(',')
   }

   if (availableFor) {
      const availableFor_Arr = availableFor.split(',')
      queryObject.availableFor = { $in: availableFor_Arr }
   }

   if (type) {
      if (type === 'name') {
         queryObject.name = { $regex: search, $options: 'i' }
      }
      if (type === 'hashtags') {
         queryObject.hashtags = { $regex: search, $options: 'i' }
      }
   }

   let api_query_W_Auth = Tool.find(queryObject).skip(req.skip).limit(req.limit)

   if (sort === 'AIdictVerified') {
      queryObject.isAIdictVerified = true
   }

   if (sort === 'popular') {
      api_query_W_Auth = api_query_W_Auth.sort('-popularity')
   }

   if (sort === 'newlyAdded') {
      api_query_W_Auth = api_query_W_Auth.sort('-createdAt')
   }

   let data

   if (req.headers.authorization) {
      const user = await User.findById(req.userID).populate({
         path: 'favorites',
         select: '_id',
      })

      data = await api_query_W_Auth
      data = data.map((data) => {
         const isUserFavorite = user.favorites.some((favorite) =>
            favorite._id.equals(data._id)
         )
         return { ...data.toJSON(), isUserFavorite }
      })
   } else {
      let api_query_WO_Auth = Tool.find(queryObject, { isUserFavorite: 0 })
         .skip(req.skip)
         .limit(req.limit)

      if (sort === 'isAIdictVerified') {
         queryObject.isAIdictVerified = true
      }

      if (sort === 'popular') {
         api_query_WO_Auth = api_query_WO_Auth.sort('-popularity')
      }

      if (sort === 'newlyAdded') {
         api_query_WO_Auth = api_query_WO_Auth.sort('-createdAt')
      }
      data = await api_query_WO_Auth
   }

   return res.status(200).json({
      status: true,
      code: 200,
      message: 'Tool has been filtered successfully!',
      results: data.length,
      data,
   })
})

export const createTool = asyncHandler(async (req, res, next) => {
   createOneWithQuery(
      res,
      Tool.create({
         ...req.body,
         hashtags: req.body.hashtags.split(', '),
         // references: req.body.references.split(', '),
      }),
      next
   )
})

// Update Tool
export const updateTool = updateOne(Tool)

// Delete Tool
export const deleteTool = deleteOne(Tool)

// Get Favorites
export const getFavorites = asyncHandler(async (req, res) => {
   let favorites = await User.findById(req.user.id).populate({
      path: 'favorites',
      select:
         'name description mainImageURL websiteURL isAIdictVerified popularity hashtags',
   })

   res.status(200).json({
      status: true,
      code: 200,
      results: favorites.length,
      data: favorites.favorites,
   })
})

export const addToFavorites = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id)
   if (!user) return next(new AppError(404, 'User not Found!'))

   if (user.favorites.includes(req.params.toolID)) {
      return next(
         new AppError(400, 'This tool is already in your favorite list')
      )
   }

   await User.findByIdAndUpdate(
      req.user.id,
      {
         $push: { favorites: req.params.toolID },
      },
      { new: true, runValidators: true }
   )

   const favoritedTool = await Tool.findByIdAndUpdate(
      req.params.toolID,
      {
         $inc: { popularity: 1 },
         isUserFavorite: true,
      },
      { new: true, runValidators: true }
   ).select('name websiteURL popularity')

   res.status(200).json({
      status: true,
      code: 200,
      message: 'Added to your favorite list',
      data: favoritedTool,
   })
})

export const removeFavorites = asyncHandler(async (req, res, next) => {
   const user = await User.findById(req.user.id)
   if (!user) return next(new AppError(404, 'User not Found!'))

   if (!user.favorites.includes(req.params.toolID)) {
      return next(
         new AppError(
            400,
            'You have no tool with this corresponding ID',
            req.params.toolID
         )
      )
   }

   await User.findByIdAndUpdate(
      req.user.id,
      {
         $pull: { favorites: req.params.toolID },
      },
      { new: true, runValidators: true }
   )

   const removedTool = await Tool.findByIdAndUpdate(
      req.params.toolID,
      {
         $inc: { popularity: -1 },
         isUserFavorite: false,
      },
      { new: true, runValidators: true }
   ).select('name websiteURL popularity')

   res.status(200).json({
      status: true,
      code: 200,
      message: 'Removed from your favorite list',
      data: removedTool,
   })
})

export const removeAllFavorites = asyncHandler(async (req, res, next) => {
   // const user = await User.findByIdAndUpdate(req.user.id, { favorites: [] })

   const favorites = await User.findById(req.user.id).populate({
      path: 'favorites',
      select: 'id',
   })

   console.log(favorites)

   res.status(200).json({
      status: true,
      code: 200,
      message: 'All the favorites has been removed from your favorites list.',
   })
})

// -> Hashtags
export const getAllHashtags = getAll(Hashtag)
export const createHashtag = createOne(Hashtag)
export const updateHashtag = updateOne(Hashtag)
export const deleteHashtag = deleteOne(Hashtag)
