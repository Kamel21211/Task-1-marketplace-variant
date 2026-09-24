import express from "express";
import {
  createListing,
  getAllListings,
  getListing,
  updateListing,
  deleteListing,
  markAsSold,
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/", createListing);
router.get("/", getAllListings);
router.get("/:id", getListing);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing); // Triggers the soft-delete
router.patch("/:id/sold", markAsSold); // Stretch goal

export default router;
