const express = require("express");
const {
  addmachinary,
  displayMachineDetails,
  getAllMachineNames,
  deleteMachine,
  updateMachine,
  getpdf,
  getMachine,
} = require("../controllers/machinary.controller.js");
const uploadImage = require("../utils/uploadImage.js");

const router = express.Router();

router.post("/addmachine", uploadImage, addmachinary);
router.post("/machinetable", displayMachineDetails);
router.get("/machinenames", getAllMachineNames);
router.get("/getmachine/:id", getMachine);
router.delete("/deletemachine/:id", deleteMachine);
router.patch("/updatemachine/:id", updateMachine);
router.get("/getpdf", getpdf);

module.exports = router;
