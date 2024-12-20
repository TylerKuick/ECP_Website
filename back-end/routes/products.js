const express = require('express');
const router = express.Router();
const { Product, Sequelize } = require('../models');
const yup = require('yup');

router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        prod_name: yup.string().trim().min(3).max(100).required(),
        prod_price: yup.string().trim().min(1).max(4).matches("^[0-9]*\.[0-9]*").required(),
        description: yup.string().trim().min(3).max(500).required()
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
    data.prod_name = data.prod_name.trim();
    data.description = data.description.trim();

    let result = await Product.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { prod_name: { [Sequelize.Op.like]: `%${search}%` } },
            { prod_price: { [Sequelize.Op.like]: `%${search}%` } },
            { description: { [Sequelize.Op.like]: `%${search}%` } },

        ]
    }
    let list = await Product.findAll({
        where: condition,
        order: [['createdAt', "DESC"]]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let product = await Product.findByPk(id);
    if (!product) {
        res.sendStatus(404);
        return;
    }
    res.json(product)
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let product = await Product.findByPk(id);
    if (!product) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;

    let validationSchema = yup.object({
        prod_name: yup.string().trim().min(3).max(100).required(),
        prod_price: yup.string().trim().min(1).max(4).matches("^[0-9]*\.[0-9]*").required(),
        description: yup.string().trim().min(3).max(500).required()
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
    data.prod_name = data.prod_name.trim();
    data.description = data.description.trim();

    let num = await Product.update(data, {
        where: {id: id}
    });
    if (num == 1) {
        res.json({message: "Product updated successfully"});
    }
    else {
        res.status(400).json({message: `Cannot update product with id ${id}`});
    }
});


router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let product = await Product.findByPk(id);
    if (!product) {
        res.sendStatus(404);
        return;
    }
    let num = await Product.destroy({
        where: {id:id}
    });

    if (num == 1) {
        res.json({message: "Product was deleted successfully"})
    }
    else {
        res.status(400).json({message: `Cannot delete product with id ${id}`})
    }
})

module.exports = router;