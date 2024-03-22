let mongoose = require('mongoose');

let my_contactSchema = new mongoose.Schema(
  {
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

let My_Contacts = mongoose.model('My_Contacts', my_contactSchema);

module.exports = My_Contacts;
