let { User, Chat } = require('./model');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Services {
  async new_user(payload) {
    try {
      let nickname = payload.nickname;
      let fullname = payload.fullname;
      let email = payload.email;
      let image = payload.image;
      let password = payload.password;

      if (!nickname || !fullname || !email || !image || !password) {
        return { status: 400, message: 'Kindly fill all required field' };
      }
      // Email validation function
      function validateEmail(email) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
      }

      const isValid = validateEmail(email);

      if (isValid) {
        console.log(isValid);
      } else {
        return { status: 400, messgae: 'Invalid email address' };
      }

      let user = await User.findOne({ email: email });

      if (user) {
        return { status: 200, message: 'This email has been used' };
      } else {
        // format the payload

        let data = {
          nickname: nickname,
          fullname: fullname,
          email: email,
          image: image,
          password: password,
        };

        // Save into the database
        let new_user = await User.create(data);

        //generate the jwt token
        let token = await jwt.sign(
          { id: new_user.id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );

        return {
          status: 201,
          message: 'User was created successfully',
          new_user,
          token,
        };
      }
    } catch (err) {
      console.log(err);
      return { status: 400, message: 'error creating new User' };
    }
  }

  async user_login(data) {
    try {
      let email = data.email;
      let password = data.password;

      if (!email || !password) {
        return { status: 400, message: 'Kindly fill all required field' };
      }

      // Email validation function
      function validateEmail(email) {
        const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return pattern.test(email);
      }

      const isValid = validateEmail(email);

      if (isValid) {
        console.log(' the email is Valid');
      } else {
        return { status: 400, messgae: 'Invalid email address' };
      }

      // 2). check if user exist and password is found in the database
      const user = await User.findOne({ email: email }).select('+password');

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return { status: 400, message: 'Incorrect email or password' };
      } else {
        //generate the jwt token
        let token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        return {
          status: 200,
          messgae: 'User login successfully',
          data: user,
          token,
        };
      }
    } catch (err) {
      console.log(err.message);
      return {
        status: 400,
        message: 'Error logging User in',
        errMsg: err.message,
      };
    }
  }

  async dashboard(data) {
    try {
      // //find all but exclude the id passed into
      let users = await User.find({ _id: { $nin: [data.id] } });

      return {
        status: 200,
        message: 'All users message was found successfully',
        dbCount: users.length,
        users,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting All chatroom message',
      };
    }
  }

  async getUserById(data) {
    try {
      let get_user = await User.findById({ _id: data.id });

      if (!get_user) {
        return { status: 404, message: 'this ID is not found' };
      }

      return {
        status: 200,
        message: 'User message was found successfully',
        get_user,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting user message',
        errMsg: err.message,
      };
    }
  }

  async updateUserById(data1) {
    try {
      if (!data1.nickname) {
        return {
          status: 400,
          message: 'Kindly supply the nickname to be updated',
        };
      }

      let data = { nickname: data1.nickname };

      let getUser = await Chat.findOne({ _id: data1.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_Msg = await Chat.updateOne({ _id: data1.id }, data);

      let updated_Msg = await Chat.findOne({ _id: data1.id });

      return {
        status: 200,
        message: 'User nickname was updated successfully',
        updated_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error updating user nickname',
        errMsg: err.message,
      };
    }
  }

  async get_all_users() {
    try {
      let get_all_user = await User.find();

      return {
        status: 200,
        message: 'All users message was found successfully',
        dbCount: get_all_user.length,
        get_all_user,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting All chatroom message',
        errMsg: err.message,
      };
    }
  }

  async deleteUserById(data) {
    try {
      let getUser = await User.findOne({ _id: data.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_User = await Chat.deleteOne({ _id: getUser.id });

      return {
        status: 204,
        message: 'User message was deleted successfully',
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting chatroom message',
      };
    }
  }
}

module.exports = Services;
