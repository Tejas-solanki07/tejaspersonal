import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import AddIcon from "@mui/icons-material/Add";
import jwttoken from '../Token'
import { Snackbar, Alert } from '@mui/material';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FilledInput,
  TableBody,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Paper from "@mui/material/Paper";
import { Grid } from "@mui/material";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import FormLabel from "@mui/material/FormLabel";
import { styled } from "@mui/system";

import Pagination from "@mui/material/Pagination";

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

function Interform() {
  const [open, setopen] = React.useState(false);
  const [data, setdata] = React.useState({
    StartDate: dayjs(''),
    EndtDate: dayjs(''),
    Days: [],
  });

  const [arr, setarr] = React.useState([]);
  const [id, setid] = React.useState();
  const [update, doUpdate] = React.useState(false);
  
  const [open2, setOpen2] = React.useState(false);
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const menuprops = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };


  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleChange = (e, type) => {
    if (type == "TypeOfPayment" && e.target.value == "Free") {
      setdata({ ...data, [type]: e.target.value, Amount: 0 });
    } else {
      setdata({ ...data, [type]: e.target.value });
    }
  };
  const handleClose = () => {
    setopen(false);
    setdata({});
    setid("");
  };

  const [alertMsg, setAlertMsg] = React.useState({ open: false, message: "" });
  const [alertbatchMsg, setalertbatchMsg] = React.useState({
    open: false,
    message: "",
    
  });

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
  const handleClose1 = () => {
    setState({ ...state, op: false });
    setAlertSuccess({ ...alertSuccess, open: false });
    setAlertMsg({ ...alertMsg, open: false });
    setalertbatchMsg({...alertbatchMsg,open:false})
  };
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
  
  const handlesubmit = (e) => {
    if (id) {
      axios
        .post(`http://localhost:5000/event/Updateevent?id=${id}`, data,jwttoken())
        .then((data) => {
          handleClose();

          doUpdate(!update);
          handleClick1({ vertical: "top", horizontal: "center" });
          
          setAlertSuccess({
            open: true,
            message: " Event Updated Successfully",
            
          });
    

          console.log("data is updated", data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            handleClick1({ vertical: "top", horizontal: "center" });
          
            setAlertMsg({
              open: true,
              message: err.response.data.error.details[0].message,
            });
          
          }
        });
    } else {
      
      axios
        .post(`http://localhost:5000/event/addevent`, data,jwttoken())
        .then((data) => {
          doUpdate(!update);
          handleClick1({ vertical: "top", horizontal: "center" });
          
          setAlertSuccess({
            open: true,
            message: "Event Added Successfully",
            
          });
          
          handleClose();
          
          console.log("data posted", data);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            handleClick1({ vertical: "top", horizontal: "center" });
          
            setAlertMsg({
              open: true,
              message: err.response.data.error.details[0].message,
            });
            
            
          }
        });
    }
  };
  const [page, setpage] = React.useState(1);
  console.log(page);

  
  const [totalpages, settotalpages] = React.useState("");

  const DaysArr = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleChange1 = (event) => {
    const {
      target: { value },
    } = event;
    let val = typeof value === "string" ? value.split(",") : value;
    setdata({ ...data, Days: val });
  };

  React.useEffect(() => {
    axios
      .get(`http://localhost:5000/event/Displayevent?page=${page}&limit=${10}`,jwttoken())
      .then((data) => {
        console.log(data)
        setarr(data.data.data);
        settotalpages(data.data.totalPages)
        console.log("arr is set ");
      })
      .catch((err) => {
        console.log(err);
        console.log(data);
      });
  }, [update,page]);

  dayjs.extend(utc);
  const handleDateChange = (val, type) => {
    const selectedDate = new Date(val);
    const timezoneOffset = 5.5 * 60; // 5.5 hours in minutes
    const adjustedDate = new Date(
      selectedDate.getTime() + timezoneOffset * 60 * 1000
    );
    const formattedDate = adjustedDate.toISOString();

    setdata({ ...data, [type]: formattedDate });
  };
const snack=React.useMemo(()=>{
  console.log('snakc bar called')
return(
  <Snackbar
        open={op}
        autoHideDuration={3000}
        onClose={handleClose1}
        anchorOrigin={{ vertical, horizontal }}
        
      >
          {(alertSuccess.open || alertMsg.open || alertbatchMsg.open) && (
    <Alert
      onClose={handleClose1}
      severity={alertSuccess.open ? "success" : alertMsg.open?"error": alertbatchMsg.open?'error':null}
                

      variant="filled"
      sx={{ width: "100%" }}
    >
      {alertSuccess.open ? alertSuccess.message : alertMsg.open?alertMsg.message:alertbatchMsg.open?alertbatchMsg.message:null}
    </Alert>
  )}
      </Snackbar>
)
},[op])

const add=React.useMemo(()=>{
  console.log('addicon allecd')
  return(
<Grid container spacing={2} sx={{mb:2}}>
<Grid  xs={5}>
          <Tooltip title="Add Events">
            <Button sx={{mt:1,ml:1}}
              onClick={() => {
                setopen(true);
              }}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Grid>
        <Grid xs={7} sx={{display:'flex',justifyContent:'flex-start'}}>
           <Box>
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

      </Grid>
  )
},[open,totalpages,page])
const dialog1=React.useMemo(()=>{
  console.log('dialog clalled')
  return(
  <Dialog open={open}>
  <DialogContent>
    <Box sx={{ minWidth: 120, mb: 2 }}>

      <FormControl variant="filled" fullWidth>
        <InputLabel id="demo-simple-select-label">Course</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Course"
          value={data.Course}
          onChange={(e) => {
            handleChange(e, "Course");
          }}
        >
          <MenuItem value={"React"}>React</MenuItem>
          <MenuItem value={"Node"}>Node</MenuItem>
          <MenuItem value={"AWS"}>AWS</MenuItem>
          <MenuItem value={"C"}>C</MenuItem>
          <MenuItem value={"C++"}>C++</MenuItem>
          <MenuItem value={"Python"}>Python</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ minWidth: 120, mb: 2 }}>
      <FormControl variant="filled" fullWidth>
        <InputLabel id="demo-simple-select-label">
          Type Of Event
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Type Of Event"
          value={data.TypeOfEvent}
          onChange={(e) => {
            handleChange(e, "TypeOfEvent");
          }}
        >
          <MenuItem value={"Internship"}>Internship</MenuItem>
          <MenuItem value={"Workshop"}>Workshop</MenuItem>
          
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ my: 2 }}>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
          Type Of Payment
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          onChange={(e) => {
            handleChange(e, "TypeOfPayment");
          }}
          defaultValue={data.TypeOfPayment}
        >
          <FormControlLabel
            value="Free"
            control={<Radio />}
            label="Free"
          />
          <br />
          <FormControlLabel
            value="Paid"
            control={<Radio />}
            label="Paid"
          />
        </RadioGroup>
      </FormControl>
    </Box>
    {data.TypeOfPayment == "Paid" ? (
      <TextField
        id="outlined-basic"
        type="number"
        label="Amount"
        variant="filled"
        value={data.Amount}
        onChange={(e) => {
          handleChange(e, "Amount");
        }}
        fullWidth
        sx={{ mb: 2 }}
      />
    ) : null}

    <Box sx={{ mb: 1 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="Start Date"
            slotProps={{ textField: { variant: "filled" } }}
            defaultValue={id ? dayjs(data.StartDate) : null}
            sx={{ width: 500 }}
            onChange={(val) => {
              handleDateChange(val, "StartDate");
            }}
          ></DatePicker>
        </DemoContainer>
      </LocalizationProvider>
    </Box>
    <Box sx={{ mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            label="End Date"
            slotProps={{ textField: { variant: "filled" } }}
            defaultValue={id ? dayjs(data.EndtDate) : null}
            sx={{ width: 500 }}
            onChange={(val) => {
              handleDateChange(val, "EndtDate");
            }}
          ></DatePicker>
        </DemoContainer>
      </LocalizationProvider>
    </Box>
    <Box sx={{ minWidth: 120, mb: 1 }} fullWidth>
      <FormControl variant="filled" fullWidth>
        <InputLabel id="demo-multiple-checkbox-label"> Days</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={data.Days || []}
          onChange={handleChange1}
          fullWidth
          input={<FilledInput />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={menuprops}
        >
          {DaysArr.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox
                checked={data.Days && data.Days.indexOf(name) > -1}
              />

              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
    <Box sx={{ mt: 1 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
        <DemoContainer components={["TimePicker"]} fullWidth>
          <TimePicker
            label="Batch Timings"
            slotProps={{ textField: { variant: "filled" } }}
            sx={{ width: 500 }}
            defaultValue={id ? dayjs(data.BatchTime) : null}
            fullWidth
            onChange={(val) => {
              setdata({ ...data, BatchTime: val });
            }}
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>
    <TextField
        id="outlined-basic"
        type="text"
   
        label="Event Name"
        variant="filled"
        value={data.eventName}
        onChange={(e) => {
          handleChange(e, "eventName");
        }}
        fullWidth
        sx={{ mb: 2,mt:2 }}
      />


    <DialogActions>
      <Button
        onClick={() => {
          handleClose();
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={(event) => {
          event.stopPropagation();

          handlesubmit(event);
        }}
      >
        Submit
      </Button>
    </DialogActions>
  </DialogContent>
</Dialog>)
},[open,data,id])
const table=React.useMemo(()=>{
  console.log('tablec called')
  return(
<Box sx={{ mx: 2 }}>
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
                <TableCell align="center">Type Of Event</TableCell>
                <TableCell align="center">Event Name</TableCell>
                
                <TableCell align="center">Type Of Payment</TableCell>

                <TableCell align="center">Amount</TableCell>

                <TableCell align="center">Start Date</TableCell>
                <TableCell align="center">End Date</TableCell>

                <TableCell align="center">Days</TableCell>
                <TableCell align="center">Batch Time</TableCell>

                <TableCell align="center" colSpan={2}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ height: arr && arr.length < 1 ? 300 : 0 }}>
              {arr && arr.length>0?
                arr.map((row) => (
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
                      {row.Course}
                    </TableCell>
                    <TableCell align="center">{row.TypeOfEvent}</TableCell>
                    <TableCell align="center">{row.eventName}</TableCell>
                    
                    <TableCell align="center">{row.TypeOfPayment}</TableCell>

                    <TableCell align="center">{row.Amount}</TableCell>

                    <TableCell align="center">
                      {row.StartDate && row.StartDate.split("T")[0]}
                    </TableCell>
                    <TableCell align="center">
                      {row.EndtDate && row.EndtDate.split("T")[0]}
                    </TableCell>
                    <TableCell align="center">
                      {row.Days.map((val) => (
                        <Box>{val}</Box>
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      {row.BatchTime && convertToIST(row.BatchTime)}
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Edit" arrow>
                        <Button
                          onClick={() => {
                            setopen(true);
                            setdata(row);
                            setid(row._id);
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>

          
                    <TableCell>
                      <Tooltip title="Complete" arrow>
                        <Button
                          onClick={() => {
                            setid(row._id);
                            handleClickOpen2();
                          }}
                          color="success"
                        >
                          <DoneAllIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>


                ))
              :

              <TableRow>
                <TableCell align="center" colSpan={11}>No Data Available</TableCell>
              </TableRow>
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>)
},[arr,page])
const completdialo=React.useMemo(()=>{
  console.log('compokledialog claled')
return(
    
  <Dialog
  open={open2}
  onClose={handleClose2}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">{"Complete Event"}</DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Do You Want To Complete Event?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose2}>Cancel</Button>
    <Button
      onClick={() => {
        axios
          .post(`http://localhost:5000/event/Completed/?id=${id}`,{},jwttoken())
          .then((data) => {
            console.log("event completed", data);
            doUpdate(!update);
            handleClick1({ vertical: "top", horizontal: "center" });
            setAlertSuccess({
              open: true,
              message: " Event Completed Successfully",
              
            });
   
            handleClose2();
        
          })
          .catch((err) => {
            console.log(err);
            if (err.response.data) {
              handleClick1({ vertical: "top", horizontal: "center" });
    
              setalertbatchMsg({
                open: true,
                message: err.response.data.error.details[0],
             
              });
           
            }
          });
        
      }}
    >
      Confirm
    </Button>
  </DialogActions>
</Dialog>
)
},[open2])
  return (
    <React.Fragment>
      {snack}
      {add}
 {dialog1}
      
      {table}
      
  {completdialo}
    </React.Fragment>
  );
}
export default Interform;
