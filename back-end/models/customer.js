module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define("Customer", {
        // Contains name 
        cust_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cust_phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cust_email: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    Customer.associate = (models) => {
        Customer.hasOne(models.Cart)
    }
    return Customer;
}