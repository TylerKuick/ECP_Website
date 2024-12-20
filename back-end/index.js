const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to our ECP Website")
});

// Routes
const productRoute = require("./routes/products");
const cartRoute = require("./routes/cart");
const customerRoute = require('./routes/customer')
app.use("/products", productRoute);
app.use("/cart", cartRoute);
app.use("/customer", customerRoute);

require('dotenv').config();

const db = require('./models');

db.sequelize.sync({alter: true}).then(() => {
    let port = process.env.APP_PORT; 
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    });
});
