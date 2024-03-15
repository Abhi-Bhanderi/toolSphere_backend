import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
   {
      userName: {
         type: String,
         required: [true, 'Please, Add your name'],
      },

      userEmail: {
         type: String,
         required: [true, 'Please, Add your email'],
         uniqe: true,
      },

      userImageURL: {
         type: String,
         uniqe: true,
      },

      password: {
         type: String,
         uniqe: true,
         select: false,
      },

      userUID: {
         type: String,
         uniqe: true,
      },
      role: {
         type: String,
         enum: ['user', 'admin'],
         default: 'user',
      },
      favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tool' }],
   },

   {
      timestamps: true,
   }
)

export default mongoose.model('User', userSchema)
