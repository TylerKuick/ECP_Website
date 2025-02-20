import React from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

import http from "../http";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

function Notifications() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            email: ""
        },
        validationSchema: yup.object({
            email: yup.string().email().required()
        }),
        onSubmit: (data) => {
            data.email = data.email.trim()
            console.log(data);
            http.post("/notifications", data).then((res) => {
                console.log(res);
                navigate("/");
            });
        }
    });
  return (
    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3, p: 2 }}>
            <CardContent>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                    Subscribe to SNS Notifications
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        autoComplete="off"
                        label="Email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            type="submit"
                            sx={{
                                px: 4,
                                py: 1,
                                fontSize: "1rem",
                                borderRadius: 3,
                                backgroundColor: "#4caf50",
                                "&:hover": {
                                    backgroundColor: "#43a047"
                                },
                            }}
                        >
                            Subscribe
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    </Box>
  )
}

export default Notifications