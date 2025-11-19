import mongoose from 'mongoose';

const weekSchema = new mongoose.Schema({
  week_number: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date
  },
  deadlineDate: {
    type: Date
  },
  resources: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Week', weekSchema);

