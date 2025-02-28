import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import http from "../http";
import LexChatbot from "../components/Chatbot";
import HeroImg from "../imgs/heroimg.jpg";
import ElectronicsImg from "../imgs/electronics.jpg";
import FashionImg from "../imgs/fashion.jpg";
import HomeAndLivingImg from "../imgs/homeandliving.jpg";
import SportsImg from "../imgs/sports.jpg";

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HeroImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: theme.spacing(2),
  marginTop: "50px",
}));

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    http.get("/products").then((res) => {
      setProducts(res.data.slice(0, 4)); // Display only a few products
    });
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, color: "white" }}>
            Welcome to ShopEasy!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "white" }}>
            Discover the best deals and products tailored for you.
          </Typography> 
            <Button
              component={Link}
              to="/products"
              variant="contained"
              color="primary"
              sx={{ px: 4, py: 1.5, fontSize: "1rem", borderRadius: "8px" }}
            >
              Shop Now
            </Button>
        </Box>
      </HeroSection>

      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Shop by Categories
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "120px",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${ElectronicsImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              Electronics
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "120px",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${FashionImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              Fashion
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "120px",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${HomeAndLivingImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              Home & Living
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                height: "120px",
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${SportsImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "18px"
              }}
            >
              Sports
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia component="img" height="140" image={product.imgId
                                    ? `https://tyler-ecp-project-test.s3.us-east-1.amazonaws.com/images/${product.imgId}`
                                    : 'https://via.placeholder.com/150'}
                                alt={product.prod_name}
                                sx={{ height: 180, objectFit: 'cover' }} />
                <CardContent>
                  <Typography variant="h7" sx={{ fontWeight: "bold" }}>
                    {product.prod_name}
                  </Typography>
                  <Typography color="text.secondary">${product.prod_price}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="contained" fullWidth>
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: "#f5f5f5", py: 3, mt: 5 }}>
        <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
          © 2025 ShopEasy. All rights reserved. | Contact Us: support@shopeasy.com
        </Typography>
      </Box>
      <div>
        <LexChatbot />
      </div>
    </Box>
  );
}

export default HomePage;