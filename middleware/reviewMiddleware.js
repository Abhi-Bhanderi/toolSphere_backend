import asyncHandler from 'express-async-handler'

export const getToolAndUserID = asyncHandler(async (req, res, next) => {
   if (!req.body.toolId) req.body.toolId = req.params.toolId
   if (!req.body.user) req.body.user = req.user.id
   next()
})
