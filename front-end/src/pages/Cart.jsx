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
  Modal
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
      console.log(res.data)
    });
  };

  const getCartId = () => {
    http.get(`/carts?search=${custId}`).then((res) => {
      setCartId(res.data[0]?.id || '');
      console.log(res.data[0]?.id)
    });
  };

  const getCartItems = () => {
    if (cartId) {
      http.get(`/carts/${cartId}/items`).then((res) => {
        setCartItems(res.data);
        console.log(res.data)
      });
    }
  };

  const onClickCheckout = () => {
    const data = {
      cart_total: total,
    };
    console.log(data);
    // http.post(`/cart/${cartId}/`, data);
  };

  const onClickClearCart = () => {
    cartItems.forEach((item) => {
      http.delete(`/carts/${cartId}/items/${item.id}`);
    });
    setCartItems([]);
  };

  const deleteItem = (id) => {
    http.delete(`/carts/${cartId}/items/${id}`).then(() => {
      getCartItems();
    });
  };
  
  // Timer Countdown
  const timeout = (number) => {
      return new Promise( res => setTimeout(res, number));
  };

  const [duration, setDuration] = useState(5);
  const timer = async () => {
      for (var i=5; i >= 0; i--) {
          setDuration(i)
          await timeout(1000)
      }
      navigate("/products");
  }

  // Modal Resources
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      borderRadius:5,
      bgcolor: 'background.paper',
      p: 4,
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
                {product?.imgId && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://tyler-ecp-project-test.s3.us-east-1.amazonaws.com/images/${product.imgId}`}
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
                    Total: ${citem.total}
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
          Total: ${total}
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
      <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
          <Box sx={style}>
              <Typography id="modal-modal-title" variant="h5" component="h2">
              Adding your new product!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  You will be redirected to the product page in... {duration}s
              </Typography>
          </Box>
      </Modal>
    </Box>
  );
}

export default Cart;