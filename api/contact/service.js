let { User, My_Contact } = require('./model');
// let mongoose = require('mongoose');

class Services {
  // Add a contact by group creator/Admin
  async add_contacts(payload) {
    try {
      // check if the payload is not empty
      if (!payload.contact_id || !payload.user_id) {
        return { status: 422, message: 'contact_id or user_id is missing' };
      }

      // format the data
      let user_data = {
        contact_id: payload.contact_id,
        user_id: payload.user_id,
      };

      // // format the data
      let contact_data = {
        contact_id: payload.user_id,
        user_id: payload.contact_id,
      };

      // check if Contact already exist
      let getContact = await My_Contact.findOne({
        contact_id: payload.contact_id,
        user_id: payload.user_id,
      });

      // check if Contact already exist
      let get_contact = await My_Contact.findOne({
        contact_id: payload.user_id,
        user_id: payload.contact_id,
      });

      if (getContact) {
        return { status: 200, message: 'Contact already exist' };
      } else if (get_contact) {
        return { status: 200, message: 'Contact already exist' };
      } else {
        //  save to database
        let joincontact = await My_Contact.create(user_data);

        //  save to database
        let join_contact = await My_Contact.create(contact_data);

        return {
          status: 201,
          message: 'New contact added successfully',
          joincontact,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error adding adding new contact',
      };
    }
  }

  // async get_contacts(payload, userInfo) {
  //   try {
  //     // format the payload
  //     let data = {
  //       contact_id: payload.id,
  //       user_id: userInfo.id,
  //     };

  //     //find all but exclude the id passed into
  //     let users = await User.aggregate([
  //       {
  //         $lookup: {
  //           from: 'my_contacts',
  //           localField: '_id',
  //           foreignField: 'user_id',
  //           pipeline: [
  //             {
  //               $match: {
  //                 $expr: {
  //                   $and: [
  //                     {
  //                       $eq: [
  //                         '$contact_id',
  //                         new mongoose.Types.ObjectId(data.contact_id),
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           ],
  //           as: 'my_contact',
  //         },
  //       },
  //       {
  //         $match: {
  //           _id: {
  //             $nin: [new mongoose.Types.ObjectId(data.user_id)],
  //           },
  //         },
  //       },
  //     ]);

  //     return {
  //       status: 200,
  //       message: 'All contacts found successfully',
  //       dbCount: users.length,
  //       users,
  //     };
  //   } catch (err) {
  //     console.log(err);
  //     return {
  //       status: 404,
  //       message: 'Error getting All users',
  //     };
  //   }
  // }

  // /// check contactship eligibilty via shared_link
  async check_contact(payload, userInfo) {
    try {
      // check if the payload is not empty
      if (!payload.id) {
        return { status: 422, message: 'id is missing' };
      }

      // format the payload
      let data = {
        contact_id: userInfo.id,
        user_id: payload.id,
      };

      // find my_Data by ID
      let my_Data = await User.findById({ _id: data.contact_id });

      // find User by ID
      let userData = await User.findById({ _id: data.user_id });

      // get all member by contact_id and User_id
      let get_member = await My_Contact.find({
        contact_id: data.contact_id,
        user_id: data.user_id,
      });

      let isJoined = get_member;

      let isOwner = my_Data.nickname === userData.nickname ? true : false;

      if (isOwner === true) {
        return {
          status: 200,
          message:
            'copy & share the link below to friends and family, inorder for them to chat you up  ',
          userData,
          isOwner,
          isJoined,
        };
      } else if (isJoined.length > 0) {
        return {
          status: 200,
          message: 'You have already join this user_contact_lis',
          userData,
          isOwner,
          isJoined,
        };
      } else if (isJoined.length < 1) {
        return {
          status: 200,
          message: 'Kindly click on send message to chat up the user',
          userData,
          isOwner,
          isJoined,
        };
      } else {
        return {
          status: 200,
          message: 'You have already join this user_contact_list',
          userData,
          isOwner,
          isJoined,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error adding new member',
      };
    }
  }

  /// Join a group via shared_link
  async join_contacts(payload) {
    try {
      // check if the payload is not empty
      if (!payload.contact_id || !payload.user_id) {
        return { status: 422, message: 'contact_id or user_id is missing' };
      }

      // format the payload
      let user_data = {
        contact_id: payload.contact_id,
        user_id: payload.user_id,
      };

      // // format the data
      let contact_data = {
        contact_id: payload.user_id,
        user_id: payload.contact_id,
      };

      // check if Contact already exist
      let getContact = await My_Contact.findOne({
        contact_id: payload.contact_id,
        user_id: payload.user_id,
      });

      // check if Contact already exist
      let get_contact = await My_Contact.findOne({
        contact_id: payload.user_id,
        user_id: payload.contact_id,
      });

      if (getContact) {
        return { status: 200, message: 'Contact already exist' };
      } else if (get_contact) {
        return { status: 200, message: 'Contact already exist' };
      } else {
        //  save to database
        let joincontact = await My_Contact.create(user_data);

        //  save to database
        let join_contact = await My_Contact.create(contact_data);

        return {
          status: 201,
          message: 'New contacts added successfully',
          joincontact,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error adding new contact',
      };
    }
  }

  // get contact by contact_id and User_id
  async get_contactById(payload, userInfo) {
    try {
      let get_contact = await My_Contact.findOne({
        contact_id: payload.id,
        user_id: userInfo.id,
      });

      if (!get_contact) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        // return this
        return {
          status: 200,
          message: 'contacts found successfully',
          get_contact,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting contacts',
      };
    }
  }

  // get contact by contact ID and UserID
  async all_contacts(userInfo) {
    try {
      // format the payload
      let data = {
        user_id: userInfo.id,
      };

      // find contact with data info
      let get_contacts = await My_Contact.find({
        user_id: data.user_id,
      });

      if (!get_contacts) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        return {
          status: 200,
          message: 'contacts found successfully',
          get_contacts,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting contacts',
      };
    }
  }

  // get contact by ID
  async get_all_contacts() {
    try {
      let getContact = await My_Contact.find();

      if (!getContact) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        return {
          status: 200,
          message: 'All contacts was found successfully',
          dbCount: getContact.length,
          getContact,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting all contact',
      };
    }
  }

  // get contact by ID
  async get_contact(payload) {
    try {
      let getContact = await My_Contact.findOne({ _id: payload.id });

      if (!getContact) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        return {
          status: 200,
          message: 'contact was found successfully',
          getContact,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting contact',
      };
    }
  }

  // delete contact by ID
  async delete_contact(payload) {
    try {
      let getUser = await My_Contact.findOne({ _id: payload.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        let get_User = await My_Contact.deleteOne({ _id: getUser._id });

        return {
          status: 204,
          message: 'contact was deleted successfully',
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error deleting contact',
      };
    }
  }
}

module.exports = Services;
