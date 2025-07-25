
// models/Request.js
import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  hangoutId: mongoose.Schema.Types.ObjectId,
  user: {
    uid: String,
    name: String,
    email: String,
    photoURL: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Request || mongoose.model('Request', requestSchema);
