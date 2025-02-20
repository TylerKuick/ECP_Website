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
  Modal,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { Delete, ShoppingCartCheckout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import http from '../http';

function Cart() {
  const [cartId, setCartId] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [prodList, setProductList] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();
  const custId = 1;

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

  const getProductList = () => {
    http.get('/products').then((res) => {
      setProductList(res.data);
    });
  };

  const getCartId = () => {
    http.get(`/carts?search=${custId}`).then((res) => {
      setCartId(res.data[0]?.id || '');
    });
  };

  const getCartItems = () => {
    if (cartId) {
      http.get(`/carts/${cartId}/items`).then((res) => {
        setCartItems(res.data);
      });
    }
  };

  const onClickCheckout = () => {
    setCheckoutLoading(true);
    setTimeout(() => {
      navigate('/checkout');
    }, 3000);
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const deleteItem = () => {
    if (itemToDelete) {
      http.delete(`/carts/${cartId}/items/${itemToDelete}`).then(() => {
        getCartItems();
        setOpenConfirm(false);
      });
    }
  };

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
              <Card>
                {product?.imgId && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://tyler-ecp-project-test.s3.us-east-1.amazonaws.com/images/${product.imgId}`}
                    alt={product.prod_name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{product?.prod_name || 'Product Name'}</Typography>
                  <Typography>Qty: {citem.quantity}</Typography>
                  <Typography>Total: ${citem.total}</Typography>
                </CardContent>
                <Box sx={{ textAlign: 'center' }}>
                  <IconButton color="error" onClick={() => confirmDelete(citem.id)}>
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
          startIcon={checkoutLoading ? <CircularProgress size={24} /> : <ShoppingCartCheckout />}
          onClick={onClickCheckout}
          disabled={checkoutLoading}
        >
          {checkoutLoading ? 'Processing...' : 'Checkout'}
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteItem} color="error">Yes</Button>
          <Button onClick={() => setOpenConfirm(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Cart;