const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./merge');

module.exports = {
  bookEvent: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = await Booking.create({ user: req.userId, event: fetchedEvent });
      return transformBooking(booking);
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },

  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },

  cancleBooking: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const booking = await Booking.findById(args.bookingId).populate('event');
      // const event = { ...booking.event._doc, creator: user.bind(this, booking.event._doc.creator) };
      const event = transformEvent(booking.event); // OR booking._doc.event
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      console.log('Error : ', error);
      throw error;
    }
  },
};
