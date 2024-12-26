const express = require('express');
const router = express.Router();
const { Cart, CartItem, Sequelize } = require('../models');
const yup = require('yup');

// General Cart Methods (Create Cart, Get All Carts, Get Cart by ID, Delete Cart)
router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        CustomerId: yup.number().required(),
        total: yup.string().trim().min(1).max(4).matches("^[0-9]*\.[0-9]*").required()
    });
    try {
        await validationSchema.validate(data, 
            { abortEarly: false}
        );
    }
    catch (err) {
        console.error(err);
        res.status(400).json({errors: err.errors});
        return; 
    }
    data.CustomerId = data.CustomerId;
    data.total = data.total.trim();
    let result = await Cart.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            {CustomerId: { [Sequelize.Op.like]: `${search}` }}
        ]
    }
    let list = await Cart.findAll({
        order: [['createdAt', "DESC"]]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let cart = await Cart.findByPk(id);
    if (!cart) {
        res.sendStatus(404);
        return;
    }
    res.json(cart)
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let cart = await Cart.findByPk(id);
    if (!cart) {
        res.sendStatus(404);
        return;
    }
    let num = await Cart.destroy({
        where: {id:id}
    });

    if (num == 1) {
        res.json({message: "Cart was deleted successfully"})
    }
    else {
        res.status(400).json({message: `Cannot delete cart with id ${id}`})
    }
});

// Cart Items related methods 
// Add item to Cart
router.post("/:id/items", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        ProductId: yup.number().required(),
        CartId: yup.number().required(),
        quantity: yup.number().required(),
        total: yup.string().trim().min(1).max(10).required()
    });
    try {
        await validationSchema.validate(data, 
            { abortEarly: false}
        );
    }
    catch (err) {
        console.error(err);
        res.status(400).json({errors: err.errors});
        return; 
    }
    data.ProductId = data.ProductId;
    data.CartId = data.CartId;
    data.quantity = data.quantity;
    data.total = data.total;
    let result = await CartItem.create(data);
    res.json(result);
});

// Get Cart Items 
router.get("/:id/items", async (req, res) => {
    let id = req.params.id;
    let cart = await Cart.findByPk(id);
    if (!cart) {
        res.sendStatus(404);
        return;
    }
    let condition = {};
    condition[Sequelize.Op.or] = [
        { CartId: { [Sequelize.Op.like]: `${id}`} }
    ];
    let list = await CartItem.findAll({
        where: condition,
        order: [["createdAt", "DESC"]]
    })
    res.json(list);
});

// Get Cart Item by id
router.get("/:id/items/:itemid", async (req, res) => {
    let id = req.params.id;
    let itemid = req.params.itemid;
    let cart = await Cart.findByPk(id);
    let cartItem = await CartItem.findByPk(itemid);
    if (!cart || !cartItem) {
        res.sendStatus(404);
        return;
    }
    res.json(cartItem);
});

// Update Cart Items
router.put("/:id/items/:itemid", async (req, res) => {
    let id = req.params.id;
    let itemid = req.params.itemid;
    let cart = await Cart.findByPk(id);
    let cartItem = await CartItem.findByPk(itemid);
    if (!cart || !cartItem) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        ProductId: yup.number().required(),
        CartId: yup.number().required(),
        quantity: yup.number().required(),
        total: yup.string().trim().min(3).max(10).required()
    });
    try {
        await validationSchema.validate(data, 
            { abortEarly: false}
        );
    }
    catch (err) {
        console.error(err);
        res.status(400).json({errors: err.errors});
        return; 
    }
    data.ProductId = data.ProductId;
    data.CartId = data.CartId;
    data.quantity = data.quantity;
    data.total = data.total.trim();

    let num = await CartItem.update(data, {
        where: {id: itemid}
    });
    if (num == 1) {
        res.json({message: "Cart item updated successfully"});
    }
    else {
        res.json({message: `Cannot update cart item with id ${itemid}`})
    }
});

// Delete Cart Items
router.delete("/:id/items/:itemid", async (req, res) => {
    let id = req.params.id;
    let itemid = req.params.itemid;
    let cart = await Cart.findByPk(id);
    let cartItem = await CartItem.findByPk(itemid);
    if (!cart || !cartItem) {
        res.sendStatus(404);
        return;
    }
    let num = await CartItem.destroy({
        where: {id:itemid}
    });

    if (num == 1) {
        res.json({message: "Cart item was deleted successfully"})
    }
    else {
        res.status(400).json({message: `Cannot delete cart item with id ${itemid}`})
    }
});

// Checkout methods
router.post("/:id/checkout", async (req, res) => {
    let id = req.params.id;
    let cart = await Cart.findByPk(id);
    if (!cart) {
        res.sendStatus(404);
        return;
    }

})

module.exports = router;