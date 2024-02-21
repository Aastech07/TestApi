const AnnouncementCategory = require("../models/AnnouncementCategoryModel");

const createAnnouncementCategory = async (req, res) => {
  const { announcementCategoryName, date } = req.body;

  try {
    const newCategory = new AnnouncementCategory({
      announcementCategoryName,
      date,
    });

    const savedCategory = await newCategory.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating announcement category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllAnnouncementCategories = async (req, res) => {
  try {
    const categories = await AnnouncementCategory.find();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting announcement categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAnnouncementCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await AnnouncementCategory.findById(id);

    if (!category) {
      return res.status(404).json({ error: "Announcement category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting announcement category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAnnouncementCategoryById = async (req, res) => {
  const { id } = req.params;
  const { announcementCategoryName, date } = req.body;

  try {
    const updatedCategory = await AnnouncementCategory.findByIdAndUpdate(
      id,
      { announcementCategoryName, date },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Announcement category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating announcement category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAnnouncementCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await AnnouncementCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Announcement category not found" });
    }

    res
      .status(200)
      .json({ message: "Announcement category deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createAnnouncementCategory,
  getAllAnnouncementCategories,
  getAnnouncementCategoryById,
  updateAnnouncementCategoryById,
  deleteAnnouncementCategoryById,
};
