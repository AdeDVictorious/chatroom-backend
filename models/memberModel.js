let mongoose = require('mongoose');

let memberSchema = new mongoose.Schema(
  {
    group_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

let Member = mongoose.model('Member', memberSchema);

module.exports = Member;
