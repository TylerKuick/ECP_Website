import React from "react";
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
import { styled } from "@mui/system";
import LexChatbot from '../components/Chatbot';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundImage: 'url("https://unsplash.com/photos/assorted-color-clothes-lot-FK81rxilUXg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#fff",
  textAlign: "center",
  padding: theme.spacing(2),
}));

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$59.99",
    image: "https://source.unsplash.com/300x200/?headphones",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$129.99",
    image: "https://source.unsplash.com/300x200/?smartwatch",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: "$49.99",
    image: "https://source.unsplash.com/300x200/?mouse",
  },
  {
    id: 4,
    name: "Laptop Stand",
    price: "$29.99",
    image: "https://source.unsplash.com/300x200/?laptop",
  },
];

function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: "bold", mb: 2, color: "black" }}>
            Welcome to ShopEasy!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: "black" }}>
            Discover the best deals and products tailored for you.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              borderRadius: "8px",
            }}
          >
            Shop Now
          </Button>
        </Box>
      </HeroSection>

      {/* Categories Section */}
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
                backgroundImage:
                  'url("https://source.unsplash.com/300x300/?electronics")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
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
                backgroundImage:
                  'url("https://source.unsplash.com/300x300/?fashion")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
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
                backgroundImage:
                  'url("https://source.unsplash.com/300x300/?home")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
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
                backgroundImage:
                  'url("https://source.unsplash.com/300x300/?sports")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              Sports
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
        >
          Featured Products
        </Typography>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {product.name}
                  </Typography>
                  <Typography color="text.secondary">{product.price}</Typography>
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
        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "gray" }}
        >
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