const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const imagenSchema = new Schema({
  modulo: { type: String, required: true },
  nombre: { type: String, required: true },
  orden: { type: Number, required: true },
  imagen: { type: String, required: true }
});

imagenSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Imagen', imagenSchema);
