let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: [true, 'kindly enter your Nickname!'],
      default: 'general',
    },
    fullname: {
      type: String,
      required: [true, 'kindly enter your fullname!'],
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    is_online: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //has the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //This delete the passwordConform field and it will not be saved in the database
  this.passwordConfirm = undefined;
});

const Users = mongoose.model('Users', userSchema);

module.exports = Users;
