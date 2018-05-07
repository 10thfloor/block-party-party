import { Mongo } from "meteor/mongo";

ChatMessages = new Mongo.Collection("messages");
Avengers = new Mongo.Collection("avengers");

if (Meteor.isServer) {
  AccountsGuest.enabled = true;
  AccountsGuest.anonymous = true;
}
