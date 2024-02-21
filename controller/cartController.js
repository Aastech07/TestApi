const Cart = require("../models/addtocart");

const addToCart = async (req, res) => {
  try {
    const { userId, profileId, buyerProfile, productId, productModel } =
      req.body;

    const cartItem = new Cart({
      userId,
      profileId,
      buyerProfile,
      productId,
      productModel,
    });

    await cartItem.save();

    res.status(201).json({ message: "Product added to the cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCartItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItems = await Cart.find({ userId })
      .populate("userId")
      .populate("productId")
      .populate("profileId")
      
      .populate("buyerProfileId");

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addToCart,
  getCartItems,
};
