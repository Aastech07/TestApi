const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserV1',
    required: true,
  },
  sellerProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  buyerProfileId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'productModel',
    required: true,
  },
  productModel: {
    type: String,
    enum: ['Phone', 'Accessories', 'Tablets', 'Bicycles', 'Bike', 'Car'],
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
