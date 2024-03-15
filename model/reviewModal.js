import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema(
   {
      review: {
         type: String,
         required: [true, 'Review can not be empty'],
      },
      rating: {
         type: Number,
         min: 1,
         max: 5,
      },
      toolId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Tool',
         required: [true, 'Review must belong to a certain Tool.'],
      },
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: [true, 'Review must belong to a certain User.'],
      },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
)

reviewSchema.pre(/^find/, function (next) {
   this.populate({
      path: 'user',
      select: 'userName userImageURL',
   })
   // this.select('-__v');
   next()
})

export default mongoose.model('Review', reviewSchema)
