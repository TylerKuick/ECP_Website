import React from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function ConfirmOrder() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 5 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, color: "#4caf50" }}>
            Order Confirmed! <CheckCircleIcon fontSize="large" sx={{ color: "#4caf50", verticalAlign: "middle" }} />
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
            Thank you for your purchase. Your order has been placed successfully.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              // Optionally show loading animation before redirecting
              // This can be done with a delay for a smoother transition
              <CircularProgress size={24} color="secondary" />;
              setTimeout(() => navigate("/products"), 500);
            }}
            sx={{
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#1976d2",
              '&:hover': {
                backgroundColor: "#1565c0",
              }
            }}
          >
            Continue Shopping
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ConfirmOrder;