const { Schema, model } = require('mongoose');

const ticketSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  settings: {
    type: Object,
    require: true
  }
}, { minimize: false });

module.exports = model('ticket', ticketSchema);