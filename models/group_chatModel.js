let mongoose = require('mongoose');

let group_chatSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    message: {
      type: String,
      required: [true, 'kindly enter your message'],
      trim: true,
    },
  },
  { timestamps: true }
);

let Group_Chat = mongoose.model('Group_Chat', group_chatSchema);

module.exports = Group_Chat;
