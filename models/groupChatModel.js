let mongoose = require('mongoose');

let groupChatSchema = new mongoose.Schema(
  {
    creator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    limit: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

let Group = mongoose.model('Group', groupChatSchema);

module.exports = Group;
