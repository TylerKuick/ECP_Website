import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box, Card, CardContent } from "@mui/material";

const AdminLogin = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      setUser({ role: "admin" }); // Setting the user role as admin
      navigate("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <Box className="login-container" sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
      <Card className="login-card" sx={{ width: '100%', maxWidth: 600, boxShadow: 3, p: 2 }}>
        <CardContent>
          <Typography className="login-title" variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>Admin Login</Typography>
          {error && <Typography className="login-error" sx={{display:"flex", justifySelf:"center", color:"red", mt: 3}}>{error}</Typography>}
          <TextField
            fullWidth
            margin="normal"
            autoComplete="off"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                },
            }}
          />
          <Button className="login-button" onClick={handleLogin} component="label" variant="contained">
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminLogin;