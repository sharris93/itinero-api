import mongoose from 'mongoose'

const activitySchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please provide a title'] },
  description: { type: String, required: [true, 'Please provide a description'] },
  duration: { type: Number, required: [true, 'Please provide a duration'] },
  location: { type: String, required: [true, 'Please provide a location'] },
  tags: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Activity = mongoose.model('Activity', activitySchema)
export default Activity