const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");

router.post("/addToCart", cartController.addToCart);

router.get("/getCartItems/:userId", cartController.getCartItems);

module.exports = router;
