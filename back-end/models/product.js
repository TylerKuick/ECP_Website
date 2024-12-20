module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define("Product", {
        prod_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        prod_price: {
            type: DataTypes.DECIMAL(3,2),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    });

    Product.associate = function(models) {
        Product.belongsToMany(models.Cart, {
            through: {
                model: models.CartItem, 
                unique: false
            }
        });
    };
    
    return Product;
}
