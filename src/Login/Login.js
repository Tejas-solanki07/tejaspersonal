import * as React from "react";
import axios from "axios";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";

import Link from "@mui/material/Link";

import Box from "@mui/material/Box";
import { Snackbar, Alert } from '@mui/material';

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        Tech Nishal
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {
  const [data, setData] = useState({});
  const nav = useNavigate();
  const [alertMsg, setAlertMsg] = React.useState({open: false, message: "" });
  const [alertSuccess, setAlertSuccess] = React.useState({
    open: false,
    message: "",
  });
  
  const [state, setState] = React.useState({
    op: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, op } = state;

  const handleClick1 = (newState) => {
    setState({ ...state, op: true });
  };
  
  const handleClose12 = () => {
    setState({ ...state, op: false });
    setAlertSuccess({ ...alertSuccess, open: false });
    setAlertMsg({ ...alertMsg, open: false });
    
  };




  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
            />
         
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={(e) => {
                e.preventDefault();
                axios
                  .post("http://localhost:5000/login/login", data)
                  .then((data) => {
                    localStorage.setItem('token',data.data.tokan)
                    if (data.status == 200) {
                      handleClick1({ vertical: "top", horizontal: "center" });

                      setAlertSuccess({
                        open: true,
                        message: data.data.msg,
                       
                      });
                 
                    }
                    setTimeout(()=>{
                      nav("/dashBoard/dashBoard");
                    },2000)
                   
                    
                    console.log(data);
                  })
                  .catch((err) => {
                    console.log(err);
                    if (!data.status) {
                      handleClick1({ vertical: "top", horizontal: "center" });

                      setAlertMsg({
                        open: true,
                       
                        message: err.response.data.error
                      });
                     
                    }
                  });
              }}
            >
              Sign In
            </Button>
           
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>

      <Snackbar
        open={op}
        autoHideDuration={2000}
        onClose={handleClose12}
        anchorOrigin={{ vertical, horizontal }}
        
      >
          {(alertSuccess.open || alertMsg.open) && (
    <Alert
      onClose={handleClose12}
      severity={alertSuccess.open ? "success" : "error"}
                // alertSuccess.open? "success": alertMsg.open? "error": alertInfo.open? "info": "info"\

      variant="filled"
      sx={{ width: "100%" }}
    >
      {alertSuccess.open ? alertSuccess.message : alertMsg.message}
    </Alert>
  )}
      </Snackbar>
    </ThemeProvider>
  );
}
