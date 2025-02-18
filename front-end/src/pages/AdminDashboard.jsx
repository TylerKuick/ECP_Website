import { Container, Typography, Button } from "@mui/material";

const AdminDashboard = () => {
  const openCloudWatchDashboard = () => {
    window.open('https://cloudwatch.amazonaws.com/dashboard.html?dashboard=admin-dashboard&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTE2MDg4NTI3NDQ0OSIsIlUiOiJ1cy1lYXN0LTFfbDdWWVZ2ME1oIiwiQyI6ImU4cWMxdXJsMGk3bTFsaTRucnRqMHQyZjMiLCJJIjoidXMtZWFzdC0xOjVjMzVmNTIyLTUyNWUtNGI4YS05YzUzLTgzNTBiOWY5MGI3OSIsIk8iOiJhcm46YXdzOmlhbTo6MTYwODg1Mjc0NDQ5OnJvbGUvc2VydmljZS1yb2xlL0NXREJTaGFyaW5nLVJlYWRPbmx5QWNjZXNzLVdTTVBPOEwyIiwiTSI6IlVzclB3U2luZ2xlIn0=', '_blank');
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h3">Admin Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>
        Welcome! You've signed in as an Admin! Navigate to the Product page to manage your products!
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }} 
        onClick={openCloudWatchDashboard}
      >
        Open CloudWatch Dashboard
      </Button>
    </Container>
  );
};

export default AdminDashboard;