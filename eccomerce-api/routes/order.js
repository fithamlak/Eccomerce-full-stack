const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/",  async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const saveOrder = await newCart.save();
    res.status(200).json(saveOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin,  async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/userid", verifyTokenAndAuthorization,  async (req, res) => {
  try {
    const orders = await Order.find(req.params.id{userId: req.params.userId});
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) {
    try{
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch(err) {
        res.status(500).json(err);
    }
})

//GET MONTHLY INCOME

router.get("income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date( date.setMonth(date.getMonth() - 1))
    const previousMonth = new date( date.setMonth(lastMonth.getMonth() - 1))
    
    try {
        const income = await Order.aggregate([
            { $match: { createdAt: {$gte: previousMonth}}},
            {
                $project: {
                    month: { $month: "createdAt"},
                    sales: "$amount",
                },
            },   
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales"}
                    },
                },
            
        ]);
        res.status(200).json(income);
    }catch(err) {
        res.status(500).json(err);
    }
})
module.exports = router;
