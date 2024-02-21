const { Individual } = require("../models/familyTreeModel");

const createIndividual = async (req, res) => {
  try {
    const { fullName, relationship, dateOfBirth, image } = req.body;

    const individual = new Individual({
      fullName,
      relationship,
      dateOfBirth,
      image,
    });

    await individual.save();

    return res.status(201).json(individual);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getIndividual = async (req, res) => {
  try {
    const individual = await Individual.findById(req.params.id)
      .populate("userId")
      .exec();
    if (!individual) {
      return res.status(404).json({ error: "Individual not found" });
    }
    res.json(individual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllIndividual = async (req, res) => {
  try {
    const allIndividuals = await Individual.find().populate("userId").exec();
    res.json(allIndividuals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIndividual = async (req, res) => {
  try {
    const updatedIndividual = await Individual.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedIndividual) {
      return res.status(404).json({ error: "Individual not found" });
    }
    res.json(updatedIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteIndividual = async (req, res) => {
  try {
    const deletedIndividual = await Individual.findByIdAndDelete(req.params.id);
    if (!deletedIndividual) {
      return res.status(404).json({ error: "Individual not found" });
    }
    res.json(deletedIndividual);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createIndividual,
  getIndividual,
  getAllIndividual,
  updateIndividual,
  deleteIndividual,
};
