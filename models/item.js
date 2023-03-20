const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    price: { type: Number },
    name: { type: String },
    stock: { type: Number },
    category: { type: Schema.Types.ObjectId, ref: 'Category' }
  });

  itemSchema.virtual('url').get(function() {
    return "/inventory/item/" + this._id;
  });

module.exports = mongoose.model("Item", itemSchema)
