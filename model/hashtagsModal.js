import mongoose from 'mongoose'

const hashtagSchema = new mongoose.Schema({
   hashtagName: {
      type: String,
      unique: [true, 'The hashtag name must be unique'],
      required: [true, 'hashtagName is Required'],
   },
   hashtagValue: {
      type: String,
      unique: [true, 'The hashtag value must be un'],
      required: [true, 'hashtagValue Required'],
   },
})

export default mongoose.model('Hashtag', hashtagSchema)
