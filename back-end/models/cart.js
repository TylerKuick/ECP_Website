module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        total: {
            type: DataTypes.DECIMAL,
            allowNull: true
        }
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
