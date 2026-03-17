var express = require("express");
var router = express.Router();
let inventoryController = require("../controllers/inventories");

// GET all inventories
router.get("/", async function (req, res, next) {
  try {
    let result = await inventoryController.GetAllInventories();
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET inventory by ID
router.get("/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await inventoryController.GetInventoryById(id);

    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// POST - Add stock
router.post("/add-stock", async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity) {
      return res
        .status(400)
        .send({ message: "product va quantity la bat buoc" });
    }

    if (quantity <= 0) {
      return res.status(400).send({ message: "quantity phai lon hon 0" });
    }

    let result = await inventoryController.AddStock(product, quantity);

    if (result.success) {
      res.send(result.data);
    } else {
      res.status(400).send({ message: result.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST - Remove stock
router.post("/remove-stock", async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity) {
      return res
        .status(400)
        .send({ message: "product va quantity la bat buoc" });
    }

    if (quantity <= 0) {
      return res.status(400).send({ message: "quantity phai lon hon 0" });
    }

    let result = await inventoryController.RemoveStock(product, quantity);

    if (result.success) {
      res.send(result.data);
    } else {
      res.status(400).send({ message: result.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST - Reservation (đặt hàng)
router.post("/reservation", async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity) {
      return res
        .status(400)
        .send({ message: "product va quantity la bat buoc" });
    }

    if (quantity <= 0) {
      return res.status(400).send({ message: "quantity phai lon hon 0" });
    }

    let result = await inventoryController.ReserveStock(product, quantity);

    if (result.success) {
      res.send(result.data);
    } else {
      res.status(400).send({ message: result.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// POST - Sold (bán hàng)
router.post("/sold", async function (req, res, next) {
  try {
    let { product, quantity } = req.body;

    if (!product || !quantity) {
      return res
        .status(400)
        .send({ message: "product va quantity la bat buoc" });
    }

    if (quantity <= 0) {
      return res.status(400).send({ message: "quantity phai lon hon 0" });
    }

    let result = await inventoryController.SoldStock(product, quantity);

    if (result.success) {
      res.send(result.data);
    } else {
      res.status(400).send({ message: result.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
