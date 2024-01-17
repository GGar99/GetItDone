const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: String,
  done: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Add a virtual 'id' property
TodoSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
TodoSchema.set('toJSON', {
  virtuals: true
});

const TodoModel = mongoose.model('TodoDB', TodoSchema)

module.exports = TodoModel;