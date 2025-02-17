import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Typography, Box } from "@mui/material";

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userRole) => {
    onLogin(userRole);
    navigate("/"); // Redirect after login
  };

  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h4">Login</Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => handleLogin("user")}>
          Login as User
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleLogin("admin")}>
          Login as Admin
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;