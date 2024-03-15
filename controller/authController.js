import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'

// Custom imports
import User from '../model/userModel.js'
import AppError from '../utils/appError.js'

const generateAccessToken = (id) => {
   const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
   })

   return accessToken
}
function generateRefreshToken(id) {
   const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1y',
   })
   return refreshToken
}

const AuthenticationResponse = (user, message, res) => {
   const accessToken = generateAccessToken(user._id)
   const refreshToken = generateRefreshToken(user._id)

   res.status(201).json({
      status: true,
      code: 201,
      message: message,
      user,
      accessToken,
      refreshToken,
   })
}

export const signUp = asyncHandler(async (req, res, next) => {
   const user = await User.findOne({
      userEmail: req.body.userEmail,
   }).select('-password')

   if (user) {
      return next(
         new AppError(409, 'This user already exist; login to continue...')
      )
   }

   const salt = await bcrypt.genSalt(12)
   const hashedPassword = await bcrypt.hash(req.body.password, salt)

   const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
   })

   AuthenticationResponse(
      newUser,
      `You have been successfully register as ${newUser.userName}`,
      res
   )
})

export const login = asyncHandler(async (req, res, next) => {
   const { userEmail, password } = req.body

   // 1) Check if email and password exist
   if (!userEmail || !password) {
      return next(new AppError(400, 'Please provide email and password!'))
   }

   // 2) Check if user exists && password is correct
   const user = await User.findOne({ userEmail }).select('+password')

   if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError(401, 'Incorrect email or password'))
   }

   // 3) If everything ok, send token to client
   AuthenticationResponse(
      user,
      `Welcome back ${user.userName}, It is good to see you.`,
      res
   )
})

export const google = asyncHandler(async (req, res) => {
   const { userEmail } = req.body

   const userExists = await User.findOne({ userEmail })
   if (userExists) {
      return AuthenticationResponse(
         userExists,
         'You have been successfully signed in.',
         res
      )
   }

   // Creating the user if all conditions are true
   const user = await User.create(req.body)

   // If the user is created then get the user info otherwise send the Error
   AuthenticationResponse(user, 'You have been successfully signed in.', res)
})

export const refreshToken = (req, res, next) => {
   const { refreshToken, userID } = req.body

   if (verifyRefreshToken(refreshToken)) {
      const accessToken = generateAccessToken(userID)

      res.status(200).json({
         status: true,
         code: 200,
         accessToken,
      })
   } else {
      return next(new AppError(400, 'Invalid Refresh Token'))
   }
}

function verifyRefreshToken(token) {
   try {
      // Verify the refresh token and check if it's valid
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
      return true
   } catch (error) {
      return false
   }
}
