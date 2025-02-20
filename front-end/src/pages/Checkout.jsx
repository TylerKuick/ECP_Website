import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, TextField, Button, Card, CardContent } from '@mui/material';
import http from '../http';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const custId = 1;

  const [prodList, setProductList] = useState([]);
  const getProducts = () => {
    http.get('/products').then((res) => {
      setProductList(res.data);
    });
  }

  useEffect(() => {
    // Fetch Product List
    getProducts();

    // Fetch cart items
    http.get(`/carts?search=${custId}`).then((res) => {
      const cartId = res.data[0]?.id || '';
      if (cartId) {
        http.get(`/carts/${cartId}/items`).then((res) => {
          console.log("Fetched Cart Items:", res.data);  // Log cart items for debugging
          setCartItems(res.data);
          const newTotal = res.data.reduce((sum, item) => sum + parseFloat(item.total), 0);
          setTotal(newTotal);
        });
      }
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/confirm-order');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Checkout
      </Typography>
      
      {/* Order Summary */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Order Summary
      </Typography>
      <Grid container spacing={3}>
        {cartItems.map((item) => {
          const product = prodList.find((prod) => prod.id == item.ProductId);
          return (
          <Grid item xs={12} key={product.id}>
            <Card>
              <CardContent sx={{display:"flex", justifyContent:"space-between"}}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold", color: "black" }}>
                    {/* Ensure prod_name exists or fallback to 'Product Name' */}
                    {product.prod_name || 'Product Name'}
                  </Typography>
                  <Typography variant="body1">Price: ${item.total}</Typography>
                </Box>
                <Typography variant='body1' sx={{mt:3, mr: 3}}>Qty: {item.quantity}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )})}
      </Grid>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 3 }}>
        Total Price: ${total.toFixed(2)}
      </Typography>
      
      {/* Checkout Form */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 4 }}>
        Shipping Information
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Full Name" fullWidth required sx={{ mb: 2 }} />
        <TextField label="Address" fullWidth required sx={{ mb: 2 }} />
        <TextField label="City" fullWidth required sx={{ mb: 2 }} />
        <TextField label="Postal Code" fullWidth required sx={{ mb: 2 }} />
        <TextField label="Phone Number" fullWidth required sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" type="submit">
          Place Order
        </Button>
      </form>
    </Box>
  );
}

export default Checkout;