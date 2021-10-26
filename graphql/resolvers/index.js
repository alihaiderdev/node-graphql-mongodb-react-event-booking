const authResolvers = require('./auth');
const eventResolvers = require('./events');
const bookingResolvers = require('./bookings');

const rootResolvers = { ...authResolvers, ...eventResolvers, ...bookingResolvers };
module.exports = rootResolvers;
