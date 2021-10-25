const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map((event) => {
      return { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event.creator) };
    });
    return events;
  } catch (error) {
    console.log('Error : ', error);
    throw error;
  }
};
const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, createdEvents: events.bind(this, user._doc.createdEvents) };
  } catch (error) {
    console.log('Error : ', error);
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        // return { ...event._doc, _id: event._doc._id.toString() };
        // return { ...event._doc, _id: event.id };
        return { ...event._doc, date: new Date(event._doc.date).toISOString(), creator: user.bind(this, event._doc.creator) };
      });
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },

  createEvent: async (args) => {
    // const { title, description, price, date } = args.eventInput;
    // const event = new Event({ title, description, price: +price, date: new Date(date), creator: '617670593c7e7859cd9fdf16' });
    // let createdEvent;
    // return event
    //   .save()
    //   .then((result) => {
    //     createdEvent = {
    //       ...result._doc,
    //       date: new Date(event._doc.date).toISOString(),
    //       creator: user.bind(this, result._doc.creator),
    //     };
    //     return User.findById('617670593c7e7859cd9fdf16');
    //   })
    //   .then((user) => {
    //     if (!user) {
    //       throw new Error('User not found.');
    //     }
    //     user.createdEvents.push(event);
    //     return user.save();
    //   })
    //   .then((result) => {
    //     return createdEvent;
    //   })
    //   .catch((error) => {
    //     console.log('Error : ', error);
    //     throw error;
    //   });
    const { title, description, price, date } = args.eventInput;
    const event = new Event({ title, description, price: +price, date: new Date(date), creator: '617670593c7e7859cd9fdf16' });
    let createdEvent;
    const result = await event.save();
    createdEvent = {
      ...result._doc,
      date: new Date(event._doc.date).toISOString(),
      creator: user.bind(this, result._doc.creator),
    };
    try {
      const user = await User.findById('617670593c7e7859cd9fdf16');
      if (!user) {
        throw new Error('User not found!');
      }
      user.createdEvents.push(event);
      await user.save();
      return createdEvent;
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const { email, password } = args.userInput;
      const existedUser = await User.findOne({ email });
      if (existedUser) {
        throw new Error('User with this email address already exist in database!');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.create({ email, password: hashedPassword });
      return { ...user._doc, password: null }; // always send back password null to user at graphil
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },
};

// mutation {
//     createEvent(eventInput: {title: "title 13", description: "description 13", price: 7000, date: "2021-10-25T07:57:54.607Z"}) {
//       title
//       description
//       date
//       price
//       creator{
//         _id
//         email
//       }
//     }
//   }

//   # query{
//   #   events{
//   #     _id
//   #     title
//   #     description
//   #     date
//   #     price
//   #   creator {
//   #       _id
//   #     email
//   #     createdEvents{
//   #       title
//   #       description
//   #       date
//   #       price
//   #     }
//   #     }
//   #   }
//   # }

//   # mutation {
//   #   createUser(userInput: {email: "usman@gmail.com", password: "123456"}) {
//   #     email
//   #     password
//   #   }
//   # }
