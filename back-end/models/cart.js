module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        
    });

    Cart.associate = function(models) {
        Cart.belongsToMany(models.Product, {
            through: {
                model: models.CartItem, 
                unique: false
            }
        });
        Cart.belongsTo(models.Customer)
    };

    return Cart;
}
