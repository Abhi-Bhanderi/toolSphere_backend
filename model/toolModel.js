import mongoose from 'mongoose'

const toolSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },

      name: {
         type: String,
         required: [true, 'Title is Required'],
      },

      websiteURL: {
         type: String,
         unique: [
            true,
            'This URL already exist, Please Provide Different Website URL',
            2,
         ],
         required: [true, 'Link is Required'],
      },

      mainImageURL: {
         type: String,
         unique: [
            true,
            'This imageURL already exist, Please Provide Different Image URL',
         ],
         required: [true, 'Image URL is Required'],
      },

      aiToolLogoURL: {
         type: String,
         unique: [
            true,
            'This Logo already exist, Please Provide Different Logo URL',
         ],
         required: [true, 'Image URL is Required'],
      },

      description: {
         type: String,
         required: [true, 'Description must be provided'],
      },

      founderTopic: String,
      uniqueTopic: String,

      features: {
         type: String,
         required: [true, 'Features must be provided'],
      },
      useCases: {
         type: String,
         required: [true, 'Use Cases must be provided'],
      },
      benefits: String,
      drawbacks: String,

      informationLinks: {
         aboutLink: String,
         blogLink: String,
         guidesTutorialsLink: String,
      },

      socialLinks: {
         emailAddress: String,
         x: String,
         discord: String,
         slack: String,
         github: String,
         youtube: String,
         facebook: String,
         instagram: String,
         threads: String,
         linkedin: String,
         reddit: String,
         medium: String,
         pinterest: String,
      },

      isAIdictVerified: {
         type: Boolean,
         default: false,
      },

      pricingType: {
         type: String,
         required: [true, 'Pricing Type is Required'],
         enum: ['Free', 'Freemium', 'Paid'],
      },

      pricing: String,

      pricingPlansLink: String,

      availableFor: {
         type: [String],
         required: [true, 'availableFor field is Required'],
      },

      availableForLinks: {
         openSourceLink: String,
         waitlistLink: String,
         mobileAppLink: {
            androidAppLink: String,
            iosAppLink: String,
         },
         apiPlansLink: String,
         extensionLink: String,
         pcSoftwareLink: String,
      },

      isExternalSources: Boolean,

      externalSources: {
         pricingPlansRef: String,
         guidesTutorialsRef: String,
      },

      hashtags: {
         type: [String],
         required: [true, 'Hashtags is Required'],
      },

      references: {
         type: [String],
         required: [false, 'References is required'],
      },

      slug: String,

      popularity: {
         type: Number,
         default: 0,
      },

      isUserFavorite: { type: Boolean, default: false },
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
)

toolSchema.index({ pricingType: 1, availableFor: 1 })

// Virtual Populate
toolSchema.virtual('reviews', {
   ref: 'Review',
   foreignField: 'toolId',
   localField: '_id',
})

toolSchema.pre('find', function (next) {
   this.select('-__v -user')
   next()
})

toolSchema.pre('save', function (next) {
   console.log('.pre is working in post request')
   next()
})

export default mongoose.model('Tool', toolSchema)
