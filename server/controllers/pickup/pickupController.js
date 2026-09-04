import Pickup from "../../models/pickup/Pickup.js";

const MATERIALS = ["Plastic", "Paper", "Metal", "Glass", "E-waste", "Mixed"];

/**
 * createPickup — POST /api/pickups
 * Citizen creates a recycling pickup request.
 */
export const createPickup = async (req, res, next) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({
        message: "Only citizens can request pickups.",
      });
    }

    const { district, material, quantity, address, notes, preferredDate } =
      req.body;

    if (!district?.trim() || !material || !quantity?.trim() || !address?.trim()) {
      return res.status(400).json({
        message: "District, material, quantity, and address are required.",
      });
    }

    if (!MATERIALS.includes(material)) {
      return res.status(400).json({
        message: `Material must be one of: ${MATERIALS.join(", ")}.`,
      });
    }

    const pickup = await Pickup.create({
      citizen: req.user.id,
      district: district.trim(),
      material,
      quantity: quantity.trim(),
      address: address.trim(),
      notes: notes?.trim() || "",
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
    });

    res.status(201).json(pickup);
  } catch (error) {
    next(error);
  }
};

/**
 * listPickups — GET /api/pickups
 * Citizens: own requests. Recyclers: open + accepted by them.
 */
export const listPickups = async (req, res, next) => {
  try {
    let filter;

    if (req.user.role === "recycler") {
      filter = {
        $or: [{ status: "Open" }, { recycler: req.user.id }],
      };
    } else if (req.user.role === "citizen") {
      filter = { citizen: req.user.id };
    } else {
      return res.status(403).json({
        message: "Municipality accounts do not manage pickups here.",
      });
    }

    const pickups = await Pickup.find(filter)
      .sort({ createdAt: -1 })
      .populate("citizen", "name district phone")
      .populate("recycler", "name phone");

    res.json(pickups);
  } catch (error) {
    next(error);
  }
};

/**
 * updatePickupStatus — PATCH /api/pickups/:id/status
 * Recycler: Accept / Complete. Citizen: Cancel (Open only).
 */
export const updatePickupStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["Accepted", "Completed", "Cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowed.join(", ")}.`,
      });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found." });
    }

    const role = req.user.role;
    const userId = req.user.id;

    if (status === "Cancelled") {
      if (role !== "citizen" || pickup.citizen.toString() !== userId) {
        return res.status(403).json({ message: "Only the requester can cancel." });
      }
      if (pickup.status !== "Open") {
        return res.status(400).json({
          message: "Only open requests can be cancelled.",
        });
      }
      pickup.status = "Cancelled";
    } else if (status === "Accepted") {
      if (role !== "recycler") {
        return res.status(403).json({ message: "Only recyclers can accept." });
      }
      if (pickup.status !== "Open") {
        return res.status(400).json({ message: "Pickup is no longer open." });
      }
      pickup.status = "Accepted";
      pickup.recycler = userId;
    } else if (status === "Completed") {
      if (role !== "recycler" || pickup.recycler?.toString() !== userId) {
        return res.status(403).json({
          message: "Only the assigned recycler can complete this pickup.",
        });
      }
      if (pickup.status !== "Accepted") {
        return res.status(400).json({
          message: "Only accepted pickups can be completed.",
        });
      }
      pickup.status = "Completed";
    }

    await pickup.save();
    const populated = await Pickup.findById(pickup._id)
      .populate("citizen", "name district phone")
      .populate("recycler", "name phone");

    res.json(populated);
  } catch (error) {
    next(error);
  }
};
