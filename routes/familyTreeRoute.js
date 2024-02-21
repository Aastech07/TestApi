const express = require("express");
const router = express.Router();
const individualController = require("../controller/familyTreeController");

router.post("/individuals", individualController.createIndividual);
router.get("/individuals", individualController.getAllIndividual);
router.get("/individuals/:id", individualController.getIndividual);
router.put("/individuals/:id", individualController.updateIndividual);
router.delete("/individuals/:id", individualController.deleteIndividual);

module.exports = router;
