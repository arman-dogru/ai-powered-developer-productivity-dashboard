const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true,
  },
  username: String,
  displayName: String,
  profileUrl: String,
  photos: [String],
});

module.exports = mongoose.model('User', UserSchema);
