const express = require("express")
const router = express.Router();
const carController = require("../controllers/CarController");
const carValidation = require("../middlewares/carValidation");

router.get("/", carController.index);
router.get("/rented", carController.rented);
router.get("/sort", carController.sort);
router.get("/search/:identifier", carController.search);
router.get("/search-rented/:identifier", carController.searchRented);
router.get("/best-selling/:numberOfCars", carController.bestSelling);
router.get("/:identifier", carController.show);

router.post("/rent", carValidation.rent ,carController.rent);
router.post("/add", carValidation.store ,carController.store);
router.post("/accept", carValidation.accept ,carController.accept);
router.delete("/delete", carValidation.destroy ,carController.destroy);

router.patch("/edit", carValidation.update ,carController.update);
router.patch("/edit-rent", carValidation.updateRent ,carController.updateRent);

module.exports = router;