import { Listing } from "../models/Listing.js";
import Joi from "joi";

// Step 2: Validation Schema
const validateListing = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow("", null),
    price: Joi.number().min(0).required(),
    category: Joi.string().valid(
      "textbooks",
      "electronics",
      "furniture",
      "clothing",
      "other",
    ),
    condition: Joi.string().valid("new", "like-new", "used", "worn"),
    status: Joi.string().valid("active", "sold", "removed"),
    seller: Joi.string(),
  });
  return schema.validate(data);
};

// GET /api/listings
export async function getAllListings(req, res, next) {
  try {
    const { includeRemoved } = req.query;
    const filter =
      includeRemoved === "true" ? {} : { status: { $ne: "removed" } };
    const listings = await Listing.find(filter).populate(
      "seller",
      "name email",
    );
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
}

// GET /api/listings/:id
export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "seller",
      "name email",
    );
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}

// POST /api/listings
export async function createListing(req, res, next) {
  try {
    const { error } = validateListing(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}

// PUT or PATCH /api/listings/:id
export async function updateListing(req, res, next) {
  try {
    const { error } = validateListing(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/listings/:id (Soft Delete)
export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "removed" },
      { new: true },
    );
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json({ message: "Listing soft deleted", listing });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/listings/:id/sold (Stretch Goal)
export async function markAsSold(req, res, next) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: "sold" },
      { new: true },
    );
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}
