import { React, useState, useEffect } from 'react';
import { Box, Typography, Grid2, Card, CardContent, IconButton, Input, Button } from '@mui/material';
import http from '../http';

function Cart() {
    const [cartId, setCartId] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [prodList, setProductList] = useState([]);
    const custId = 1;
    
    const getProductList = () => {
        http.get('/products').then((res) => {
            setProductList(res.data);
            console.log(res.data);
        });
    }

    const getCartId = () => {
        http.get(`/cart?search=${custId}`).then((res) => {
            setCartId(res.data[0].id);
        });
    };

    const getCartItems = () => {
        http.get(`/cart/${cartId}/items`).then((res) => {
            setCartItems(res.data);
        });
    };

    const onClickCheckout = () => {
        let data = {
            "cart_total": total
        }
        console.log(data);
        //http.post(`/cart/${cartId}/checkout`, data)
    };

    const onClickClearCart = () => {
        cartItems.map((item) => {
            http.delete(`/cart/${cartId}/items/${item.id}`);
        });
        setCartItems([]);
    };

    useEffect(() => {
        getCartId();
    });

    useEffect(() => {
        getCartItems();
        getProductList();
    }, [cartId]);

    useEffect(() => {
        setTotal(cartItems.map((x) => x.total).reduce((x,y) => {return parseFloat(x) + parseFloat(y)}, 0));
    }, [cartItems]);

    return (
        <Box>
            <Typography variant="h4" sx={{pt: 5, my:2, fontWeight:"bold"}}>
                Your Cart
            </Typography>
            <Grid2 container spacing={2}>
                {
                    cartItems.map((citem, i) => {
                        return(
                            <Grid2 item xs={12} md={6} lg={4} key={citem.id}>
                                <Card>
                                    <CardContent>
                                        <Typography varaint="h6" sx={{ mb: 1 }}>
                                            {prodList.filter(prod => prod.id == citem.ProductId).map(prod => prod.prod_name)}
                                        </Typography>
                                        <Typography>
                                            Qty: {citem.quantity}
                                        </Typography>
                                        <Typography>
                                            Total: ${citem.total}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid2>
                        )
                    })
                }
            </Grid2>
            <Box sx={{mt: 5}}>
                <Typography>Total: ${total}</Typography>
            </Box>
            <Button variant="contained" 
                sx={{mt: 2}}
                onClick={() => onClickCheckout()}>
                Checkout
            </Button>
            <Button variant="contained" 
                sx={{mt: 2, ml: 2}}
                onClick={() => onClickClearCart()}>
                Clear Cart Items
            </Button>
        </Box>
    )
}

export default Cart