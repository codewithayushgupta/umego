import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  hangoutId: mongoose.Schema.Types.ObjectId,
  sender: {
    uid: String,
    name: String,
    photoURL: String
  },
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
