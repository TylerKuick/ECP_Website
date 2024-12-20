import './App.css';
import { Container, AppBar, Toolbar, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <AppBar position="static" className='AppBar'>
        <Container>
            <Toolbar disableGutters={true}>
              <Link to="/">
                <Typography variant="h6" component="div">
                  ECP Project
                </Typography>
              </Link>
              <Link to="/products" ><Typography>Products</Typography></Link>
              <Link to="/cart"><Typography>Cart</Typography></Link>
            </Toolbar>
        </Container>
      </AppBar>
      <Container>
        <Routes>
          <Route path={"/"} element={<Products/>}/>
          <Route path={"/products"} element={<Products/>}/>
          <Route path={"/cart"} element={<Cart/>}/>
        </Routes>
      </Container>
    </Router>
  );
}

export default App;