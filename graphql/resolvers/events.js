const Event = require('../../models/event');
const User = require('../../models/user');
const { transformEvent } = require('./merge');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        // return { ...event._doc, _id: event._doc._id.toString() };
        // return { ...event._doc, _id: event.id };
        return transformEvent(event);
      });
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },

  createEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const { title, description, price, date } = args.eventInput;
      const event = new Event({ title, description, price: +price, date: new Date(date), creator: req.userId });
      let createdEvent;
      const result = await event.save();
      createdEvent = transformEvent(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error('User not found!');
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvent;
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },

  deleteEvents: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const events = await Event.remove({ _id: { $in: args.deletedEventIds } });
      return events.deletedCount;
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },

  deleteEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const event = await Event.findById(args.deletedEventId);
      await Event.remove({ _id: args.deletedEventId });
      return `Item with this title "${event._doc.title}" and id ${args.deletedEventId} deleted successfuly!`;
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },
};
