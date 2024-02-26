let mongoose = require('mongoose');

let chatSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: [true, 'kindly enter your message'],
      trim: true,
    },
  },
  { timestamps: true }
);

let Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
