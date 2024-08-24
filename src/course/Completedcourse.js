import React from "react";

import axios from "axios";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import { Snackbar, Alert,Paper } from '@mui/material';
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

import jwttoken from '../Token'
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/system";

function convertToIST(utcDateStr) {
  const date = new Date(utcDateStr);

  const options = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    // hour12: false // 24-hour format
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export default function Completedcourse() {
  const CustomPagination = styled(Pagination)(({ theme }) => ({
    "& .MuiPaginationItem-root": {
      width: "30px",  // Default width
      height: "30px", // Default height
    
      "&.Mui-selected": {
        width: "30px", // Width for selected item
        height: "30px", // Height for selected item
        "&:hover": {
          width: "30px", // Adjust width on hover when selected
          height: "30px", // Keep height consistent on hover when selected
        },
      },
    },
  }));
  
  const [open, setOpen] = React.useState(false);
  
  const [count, setcount] = React.useState(0);
  const [count1, setcount1] = React.useState(0);
  const [page, setpage] = React.useState(1);
  console.log(page);

  
  const [totalpages, settotalpages] = React.useState("");

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
  console.log(state);
  const handleClose12 = () => {
    setState({ ...state, op: false });
    setAlertSuccess({ ...alertSuccess, open: false });
    setAlertMsg({ ...alertMsg, open: false });
    
  };

  const[id,setid]=React.useState('')
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose2 = () => {
    setOpen(false);
  };
  const handleClose = () => {
    setview(false);
  };
  const [view, setview] = React.useState(false);


  const [arr, setarr] = React.useState([]);
  const [update, doupdate] = React.useState(false);
  const [data, setData] = React.useState({ Date: dayjs("") });
  const [student, setstudent] = React.useState([]);
  
React.useEffect(() => {
    axios
      .get(`http://localhost:5000/ISC/getAllData?page=${page}&limit=${10}`,jwttoken())
      .then((data) => {
        console.log(data)
        setarr(data.data.data);
        settotalpages(data.data.totalPages)
        console.log("arr is set");
      })
      .catch((err) => {
        console.log(err);
      });
  }, [update,page]);
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  const handleDateChange = (val) => {
    const selectedDate = new Date(val);
    const timezoneOffset = 5.5 * 60; // 5.5 hours in minutes
    const adjustedDate = new Date(
      selectedDate.getTime() + timezoneOffset * 60 * 1000
    );
    const formattedDate = adjustedDate.toISOString();

    setData({ ...data, Date: formattedDate });
  };

  const handlechange = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };
  const pagination=React.useMemo(()=>{
return(
  <Grid xs={12} sx={{display:'flex',justifyContent:'center'}}>
  <Box sx={{ mb: 2 }}>
              <CustomPagination
                count={totalpages?totalpages:1}
                page={page}
             
                size="small"
                siblingCount={1} 
                boundaryCount={1}
                onChange={(e, p) => {
                  setpage(p);
                }}
                showFirstButton={false}
                showLastButton={false}
              />
            </Box>
            </Grid>
)
  },[totalpages,page])
  
  const snack=React.useMemo(()=>{
    console.log('snack bar called')
    return(
      <Snackbar
      open={op}
      autoHideDuration={3000}
      onClose={handleClose12}
      anchorOrigin={{ vertical, horizontal }}
      
    >
        {(alertSuccess.open || alertMsg.open) && (
  <Alert
    onClose={handleClose12}
    severity={alertSuccess.open ? "success" : "error"}
              

    variant="filled"
    sx={{ width: "100%" }}
  >
    {alertSuccess.open ? alertSuccess.message : alertMsg.message}
  </Alert>
)}
    </Snackbar>
    )

  },[op])
const table=React.useMemo(()=>{
  console.log('table called')
  return(
    <Box sx={{mx:2}}>

    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 650 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell
            align="center"
            sx={{
              position: "sticky",
              left: 0,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            Course
          </TableCell>
          <TableCell align="center">Start Date</TableCell>
          <TableCell align="center">Days</TableCell>
          <TableCell align="center">Batch Timings</TableCell>
          <TableCell align="center">Batch Name</TableCell>

          <TableCell colSpan={2} align="center">
            Actions
          </TableCell>
        </TableRow>
      </TableHead>
<TableBody sx={{height:arr && arr.length<1?220:0}}>
      {arr && arr.length>0?
        arr.map((row, idx) => (
          <TableRow
            key={row.name}
            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
          >
            <TableCell
              align="center"
              sx={{
                position: "sticky",
                left: 0,
                backgroundColor: "white",
                zIndex: 1,
              }}
            >
              {row.CourseId && row.CourseId.Course}
            </TableCell>

            <TableCell align="center">
              {row.CourseId && row.CourseId.StartDate.split("T")[0]}
            </TableCell>

            <TableCell align="center">
              {row.CourseId &&
                row.CourseId.Days.map((val) => <Box>{val}</Box>)}
            </TableCell>
            <TableCell align="center">
              {row.CourseId && convertToIST(row.CourseId.BatchTime)}
            </TableCell>
            <TableCell align="center">
              {row.CourseId && row.CourseId.batchName}
            </TableCell>
            <TableCell align="center">
              <Tooltip title="Edit Students" arrow>
                <Button
                  color="error"
                  onClick={() => {
                    handleClickOpen();
                    setstudent(row.StudentArray);
                    
                    setid(row._id)
                  }}
                >
                  <EditIcon />
                </Button>
              </Tooltip>
            </TableCell>

            <TableCell align="center">
              <Tooltip title="View Batch Students" arrow>
                <Button
                  color="primary"
                  onClick={() => {
                    setview(!view);
                    setcount(idx);


                    setstudent(row.StudentArray);
                    
                    setcount1(row.StudentArray && row.StudentArray.length);
                  }}
                >
                  <RemoveRedEyeIcon />
                </Button>
              </Tooltip>
            </TableCell>

          </TableRow>
        ))
      :
      <TableRow>
        <TableCell colSpan={7} align="center"> No Date Available</TableCell>
      </TableRow>
      }

</TableBody>
    </Table>
  </TableContainer>
  </Box>
  )

},[arr,id,student,open])
const boot=React.useMemo(()=>{
  console.log('bootstarp dialog called')
  return(
    
    <BootstrapDialog
    onClose={handleClose}
    aria-labelledby="customized-dialog-title"
    open={count!==null && view}
  >
    <Box sx={{ width: "500px" }}>
      <Grid container>
        <Grid>
          <DialogTitle id="customized-dialog-title">
            Total Batch Students:{count1}
          </DialogTitle>
        </Grid>

        <Grid xs={5}></Grid>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 20,
          
        }}
      >
        <DialogContent>
          <TableContainer>
            <Table sx={{ width: 300 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    Student Name
                  </TableCell>
                  <TableCell align="center">Issue Date</TableCell>
                  <TableCell align="center">
                    Certificate
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {student &&
                  student.map((val) => (
                    <TableRow
                      key={val.name}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell align="center">
                        <Box>{val.FullName}</Box>
                      </TableCell>

                      <TableCell align="center">
                        <Box>{val.Date.split('T')[0]}</Box>
                      </TableCell>
                      <TableCell align="center">
                        <Box>{val.Cetificate}</Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Box>
    </Box>
  </BootstrapDialog>
  )

},[view])
const dialog=React.useMemo(()=>{
  console.log('select stduent dialog called')
  return(
    <Dialog open={open} onClose={handleClose2}>
    <DialogContent>
      <Box sx={{ minWidth: 120, mb: 2 }}>
        <FormControl variant="filled" fullWidth>
          <InputLabel id="demo-simple-select-label">
            Select Student Name
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Course"
            onChange={(e) => {
              handlechange(e, "Studentid");
            }}
          >
            {student &&
              student.map((val) => (
                <MenuItem value={val._id} key={val._id}>
                  <Box>{val.FullName}</Box>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: 300, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">
            Certificate
          </InputLabel>
          <Select
            variant="filled"
            onChange={(e) => {
              handlechange(e, "Cetificate");
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
          >
            <MenuItem value={"Yes"}>Yes</MenuItem>
            <MenuItem value={"no"}>No</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mb: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              slotProps={{ textField: { variant: "filled" } }}
              label="Choose Your Date"
              onChange={handleDateChange}
              sx={{ width: 300 }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Box>

      <Grid
        container
        spacing={2}
        justifyContent="right"
        sx={{ mt: 0.5 }}
      >
        <Button
          onClick={() => {
            handleClose2();
            setData({});
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            console.log(data);
            axios
              .post(
                `http://localhost:5000/ISC/UpdateISC?UpdateId=${id}`,
                data,jwttoken()
              )
              .then((res) => {
                console.log(res);
                doupdate(!update);
                setData({})
                setid('')
                handleClose2();
                handleClick1({ vertical: "top", horizontal: "center" });
                setAlertSuccess({
                  open: true,
                  message: "Updated Successfully",
              
                });
             
              })
              .catch((err) => {
                console.log(err);
                if(err.response.data){
                handleClick1({ vertical: "top", horizontal: "center" });

                setAlertMsg({
                  open: true,
                  message: err.response.data.error.details[0].message,
                });
              }
              });
            
            
          }}
        >
          Submit
        </Button>
      </Grid>
    </DialogContent>
  </Dialog>
  )
 

},[open,data,student])
  return (
    <>
    {pagination}
{snack}
{table}
    {boot}
      {dialog}
              
    </>
  );
}
