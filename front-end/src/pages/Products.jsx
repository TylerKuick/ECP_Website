import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2, Card, CardContent, IconButton, Input, Button} from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, Clear } from "@mui/icons-material";
import http from "../http";

function Products() {
    const [productList, setProductList] = useState([]);
    const custId = 1;

    // Cart Info
    const [cartId, setCartId] = useState("");
    
    const getCartID = () => {
        http.get(`/cart?search=${custId}`).then((res) => {
            setCartId(res.data[0].id);
        })
    }

    const addToCart = (product, qty) => {
        let data = {
            "ProductId": product.id,
            "CartId": cartId,
            "quantity": qty,
            "total": (product.prod_price * qty),
        };
        http.post(`/cart/${cartId}/items`, data);
    }

    const getProducts = () => {
        http.get('/products').then((res)=> {
            setProductList(res.data);
            console.log(res.data["body"])
        });
    };

    // Search Products 
    const [search, setSearch] = useState('');
    const onSearchChange = (e) => {
        setSearch(e.target.value);
    }
    const searchProducts = () => {
        http.get(`/products?search=${search}`).then((res)=> {
            setProductList(res.data);
        });
    }
    
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchProducts();
        };
    };

    const onClickSearch = () => {
        searchProducts();
    }

    const onClickClear = () => {
        setSearch("");
        getProducts();
    }

    const onClickAddProduct = () => {
        let data = {

        } 
    }
    
    // Initialization
    useEffect(() => {
        getProducts();
        getCartID();
    }, []);


        
    return (
        <Box>
            <Box sx={{alignItems:'center', display:'flex', mt:5}}>
                <Typography variant="h4" sx={{my:2, fontWeight:"bold"}}>
                    Products
                </Typography>
                <Button variant='contained' sx={{ml: 5}}>
                    <Link to='/newProduct' className='link'>
                        Add Products 
                    </Link>
                </Button>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                <Input value={search} placeholder="Search" onChange={onSearchChange} onKeyDown={onSearchKeyDown}/>
                <IconButton color="primary" onClick={onClickSearch}>
                    <Search /> 
                </IconButton>
                <IconButton color='primary' onClick={onClickClear}>
                    <Clear /> 
                </IconButton>
            </Box>

            <Grid2 container spacing={2}>
                {
                    productList.map((product, i) => {
                        return(
                            <Grid2 item xs={12} md={6} lg={4} key={product.id}>
                                <Card>
                                    <CardContent>
                                        <Typography varaint="h6" sx={{ mb: 1 }}>
                                            {product.prod_name}
                                        </Typography>
                                        <Typography>
                                            Price: ${product.prod_price}
                                        </Typography>
                                        <Typography sx={{ whiteSpace: "pre-wrap" }}>
                                            Description: {product.description}
                                        </Typography>
                                        <Button variant="contained"  sx={{mt: 2}}
                                        onClick={() => addToCart(product, 1)}>
                                            Add To Cart
                                        </Button>
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

export default Products