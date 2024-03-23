let { User, Chat, My_contact, My_Contact } = require('./model');
let jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class Services {
  async new_user(payload) {
    try {
      let nick_name = payload.nickname;
      let full_name = payload.fullname;
      let email = payload.email;
      let image = payload.image;
      let password = payload.password;

      let nickname = nick_name.trim();
      let fullname = full_name.trim();

      if (!nickname || !fullname || !email || !image || !password) {
        return { status: 422, message: 'Kindly fill all required field' };
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
        return { status: 422, message: 'Kindly fill all required field' };
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
      const Users = await User.findOne({ email: email });

      if (!Users || !(await bcrypt.compare(password, Users.password))) {
        return { status: 400, message: 'Incorrect email or password' };
      } else {
        //generate the jwt token
        let token = await jwt.sign({ id: Users._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // find the user excluding password, createdAt & updatedAt
        const user = await User.findOne({ email: email }).select(
          '-password -createdAt -updatedAt'
        );

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
      };
    }
  }

  async dashboard(data) {
    try {
      // // //find all but exclude the id passed into
      let users = await My_Contact.find({
        user_id: data.id,
      })
        .populate('contact_id')
        .sort({ _id: -1 });

      return {
        status: 200,
        message: 'All users message was found successfully',
        dbCount: users.length,
        users,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting All chatroom message',
      };
    }
  }

  async my_profile(payload) {
    try {
      // check if the payload is not empty
      if (!payload.id) {
        return { status: 404, message: 'id is missing' };
      }

      // format the payload
      let data = {
        user_id: payload.id,
      };

      // find User by ID
      let userData = await User.findById({ _id: data.user_id });

      let isOwner = userData.nickname ? true : false;
      let url = `http://localhost:8000/chat_me_link/${userData._id}`;

      return {
        status: 200,
        message:
          'copy & share the link below to friends and family, inorder for them to chat you up',
        url,
        userData,
        isOwner,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error adding new member',
      };
    }
  }

  async get_userById(data) {
    try {
      // check if user exist with the ID
      let get_user = await User.findById({ _id: data.id });

      // check if user does not exist with the ID
      if (!get_user) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        // return the user found back to the client
        return {
          status: 200,
          message: 'User was found successfully',
          get_user,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting user by ID',
      };
    }
  }

  async update_userById(payload) {
    try {
      if (!payload.nickname) {
        return {
          status: 422,
          message: 'Kindly supply the nickname to be updated',
        };
      }

      let data = { nickname: payload.nickname };

      let getUser = await User.findOne({ _id: payload.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_Msg = await User.updateOne({ _id: payload.id }, data);

      let updated_User = await User.findOne({ _id: payload.id });

      return {
        status: 200,
        message: 'User nickname was updated successfully',
        updated_User,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error updating user nickname',
      };
    }
  }

  async get_all_users() {
    try {
      // find all Users
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
        status: 400,
        message: 'Error getting All chatroom message',
      };
    }
  }

  async delete_userById(data) {
    try {
      let getUser = await User.findById({ _id: data.id });

      console.log(data, getUser, 'Data');

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_User = await User.deleteOne({ _id: getUser._id });

      return {
        status: 204,
        message: 'User message was deleted successfully',
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting chatroom message',
      };
    }
  }
}

module.exports = Services;
