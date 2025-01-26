import { React, useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  CardMedia,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import http from '../http';

function Cart() {
  const [cartId, setCartId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [prodList, setProductList] = useState([]);
  const custId = 1;

  const getProductList = () => {
    http.get('/products').then((res) => {
      setProductList(res.data);
    });
  };

  const getCartId = () => {
    http.get(`/cart?search=${custId}`).then((res) => {
      setCartId(res.data[0]?.id || '');
    });
  };

  const getCartItems = () => {
    if (cartId) {
      http.get(`/cart/${cartId}/items`).then((res) => {
        setCartItems(res.data);
      });
    }
  };

  const onClickCheckout = () => {
    const data = {
      cart_total: total,
    };
    console.log(data);
    // http.post(`/cart/${cartId}/checkout`, data);
  };

  const onClickClearCart = () => {
    cartItems.forEach((item) => {
      http.delete(`/cart/${cartId}/items/${item.id}`);
    });
    setCartItems([]);
  };

  const deleteItem = (id) => {
    http.delete(`/cart/${cartId}/items/${id}`).then(() => {
      getCartItems();
    });
  };

  useEffect(() => {
    getCartId();
    getProductList();
  }, []);

  useEffect(() => {
    if (cartId) getCartItems();
  }, [cartId]);

  useEffect(() => {
    const newTotal = cartItems
      .map((x) => x.total)
      .reduce((x, y) => parseFloat(x) + parseFloat(y), 0);
    setTotal(newTotal);
  }, [cartItems]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Your Cart
      </Typography>
      <Grid container spacing={3}>
        {cartItems.map((citem) => {
          const product = prodList.find((prod) => prod.id === citem.ProductId);
          return (
            <Grid item xs={12} sm={6} md={4} key={citem.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {product?.thumbnail && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.thumbnail}
                    alt={product.prod_name}
                  />
                )}
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {product?.prod_name || 'Product Name'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Qty: {citem.quantity}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    Total: ${citem.total.toFixed(2)}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <IconButton
                    color="error"
                    onClick={() => deleteItem(citem.id)}
                    title="Remove Item"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Total: ${total.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={onClickCheckout}
        >
          Checkout
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onClickClearCart}
        >
          Clear Cart
        </Button>
      </Box>
    </Box>
  );
}

export default Cart;