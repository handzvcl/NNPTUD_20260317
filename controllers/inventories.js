let inventoryModel = require("../schemas/inventories");
let productModel = require("../schemas/products");

module.exports = {
  // Tạo inventory cho product mới
  CreateInventory: async function (productId) {
    let newInventory = new inventoryModel({
      product: productId,
      stock: 0,
      reserved: 0,
      soldCount: 0,
    });
    await newInventory.save();
    return newInventory;
  },

  // Lấy tất cả inventories
  GetAllInventories: async function () {
    return await inventoryModel.find({ isDeleted: false }).populate({
      path: "product",
      select: "title slug price description images category",
    });
  },

  // Lấy inventory theo ID
  GetInventoryById: async function (id) {
    try {
      return await inventoryModel
        .findOne({
          isDeleted: false,
          _id: id,
        })
        .populate({
          path: "product",
          select: "title slug price description images category",
        });
    } catch (error) {
      return false;
    }
  },

  // Lấy inventory theo product ID
  GetInventoryByProduct: async function (productId) {
    try {
      return await inventoryModel
        .findOne({
          isDeleted: false,
          product: productId,
        })
        .populate({
          path: "product",
          select: "title slug price description images category",
        });
    } catch (error) {
      return false;
    }
  },

  // Thêm stock
  AddStock: async function (productId, quantity) {
    try {
      let inventory = await inventoryModel.findOne({
        product: productId,
        isDeleted: false,
      });

      if (!inventory) {
        return { success: false, message: "Inventory khong ton tai" };
      }

      inventory.stock += quantity;
      await inventory.save();

      return { success: true, data: inventory };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Giảm stock
  RemoveStock: async function (productId, quantity) {
    try {
      let inventory = await inventoryModel.findOne({
        product: productId,
        isDeleted: false,
      });

      if (!inventory) {
        return { success: false, message: "Inventory khong ton tai" };
      }

      if (inventory.stock < quantity) {
        return { success: false, message: "Stock khong du" };
      }

      inventory.stock -= quantity;
      await inventory.save();

      return { success: true, data: inventory };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Đặt hàng (giảm stock, tăng reserved)
  ReserveStock: async function (productId, quantity) {
    try {
      let inventory = await inventoryModel.findOne({
        product: productId,
        isDeleted: false,
      });

      if (!inventory) {
        return { success: false, message: "Inventory khong ton tai" };
      }

      if (inventory.stock < quantity) {
        return { success: false, message: "Stock khong du de dat hang" };
      }

      inventory.stock -= quantity;
      inventory.reserved += quantity;
      await inventory.save();

      return { success: true, data: inventory };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Bán hàng (giảm reserved, tăng soldCount)
  SoldStock: async function (productId, quantity) {
    try {
      let inventory = await inventoryModel.findOne({
        product: productId,
        isDeleted: false,
      });

      if (!inventory) {
        return { success: false, message: "Inventory khong ton tai" };
      }

      if (inventory.reserved < quantity) {
        return { success: false, message: "Reserved khong du" };
      }

      inventory.reserved -= quantity;
      inventory.soldCount += quantity;
      await inventory.save();

      return { success: true, data: inventory };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
