import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2, Card, CardContent, IconButton, TextField, Button, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, Clear, Delete} from '@mui/icons-material';
import http from '../http';

function Products() {
    const [productList, setProductList] = useState([]);
    const custId = 1;

    // Cart Info
    const [cartId, setCartId] = useState('');

    const getCartID = () => {
        http.get(`/carts?search=${custId}`).then((res) => {
            var json_res = JSON.parse(res.data['body'])
            setCartId(json_res[0].id);
        })
    }

    const addToCart = (product, qty) => {
        let data = {
            "ProductId": product.id,
            "quantity": qty,
            "total": (product.prod_price * qty),
        };
        http.post(`/carts/${cartId}/items`, data);
    }

    const getProducts = () => {
        http.get('/products').then((res)=> {
            var json_res = JSON.parse(res.data['body']);
            setProductList(json_res);
            console.log(productList)
        });
    };

    const deleteProduct = (id) => {
        http.delete(`/products/${id}`).then(()=> {
            getProducts();
        });
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

    // Initialization
    useEffect(() => {
        getProducts();
        getCartID();
        console.log(productList)
    }, []);

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Products
                </Typography>
                <Button variant="contained" color="primary">
                    <Link to="/newProduct" className="link">
                        Add Product
                    </Link>
                </Button>
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
                    <Grid2 item xs={12} sm={6} md={4} lg={3} key={product.id}>
                        <Card
                            sx={{
                                boxShadow: 3,
                                borderRadius: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                            }}
                        >
                            {/* Add an image placeholder if no product image */}
                            <CardMedia
                                component="img"
                                image={`https://tyler-ecp-project-test.s3.us-east-1.amazonaws.com/images/${product.imgId}` || 'https://via.placeholder.com/150'}
                                alt={product.prod_name}
                                sx={{ height: 150, objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {product.prod_name}
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                                    Price: ${product.prod_price}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', mb: 2 }}
                                >
                                    {product.description}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => addToCart(product, 1)}
                                >
                                    Add to Cart
                                </Button>
                                <Button 
                                    sx={{mt:2}}
                                    variant="contained"
                                    color="error" 
                                    fullWidth
                                    onClick={() => deleteProduct(product.id)}
                                >
                                        <Delete/>
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
    );
}

export default Products;