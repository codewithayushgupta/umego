// models/Hangout.js
import mongoose from 'mongoose';

// models/Hangout.js
const hangoutSchema = new mongoose.Schema({
  eventName: String,
  location: String,
  dateTime: Date,
  tags: [String],
  maxPeople: Number,
  expiresAt: Date,
  createdBy: {
    uid: String,
    name: String,
    photoURL: String,
    email: String
  },
  approvedMembers: [
    {
      uid: String,
      name: String,
      photoURL: String,
      email: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.models.Hangout || mongoose.model('Hangout', hangoutSchema);
