import mongoose from 'mongoose';

const groupChatSchema = new mongoose.Schema({
  hangoutId: mongoose.Schema.Types.ObjectId,
  users: [
    {
      uid: String,
      name: String,
      photoURL: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.GroupChat || mongoose.model('GroupChat', groupChatSchema);
