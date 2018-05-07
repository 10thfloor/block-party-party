import { Meteor } from "meteor/meteor";

Meteor.startup(() => {
  Avengers.remove({});
});

Meteor.methods({
  "block.party"(name) {
    Avengers.insert({
      name,
      message: "",
      showMessage: false,
      x: 200,
      y: 200,
      player: Meteor.userId(),
      bg: "#" + Math.floor(Math.random() * 16777215).toString(16)
    });
  },
  "chat.message"({ player, message }) {
    if (message.length > 200) return;
    Avengers.update({ player }, { $set: { message } });
  },
  "show.message"({ player, showMessage }) {
    Avengers.update({ player }, { $set: { showMessage } });
  },
  "remove.avenger"(player) {
    Avengers.remove({ player });
  },
  "move.up"(player) {
    Avengers.update(
      { player },
      { $set: { y: Avengers.findOne({ player }).y - 10 } }
    );
  },
  "move.down"(player) {
    Avengers.update(
      { player },
      { $set: { y: Avengers.findOne({ player }).y + 10 } }
    );
  },
  "move.left"(player) {
    Avengers.update(
      { player },
      { $set: { x: Avengers.findOne({ player }).x - 10 } }
    );
  },
  "move.right"(player) {
    Avengers.update(
      { player },
      { $set: { x: Avengers.findOne({ player }).x + 10 } }
    );
  }
});
