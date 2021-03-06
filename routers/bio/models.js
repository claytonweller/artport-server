const mongoose = require("mongoose");

const bioSchema = mongoose.Schema({
  data: { type: Object, require: true },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
  // title: { type: String, default: "Event Title" },
  // thanks: { type: String, default: "Thanks for coming to our event" },
  // endTimeStamp: { type: Number, required: true },
  // displayName: { type: String, default: "" },
  // host: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Host" },
  // code: { type: String, required: true, unique: true },
  // phone: { type: String, required: true },
  // webFormVisits: { type: Array, default: [] },
  // timeStamp: Number
});

// eventSchema.methods.serialize = function() {
//   return {
//     title: this.title,
//     thanks: this.thanks,
//     endTimeStamp: this.endTimeStamp,
//     displayName: this.displayName,
//     code: this.code,
//     phone: this.phone,
//     host: this.host._id,
//     timeStamp: this.timeStamp,
//     eventId: this._id,
//     webFormVisits: this.webFormVisits
//   };
// };

const BioModel = mongoose.model("Bio", bioSchema, "bios");

module.exports = { BioModel };
