import { Box, Typography, TextField, Button, Card, CardContent, Container, Modal } from '@mui/material';
import { CloudUpload } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import React, { useState, useEffect } from 'react';
import http from "../http";
import * as yup from 'yup';
import dayjs from 'dayjs';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

function NewProduct() {
    // // Image Upload to S3 from Form
    const [img, setImg] = useState(null);
    const [imgURL, setImgURL] = useState(null);
    const [err, setError] = useState("");
    const validTypes = ['image/jpg', 'image/png', 'image/jpeg'];

    const handleImgChange = (e) => {
        if (validTypes.find(type => type === e.target.files[0].type)) {
            setError();
            setImg(e.target.files[0]);
            setImgURL(URL.createObjectURL(e.target.files[0]));
        }
        else {
            setImg();
            setImgURL();
            setError("Please only upload PNG/JPG/JPEG images.");
        }
    }

    const handleImgUpload = async (imgBlob, dbID) => {
        const photoKey = dbID
        // Trigger Lambda to get s3 presigned url      
        try {
            const data = {
                "ContentType": imgBlob.type
            };
            const response = await http.post(`/uploadImage/${photoKey}`, data).then((res) => {
                return res.data;
            })
            const url = response;
            console.log(url);
            const result = await axios.put(url, imgBlob, {
                headers: {
                    "Content-Type": imgBlob.type
                },
            });
            console.log(result);
        }
        catch (error) {
            console.error("Error uploading image", error);
        }
    }

    // Timer Countdown
    const timeout = (number) => {
        return new Promise( res => setTimeout(res, number));
    };

    const [duration, setDuration] = useState(5);
    const timer = async () => {
        for (var i=5; i >= 0; i--) {
            setDuration(i)
            await timeout(1000)
        }
        navigate("/products");
    }
    
    // Modal Resources
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        borderRadius:5,
        bgcolor: 'background.paper',
        p: 4,
      };

    const navigate = useNavigate();
    const now = dayjs();
    const ts = now.unix();
    const formik = useFormik({
        initialValues: {
            prod_name: "",
            prod_price: "",
            description: "",
            imgId: ""
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
            data.imgId = `${ts}${data.prod_name.replaceAll(" ", "")}`;
            console.log(data);
            timer();
            handleImgUpload(img, data.imgId).then((res) => {
                console.log(res);
                http.post("/products", data).then((res) => {
                    console.log(res.data);
                });
            });
        }
    });
    const [selectedImage, setSelectedImage] = useState(null);
    return (
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                        Add New Product
                    </Typography>
                    
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Box sx={{display:"flex", justifyContent:"center"}}>
                           
                        </Box>
                        
                        <Button
                            component="label"
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUpload />}
                            sx ={{ display:"flex", justifySelf: "center"}}
                            >
                            Upload Image
                            <input
                                style={{display:"none"}}
                                type="file"
                                onChange={handleImgChange}
                            /> 
                        </Button>
                        {
                            img ? (
                                <Container sx={{mt:3}}>
                                    <img 
                                        style={{width:"100%"}}
                                        src={imgURL}
                                        loading="lazy"
                                    />
                                </Container>
                            ) : <></>
                        }
                        { 
                            err ? (
                                <Typography sx={{display:"flex", justifySelf:"center", color:"red", mt: 3}}>
                                    {err}
                                </Typography>
                            ) : <></>
                        }
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
                                    }
                                }}
                                onClick={handleOpen}
                            >
                                Add Product
                            </Button>
                        </Box>
                    </Box>
                    <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h5" component="h2">
                            Adding your new product!
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                You will be redirected to the product page in... {duration}s
                            </Typography>
                        </Box>
                    </Modal>
                </CardContent>
            </Card>
        </Box>
    );
}

export default NewProduct;