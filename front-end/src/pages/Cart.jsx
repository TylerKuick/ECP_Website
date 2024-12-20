import { React, useState, useEffect } from 'react';
import { Box, Typography, Grid2, Card, CardContent, IconButton, Input } from '@mui/material';
import http from '../http';

function Cart() {
    const [cartId, setCartId] = useState("");
    const [cartItems, setCartItems] = useState([]);
    const custId = 1;
    
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

    useEffect(() => {
        getCartId();
        getCartItems();
    }, [cartId]);

    return (
        <Box>
            <Typography variant="h4" sx={{my:2}}>
                Cart
            </Typography>
            <Grid2 container spacing={2}>
                {
                    cartItems.map((citem, i) => {
                        return(
                            <Grid2 item xs={12} md={6} lg={4} key={citem.id}>
                                <Card>
                                    <CardContent>
                                        <Typography varaint="h6" sx={{ mb: 1 }}>
                                            Product ID: {citem.ProductId}
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

        </Box>
    )
}

export default Cart