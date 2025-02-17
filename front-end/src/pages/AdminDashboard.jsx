import { Container, Typography } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography>Welcome, Admin! Manage your products, users, and settings here.</Typography>
    </Container>
  );
};

export default AdminDashboard;
