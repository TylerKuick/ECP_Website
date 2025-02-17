import React, {useState, useEffect} from 'react';
import http from "../http.js";
import { Box, Typography, TextField, Button, Card, CardContent, Container, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

function UpdateProduct() {
    const [imgURL, setImgURL] = useState("");
    var item = JSON.parse(localStorage.getItem("UpdateItemData"));

    useEffect(() => {
        setImgURL(`https://tyler-ecp-project-test.s3.us-east-1.amazonaws.com/images/${item.imgId}`);
    }, [])

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
    const [open, setOpen] = React.useState(false);
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
        enableReinitialize: true,
        initialValues: {
            prod_name: item.prod_name,
            prod_price: item.prod_price,
            description: item.description,
            imgId: item.imgId
        },
        validationSchema: yup.object({
            prod_name: yup.string().trim().min(3).max(100),
            prod_price: yup
                .string()
                .trim()
                .matches("^[0-9]*\\.[0-9]*$", "Invalid price format")
                ,
            description: yup.string().trim().min(3).max(500)
        }),
        onSubmit: (data) => {
            data.prod_name = data.prod_name.trim();
            data.prod_price = data.prod_price.trim();
            data.description = data.description.trim();
            data.imgId = data.imgId.trim()
            console.log(data);
            timer();
            http.put(`/products/${item.id}`, data).then((res) => {
                console.log(res.data);
            });
        }
    });

  return (
    <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Card sx={{ width: '100%', maxWidth: 600, boxShadow: 3, p: 2 }}>
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
                        Update Product Information
                    </Typography>
                    {
                        imgURL ? (
                            <Container sx={{mt:3}}>
                                <img 
                                    style={{width:"100%"}}
                                    src={imgURL}
                                    loading="lazy"
                                />
                            </Container>
                        ) : <></>
                    }
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
                            Updating your product!
                            </Typography>
                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                You will be redirected to the product page in... {duration}s
                            </Typography>
                        </Box>
                    </Modal>
                </CardContent>
            </Card>
        </Box>
  )
}

export default UpdateProduct
