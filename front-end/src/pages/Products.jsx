import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2, Card, CardContent, IconButton, TextField, Button, CardMedia, Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, Clear, Delete, Edit } from '@mui/icons-material';
import http from '../http';
import LexChatbot from '../components/Chatbot';
import CartButton from '../components/CartButton';

function Products({ user }) {
    const [productList, setProductList] = useState([]);
    const custId = 1;
    const userJson = JSON.parse(localStorage.getItem('user'));
    const isAdmin = userJson?.role === 'admin'; // Check if the user is an admin
    const isUser = userJson?.role !== 'admin';

    // Cart Info
    const [cartId, setCartId] = useState('');

    const getCartID = () => {
        http.get(`/carts?search=${custId}`).then((res) => {
            setCartId(res.data[0]?.id || '');
        });
    };

    const addToCart = (product, qty) => {
        let data = {
            "ProductId": product.id,
            "quantity": qty,
            "total": (product.prod_price * qty),
        };
        http.post(`/carts/${cartId}/items`, data);
        setOpenSnackbar(true);
    };

    const getProducts = () => {
        http.get('/products').then((res) => {
            setProductList(res.data);
            console.log(productList);
        });
    };

    const deleteProduct = (id) => {
        http.delete(`/products/${id}`).then(() => {
            getProducts();
        });
    };

    const setUpdateDetails = (product) => {
        http.get(`/products/${product.id}`).then((res)=> {
            let data = res.data;
            localStorage.setItem("UpdateItemData", JSON.stringify(data));
            window.dispatchEvent(new Event("UpdateItemData"));
            console.log("localStorage on button click: ", localStorage.getItem("UpdateItemData"));
        });

        // let test = JSON.parse(localStorage.getItem("UpdateItemData"));
        // console.log(test);
    }

    // Search Products
    const [search, setSearch] = useState('');
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };
    const searchProducts = () => {
        http.get(`/products?search=${search}`).then((res) => {
            setProductList(res.data);
        });
    };

    const onSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    };

    const onClickSearch = () => {
        searchProducts();
    };

    const onClickClear = () => {
        setSearch('');
        getProducts();
    };

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    // Initialization
    useEffect(() => {
        
        getCartID();
    }, [cartId]);
    
    useEffect(() => {
        getProducts();
        localStorage.setItem("UpdateItemData", JSON.stringify({}));
        console.log("localStorage at useEffect: ",localStorage.getItem("UpdateItemData"));
    }, [])

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Products
                </Typography>
                {isAdmin ? (
                    <Button variant="contained" color="primary">
                    <Link to="/newProduct" className="link">
                        Add Product
                    </Link>
                    </Button>) : <></> 
                }
                {
                    isUser ? (
                        <Button variant="contained" color="primary">
                    <Link to="/notifications" className="link">
                        Notifications
                    </Link>
                    </Button>) : <></> 
                    
                }
            </Box>

            {/* Search Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <TextField
                    value={search}
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                    placeholder="Search products..."
                    variant="outlined"
                    size="small"
                    sx={{ flexGrow: 1, mr: 2 }}
                />
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="secondary" onClick={onClickClear}>
                    <Clear />
                </IconButton>
            </Box>

            {/* Product Cards */}
            <Grid2 container spacing={3}>
                {productList.map((product) => (
                    <Grid2 item size={{xs:12, sm:6, md:4, lg:3 }}key={product.id}>
                        <Card
                            sx={{
                                boxShadow: 4,
                                borderRadius: 3,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": { transform: "scale(1.02)" },
                            }}
                        >
                            {/* Product Image */}
                            <CardMedia
                                component="img"
                                image={product.imgId
                                    ? `https://tyler-ecp-project-test.s3.us-east-1.amazonaws.com/images/${product.imgId}`
                                    : 'https://via.placeholder.com/150'}
                                alt={product.prod_name}
                                sx={{ height: 180, objectFit: 'cover' }}
                            />

                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                {/* Product Name */}
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold", color: "black" }}>
                                    {product.prod_name}
                                </Typography>

                                {/* Product Price */}
                                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                                    Price: <b>${product.prod_price}</b>
                                </Typography>

                                {/* Buttons (Add to Cart & Delete for Admins) */}
                                <Box sx={{ mt: "auto" }}>
                                    {isUser && (
                                        <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        onClick={() => addToCart(product, 1)}
                                        sx={{ borderRadius: 2 }}
                                        >
                                            Add to Cart
                                        </Button>
                                        
                                    )}
                                    {/* Show delete button only if user is an admin */}
                                    {isAdmin && (
                                        <Box>
                                            <Link to="/updateProduct" className="link">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    onClick={() => setUpdateDetails(product)}
                                                    sx={{ borderRadius: 2 }}
                                                    >
                                                        <Edit sx={{ mr: 1 }}/>Update
                                                </Button>
                                            </Link>
                                            <Button
                                                sx={{ mt: 1, borderRadius: 2 }}
                                                variant="contained"
                                                color="error"
                                                fullWidth
                                                onClick={() => deleteProduct(product.id)}
                                            >
                                                <Delete sx={{ mr: 1 }} /> Delete
                                            </Button>
                                        </Box>
                                        
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid2>    
                ))}
            </Grid2>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Item added to cart!
                </Alert>
            </Snackbar>

            <div>
                <LexChatbot />
            </div>
        </Box>
    );
}

export default Products;
