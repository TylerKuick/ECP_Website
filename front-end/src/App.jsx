import './App.css';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import Cart from './pages/Cart';
import NewProduct from './pages/NewProduct';

function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
            <Toolbar disableGutters={true} sx={{justifyContent:"space-between"}}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  ECP Project
                </Typography>
              </Link>
              <Box sx={{display: "flex", alignItems:"center"}}>
                <Link to="/products"><Typography>Products</Typography></Link>
                <Link to="/cart"><ShoppingCart sx={{width:"35px", height:"35px"}}/></Link>
              </Box>
              
            </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={<Products/>}/>
          <Route path={"/products"} element={<Products/>}/>
          <Route path={"/cart"} element={<Cart/>}/>
          <Route path={"/newProduct"} element={<NewProduct/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;