import { Box, Typography, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react';
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
            prod_name: yup.string().trim().min(3).max(100).required(),
            prod_price: yup.string().trim().min(1).max(4).matches("^[0-9]*\.[0-9]*").required(),
            description: yup.string().trim().min(3).max(500).required()
        }),
        onSubmit: (data) => {
            data.prod_name = data.prod_name.trim();
            data.prod_price = data.prod_price.trim(),
            data.description = data.description.trim();
            http.post("/products", data).then((res) => {
                console.log(res.data);
                navigate("/");
            });
        }
    });
  return (
    <Box>
        <Typography variant="h4" sx={{my:2, mt: 5, fontWeight:"bold"}}>
            Add Product
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth margin="normal" autoComplete="off"
                label="Product Name"
                name="prod_name"
                value={formik.values.prod_name}
                onChange={formik.handleChange}
                error={formik.touched.prod_name && Boolean(formik.errors.prod_name)}
                helperText={formik.touched.prod_name && formik.errors.prod_name}
            />
            <TextField
                fullWidth margin="normal" autoComplete="off"
                label="Product Price ($)"
                name="prod_price"
                value={formik.values.prod_price}
                onChange={formik.handleChange}
                error={formik.touched.prod_price && Boolean(formik.errors.prod_price)}
                helperText={formik.touched.prod_price && formik.errors.prod_price}
            />
            <TextField
                fullWidth margin="normal" autoComplete="off"
                multiline minRows={2}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
            />
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" type="submit">
                    Add
                </Button>
            </Box>
         </Box>
    </Box>
  )
}

export default NewProduct   