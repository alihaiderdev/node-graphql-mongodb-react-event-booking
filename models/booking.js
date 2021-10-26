const { Schema, model } = require('mongoose');

const bookingSchema = new Schema(
  {
    event: { type: Schema.Types.ObjectId, ref: 'Event' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    // enrolledUsers: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = new model('Booking', bookingSchema);
module.exports = Booking;

// module.exports = model('Booking', bookingSchema);
