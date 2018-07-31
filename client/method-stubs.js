Meteor.methods({
  'do.something' ({ player, messages }) {
    // TODO: Implement this method!
    console.warn("Method 'do.something' not implemented.")
  },
  'chat.message' ({ player, message }) {
    if (message.length > 200) return
    Avengers.update({ player }, { $set: { message } })
  },
  'show.message' ({ player, showMessage }) {
    Avengers.update({ player }, { $set: { showMessage } })
  },
  'remove.avenger' (player) {
    Avengers.remove({ player })
  },
  'move.up' (player) {
    Avengers.update(
      { player },
      { $set: { y: Avengers.findOne({ player }).y - 10 } }
    )
  },
  'move.down' (player) {
    Avengers.update(
      { player },
      { $set: { y: Avengers.findOne({ player }).y + 10 } }
    )
  },
  'move.left' (player) {
    Avengers.update(
      { player },
      { $set: { x: Avengers.findOne({ player }).x - 10 } }
    )
  },
  'move.right' (player) {
    Avengers.update(
      { player },
      { $set: { x: Avengers.findOne({ player }).x + 10 } }
    )
  }
})
