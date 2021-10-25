const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, lower: true },
  password: { type: String, required: true },
  createdEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
});

const User = new model('User', userSchema);
module.exports = User;
