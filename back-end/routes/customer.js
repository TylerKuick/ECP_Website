const express = require('express');
const router = express.Router();
const { Customer, Sequelize } = require('../models');
const yup = require('yup');

router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        // Customer Details
        cust_name: yup.string().trim().min(3).max(100).required(),
        cust_phone: yup.string().trim().min(3).max(100).required(),
        cust_email: yup.string().trim().min(3).max(100).required()
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
    data.cust_name = data.cust_name.trim();
    data.cust_phone = data.cust_phone.trim();
    data.cust_email = data.cust_email.trim();
    let result = await Customer.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { cust_name: { [Sequelize.Op.like]: `%${search}%` }},
            { cust_phone: { [Sequelize.Op.like]: `%${search}%` }},
            { cust_email: { [Sequelize.Op.like]: `%${search}%` }}
        ]
    }
    let list = await Customer.findAll({
        where: condition,
        order: [['createdAt', "DESC"]]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let cart = await Customer.findByPk(id);
    if (!cart) {
        res.sendStatus(404);
        return;
    }
    res.json(cart)
});


router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let customer = await Customer.findByPk(id);
    if (!customer) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;

    let validationSchema = yup.object({
        // Customer Details
        cust_name: yup.string().trim().min(3).max(100).required(),
        cust_phone: yup.string().trim().min(3).max(100).required(),
        cust_email: yup.string().trim().min(3).max(100).required()
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
    data.cust_name = data.cust_name.trim();
    data.cust_phone = data.cust_phone.trim();
    data.cust_email = data.cust_email.trim();
    let num = await Customer.update(data, {
        where: {id: id}
    });
    if (num == 1) {
        res.json({message: "Customer updated successfully"});
    }
    else {
        res.status(400).json({message: `Cannot update customer with id ${id}`});
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let customer = await Customer.findByPk(id);
    if (!customer) {
        res.sendStatus(404);
        return;
    }
    let num = await Customer.destroy({
        where: {id:id}
    });

    if (num == 1) {
        res.json({message: "Customer was deleted successfully"})
    }
    else {
        res.status(400).json({message: `Cannot delete customer with id ${id}`})
    }
});

module.exports = router;