import "./App.css";
import { useState, useEffect } from "react";
import { Container, AppBar, Toolbar, Typography, Box, Button, Menu, MenuItem } from "@mui/material";
import { ShoppingCart, AccountCircle } from "@mui/icons-material";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import NewProduct from "./pages/NewProduct";
import UpdateProduct from "./pages/UpdateProduct";
import Home from "./pages/Home";
import ChatbotPage from "./pages/ChatbotPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import OrderHistory from "./pages/OrderHistory";
import Notifications from './pages/Notifications';
import CartButton from './components/CartButton';
import http from './http.js';

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [cartLength, setCartLength] = useState(0);
  const [cartItems, setCartItems] = useState([])
  const getCartLength = () => {
    const cartId = 4
    http.get(`/carts?search=1`).then((res) => {
      if (cartId) {
        http.get(`/carts/${cartId}/items`).then((res) => {
          setCartLength(res.data.length);
          setCartItems(res.data);
        });
      }
    })
  }

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    getCartLength();
  }, [user, cartItems]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <AppBar position="static" className="AppBar">
        <Container>
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Link to="/">
              <Typography variant="h6" component="div">ECP Project</Typography>
            </Link>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Link to="/"><Typography>Home</Typography></Link>
              <Link to="/products"><Typography>Products</Typography></Link>
              {/* <Link to="/orderHistory"><Typography>Orders</Typography></Link> */}
              <Link to="/cart">
                {/* <ShoppingCart sx={{ width: "35px", height: "35px" }} /> */}
                <CartButton cartLength={cartLength}/>
              </Link>

              {user ? (
                <>
                  {user.role === "admin" && <Link to="/admin"><Typography>Admin</Typography></Link>}
                  <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={handleMenuOpen} startIcon={<AccountCircle />}>
                    Login
                  </Button>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem component={Link} to="/user-login">Login as User</MenuItem>
                    <MenuItem component={Link} to="/admin-login">Login as Admin</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products user={setUser}/>} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/newProduct" element={<NewProduct />} />
          <Route path="updateProduct" element={<UpdateProduct/>}/>
          <Route path="/orderHistory" element={<OrderHistory/>} />
          <Route path="notifications" element={<Notifications/>}/>
          <Route path="/user-login" element={<UserLogin setUser={setUser} />} />
          <Route path="/admin-login" element={<AdminLogin setUser={setUser} />} />
          <Route
            path="/admin"
            element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;