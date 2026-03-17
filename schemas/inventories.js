let mongoose = require("mongoose");

let inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
      required: [true, "product khong duoc rong"],
      unique: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "stock khong duoc nho hon 0"],
    },
    reserved: {
      type: Number,
      default: 0,
      min: [0, "reserved khong duoc nho hon 0"],
    },
    soldCount: {
      type: Number,
      default: 0,
      min: [0, "soldCount khong duoc nho hon 0"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("inventory", inventorySchema);
