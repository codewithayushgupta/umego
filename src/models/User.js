// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  uid: String,
  name: String,
  email: String,
  photoURL: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.User || mongoose.model('User', userSchema);
