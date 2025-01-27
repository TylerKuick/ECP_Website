import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import React from 'react';
import http from "../http";
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

function NewProduct() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            prod_name: "",
            prod_price: "",
            description: ""
        },
        validationSchema: yup.object({
            prod_name: yup.string().trim().min(3).max(100).required("Product Name is required"),
            prod_price: yup
                .string()
                .trim()
                .matches("^[0-9]*\\.[0-9]*$", "Invalid price format")
                .required("Product Price is required"),
            description: yup.string().trim().min(3).max(500).required("Description is required")
        }),
        onSubmit: (data) => {
            data.prod_name = data.prod_name.trim();
            data.prod_price = data.prod_price.trim();
            data.description = data.description.trim();
            http.post("/products", data).then((res) => {
                console.log(res.data);
                navigate("/products");
            });
        }
    });

    return (
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                        Add New Product
                    </Typography>
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Product Name"
                            name="prod_name"
                            value={formik.values.prod_name}
                            onChange={formik.handleChange}
                            error={formik.touched.prod_name && Boolean(formik.errors.prod_name)}
                            helperText={formik.touched.prod_name && formik.errors.prod_name}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Product Price ($)"
                            name="prod_price"
                            value={formik.values.prod_price}
                            onChange={formik.handleChange}
                            error={formik.touched.prod_price && Boolean(formik.errors.prod_price)}
                            helperText={formik.touched.prod_price && formik.errors.prod_price}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            multiline
                            minRows={3}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
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
                                Add Product
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default NewProduct;