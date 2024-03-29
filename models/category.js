const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { type: Schema.Types.String },
    description: { type: Schema.Types.String},
})

categorySchema.virtual('url').get(function () {
    return '/inventory/category/' + this._id;
})

module.exports = mongoose.model('Category', categorySchema)