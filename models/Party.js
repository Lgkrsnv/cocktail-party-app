const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  // author: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    author: {type: String, required: true},
    location: { type: String, required: true },
    starts: { type: Date, required: true },
    guests: [{
      userid: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
      username: { type: String, required: true},
      food: {type: String, required: true},
      ingredient: {type: String, required: true},
    }],
    description: {
      type: String,
    },
    cocktail: {
      type: String,
      required: true,
    },
    cocktailid: String,
    privat: String,
    privatLink: String,
    comments: [{
      user: {type: String},
      comment: {type: String},
      createdAt: {type: Date, default: Date.now},

    }],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

partySchema.statics.sortIt = async function () {
  let sortedParties = this.find().sort({starts: 1}).lean();
  let date = new Date();

  return sortedParties;
}

module.exports = mongoose.model('parties', partySchema);
