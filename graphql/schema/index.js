const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking {
      _id: ID!
      event: Event!
      user: User!
      createdAt: String!
      updatedAt: String!
    }

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
      creator: User!
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [Event!]
    }

    type AuthData { 
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        deleteEvents(deletedEventIds: [ID!]!) : Int
        deleteEvent(deletedEventId: ID!) : String
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancleBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
