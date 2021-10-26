const bcrypt = require('bcryptjs');
const User = require('../../models/user');
var jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (args) => {
    try {
      const { email, password } = args.userInput;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
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
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!'); // OR Invalid credentials
    }
    // here the first argument in sign method is the data we put in our token, second argument is secret/private key for encryptrion and decryption, third argument is option where we configure our token expiration time
    const token = await jwt.sign({ userId: user.id, email: user.email }, 'alihaider12345678', {
      expiresIn: '1h',
    });
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
};
