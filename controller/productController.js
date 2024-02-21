const {
  Phone,
  Accessories,
  Tablets,
  Bicycles,
  Bike,
  Car,
} = require("../models/productModel");
const AWS = require("aws-sdk");
const fs = require("fs");
const User = require("../models/userV1Model");
const Notification = require("../models/notificationModel");


const uploadImage = async (file) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = "AP-SOUTH-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });

  const fileName = `Products/${file.originalname}`;
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      }
      console.log("S3 Upload Data:", data);
      resolve(data.Location);
    });
  });
};
const uploadPhoneImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await Phone.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "Phone not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const uploadAccessoriesImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await Accessories.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "Accessories not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const uploadTabletsImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await Tablets.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "Tablets not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const uploadBicyclesImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await Bicycles.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "Bicycles not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const uploadBikeImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await Bike.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const uploadCarImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createPhone = async (req, res) => {
  try {
    const newPhone = await Phone.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Phone Post",
        message: `A new Phone post "${newPhone.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newElectronics);
  } catch (error) {
    console.error("Error creating Phone and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createAccessories = async (req, res) => {
  try {
    const newPhone = await Accessories.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Accessories Post",
        message: `A new Accessories post "${newPhone.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newElectronics);
  } catch (error) {
    console.error("Error creating Accessories and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const createTablets = async (req, res) => {
  try {
    const newBicycles = await Tablets.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Tablets Post",
        message: `A new Tablets post "${newBicycles.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newElectronics);
  } catch (error) {
    console.error("Error creating Tablets and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createBicycles = async (req, res) => {
  try {
    const newBicycles = await Bicycles.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Bicycles Post",
        message: `A new Bicycles post "${newBicycles.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newElectronics);
  } catch (error) {
    console.error("Error creating Bicycles and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createBike = async (req, res) => {
  try {
    const newBike = await Bike.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Bike Post",
        message: `A new Bike post "${newBike.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newElectronics);
  } catch (error) {
    console.error("Error creating Bicycles and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createCar = async (req, res) => {
  try {
    const newCar = await Car.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Car Post",
        message: `A new Car post "${newCar.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newElectronics);
  } catch (error) {
    console.error("Error creating Car and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllPhones = async (req, res) => {
  try {
    const phones = await Phone.find().populate("profileId").exec();
    res.status(200).json(phones);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAccessories = async (req, res) => {
  try {
    const accessories = await Accessories.find().populate("profileId").exec();
    res.status(200).json(accessories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllTablets = async (req, res) => {
  try {
    const tablets = await Tablets.find().populate("profileId").exec();
    res.status(200).json(tablets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBicycles = async (req, res) => {
  try {
    const bicycles = await Bicycles.find().populate("profileId").exec();
    res.status(200).json(bicycles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBikes = async (req, res) => {
  try {
    const bikes = await Bike.find().populate("profileId").exec();
    res.status(200).json(bikes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find().populate("profileId").exec();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPhoneById = async (req, res) => {
  try {
    const phone = await Phone.findById(req.params.id)
      .populate("profileId")
      .exec();
    if (!phone) {
      return res.status(404).json({ error: "Phone not found" });
    }
    res.status(200).json(phone);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAccessoriesById = async (req, res) => {
  try {
    const accessories = await Accessories.findById(req.params.id)
      .populate("profileId")
      .exec();
    if (!accessories) {
      return res.status(404).json({ error: "Accessories not found" });
    }
    res.status(200).json(accessories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTabletsById = async (req, res) => {
  try {
    const tablets = await Tablets.findById(req.params.id)
      .populate("profileId")
      .exec();
    if (!tablets) {
      return res.status(404).json({ error: "Tablets not found" });
    }
    res.status(200).json(tablets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBicyclesById = async (req, res) => {
  try {
    const bicycles = await Bicycles.findById(req.params.id)
      .populate("profileId")
      .exec();
    if (!bicycles) {
      return res.status(404).json({ error: "Bicycles not found" });
    }
    res.status(200).json(bicycles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id)
      .populate("profileId")
      .exec();
    if (!bike) {
      return res.status(404).json({ error: "Bike not found" });
    }
    res.status(200).json(bike);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate("profileId").exec();
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePhone = async (req, res) => {
  try {
    const phone = await Phone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!phone) {
      return res.status(404).json({ error: "Phone not found" });
    }
    res.status(200).json(phone);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateAccessories = async (req, res) => {
  try {
    const accessories = await Accessories.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!accessories) {
      return res.status(404).json({ error: "Accessories not found" });
    }
    res.status(200).json(accessories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTablets = async (req, res) => {
  try {
    const tablets = await Tablets.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tablets) {
      return res.status(404).json({ error: "Tablets not found" });
    }
    res.status(200).json(tablets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBicycles = async (req, res) => {
  try {
    const bicycles = await Bicycles.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bicycles) {
      return res.status(404).json({ error: "Bicycles not found" });
    }
    res.status(200).json(bicycles);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bike) {
      return res.status(404).json({ error: "Bike not found" });
    }
    res.status(200).json(bike);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePhone = async (req, res) => {
  try {
    const deletecar = await Phone.findByIdAndRemove(req.params.id);
    if (!deletecar) {
      return res.status(404).json({ message: "Phone not found" });
    }
    res.status(200).json({ message: "Phone deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccessories = async (req, res) => {
  try {
    const deletecar = await Accessories.findByIdAndRemove(req.params.id);
    if (!deletecar) {
      return res.status(404).json({ message: "Accessories not found" });
    }
    res.status(200).json({ message: "Accessories deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTablets = async (req, res) => {
  try {
    const deletecar = await Tablets.findByIdAndRemove(req.params.id);
    if (!deletecar) {
      return res.status(404).json({ message: "Tablets not found" });
    }
    res.status(200).json({ message: "Tablets deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteBicycles = async (req, res) => {
  try {
    const deletecar = await Bicycles.findByIdAndRemove(req.params.id);
    if (!deletecar) {
      return res.status(404).json({ message: "Bicycles not found" });
    }
    res.status(200).json({ message: "Bicycles deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBike = async (req, res) => {
  try {
    const deletecar = await Bike.findByIdAndRemove(req.params.id);
    if (!deletecar) {
      return res.status(404).json({ message: "Bike not found" });
    }
    res.status(200).json({ message: "Bike deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCar = async (req, res) => {
  try {
    const deletecar = await Car.findByIdAndRemove(req.params.id);
    if (!deletecar) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadCarImages,
  uploadBikeImages,
  uploadBicyclesImages,
  uploadTabletsImages,
  uploadAccessoriesImages,
  uploadPhoneImages,
  createPhone,
  createAccessories,
  createTablets,
  createBicycles,
  createBike,
  createCar,
  getAllPhones,
  getAllAccessories,
  getAllTablets,
  getAllBicycles,
  getAllBikes,
  getAllCars,
  getPhoneById,
  getAccessoriesById,
  getTabletsById,
  getBicyclesById,
  getBikeById,
  getCarById,
  updatePhone,
  updateAccessories,
  updateTablets,
  updateBicycles,
  updateBike,
  updateCar,
  deletePhone,
  deleteAccessories,
  deleteTablets,
  deleteBicycles,
  deleteBike,
  deleteCar,
};
