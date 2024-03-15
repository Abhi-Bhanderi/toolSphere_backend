/* eslint-disable no-unused-vars */

import asyncHandler from 'express-async-handler'
import AppError from '../utils/appError.js'

export const deleteOne = (Model) =>
   asyncHandler(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id)

      if (!doc) {
         return next(new AppError('No document found with that ID', 404))
      }

      res.status(204).json({
         status: true,
         code: 204,
         data: undefined,
      })
   })

export const updateOne = (Model) =>
   asyncHandler(async (req, res, next) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
         runValidators: true,
      })

      if (!doc) {
         return next(new AppError(404, 'No document found with that ID'))
      }

      res.status(200).json({
         status: true,
         code: 200,
         data: doc,
      })
   })

export const createOne = (Model) =>
   asyncHandler(async (req, res, next) => {
      const doc = await Model.create(req.body)

      res.status(201).json({
         status: true,
         code: 201,
         data: doc,
      })
   })

export const createOneWithQuery = asyncHandler(async (res, query, next) => {
   try {
      const doc = await query

      res.status(201).json({
         status: true,
         code: 201,
         data: doc,
      })
   } catch (error) {
      next(error)
   }
})

export const getOne = (Model, popOptions) =>
   asyncHandler(async (req, res, next) => {
      let query = Model.findById(req.user.id)
      if (popOptions) query = query.populate(popOptions)
      const doc = await query
      console.log(doc)

      res.status(200).json({
         status: true,
         code: 200,
         results: doc.length,
         data: doc.favorites,
      })
   })

export const getAll = (Model, popOptions) =>
   asyncHandler(async (req, res, next) => {
      let query = Model.find()
      if (popOptions) query = query.populate(popOptions)
      const doc = await query

      res.status(200).json({
         status: true,
         code: 200,
         results: doc.length,
         data: doc,
      })
   })
