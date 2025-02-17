import { Container, Typography } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography sx={{mt: 2}}>Welcome! You've signed in as an Admin! Navigate to the Product page to manage your products!</Typography>
    </Container>
  );
};

export default AdminDashboard;
