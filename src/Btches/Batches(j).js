import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import jwttoken from '../Token'

import { Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, FilledInput, TableBody } from '@mui/material';
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";

import EditIcon from '@mui/icons-material/Edit';
import Tooltip from "@mui/material/Tooltip";

import { Grid,Paper } from "@mui/material";



import axios from "axios";

import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import { Snackbar, Alert } from '@mui/material';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function Batches() {
  const [parent, setParent] = React.useState({});
  const [data, setData] = React.useState({ StuName: [] });
  const [id, setId] = React.useState("");
  
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
  const [update, doupdate] = React.useState(false);
  const [open, setopen] = React.useState(false);
  const [arr, setarr] = React.useState([]);
  const [map, maparr] = React.useState([]);
  const [arr1, seteventarr] = React.useState([]);
  
  console.log(arr)
  console.log(map)
  console.log(arr1)
  const [alertSuccess, setAlertSuccess] = React.useState({
    open: false,
    message: "",
    
  });
  const [alertMsg, setAlertMsg] = React.useState({ open: false, message: "" });
  
const [state, setState] = React.useState({
  open1: false,
  vertical: "top",
  horizontal: "center",
});
const { vertical, horizontal, open1 } = state;

const handleClick1 = (newState) => {
  setState({ ...state, open1: true });
};
console.log(state);
const handleClose1 = () => {
  setState({ ...state, open1: false });
  setAlertSuccess({ ...alertSuccess, open: false });
  setAlertMsg({ ...alertMsg, open: false });
  
};

  React.useEffect(() => {
    
    axios
      .get("http://localhost:5000/event/Displayevent",jwttoken())
      .then((data) => {
        seteventarr(data.data.data);
        console.log(data)
      })
      .catch((err) => {
        console.log(err);
      });
      
      if (parent._id) {
        axios
          .get(`http://localhost:5000/Batch/Display?id=${parent._id}`,jwttoken())
          .then((data) => {
            console.log(data.data.data);
            
            maparr(data.data.data);
          })
          .catch((err) => {
            console.log(err);
          });
    if (parent._id) {
      axios
        .get(`http://localhost:5000/Eventinquiry/getisAdded?id=${parent._id}`,jwttoken()
        )

        .then((data) => {
          console.log(data);
console.log('thid api')

          setarr(data.data.data);

          console.log("confirm batches is set",data.data.data);
        })
        .catch((err) => {
          console.log(err);
        
        });
    }

    }
  }, [parent._id, update]);

  const handleOpen = () => {
    // Check if id is present (editing mode)
    if (id) {
      // Clear the selected values by setting data.StuName to an empty array
      setData((prevData) => ({
        ...prevData,
        StuName: [],
      }));
    }
    setId("")

    setData({ StuName: [] })
    setopen(false);
    doupdate(!update);

  };

  const handleparent = (e) => {
    setParent({ ...e.target.value });
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const handleChange = (event) => {
    const { target: { value } } = event;
    const newStuNames = value.map((item, index) => {
      const [FullName, Contact, _id] = item.split("-");


      return { FullName, Contact, _id };
    });
    let s = newStuNames.length - 1





    console.log("ah", newStuNames)
    setData((prevData) => ({
      ...prevData,
      StuName: newStuNames,
    }));
  };

  // console.log(data.StuName)

  const renderSelectedValue = (selected) => {

    if (selected.length === 0) {
      return <em>Placeholder</em>;
    } else if (selected.length > 0) {
      const selectedNames = selected.map((val) =>
        val.split("-").slice(0, 2).join("-")
      );
      return selectedNames.join(", ")
    }
  };
const snack=React.useMemo(()=>{
  console.log('snack bar called')
return(
  <Snackbar
        open={open1}
        autoHideDuration={3000}
        onClose={handleClose1}
        anchorOrigin={{ vertical, horizontal }}
        
      >
          {(alertSuccess.open || alertMsg.open) && (
    <Alert
      onClose={handleClose1}
      severity={alertSuccess.open ? "success" : "error"}
                // alertSuccess.open? "success": alertMsg.open? "error": alertInfo.open? "info": "info"\

      variant="filled"
      sx={{ width: "100%" }}
    >
      {alertSuccess.open ? alertSuccess.message : alertMsg.message}
    </Alert>
  )}
      </Snackbar>
)
},[open1])
const addicons=React.useMemo(()=>{
  console.log('studnet select called')
return(
  <Dialog open={open}>
  <DialogContent>

    <Grid container spacing={2} justifyContent="left">
      <Grid item xs={4}>
        <Box>
          <FormControl sx={{ width: 300, mt: 3 }}>
            <InputLabel id="demo-multiple-checkbox-label">
              Select Students
            </InputLabel>

            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={data.StuName && data.StuName.map(
                (item) => `${item.FullName}-${item.Contact}-${item._id}`
              )}
              onChange={handleChange}
            
              sx={{ width: 300 }}
              fullWidth
              input={<FilledInput/>}
              renderValue={renderSelectedValue}
              MenuProps={MenuProps}
            >
              {arr.map((name) => (
                <MenuItem
                  key={name._id}
                  value={`${name.FullName}-${name.Contact}-${name._id}`}
                >
                  <Checkbox
                    checked={
                      data.StuName && data.StuName.findIndex(
                        (item) =>
                          item.Contact == name.Contact &&
                          item.FullName == name.FullName &&
                          item._id == name._id
                      ) > -1
                    }
                   
                  />
                  <ListItemText
                    primary={`${name.FullName}  ${name.Contact}`}
                  />
                </MenuItem>
              ))}
            </Select>

          </FormControl>
        </Box>
      </Grid>
    </Grid>

    <DialogActions>
      <Button
        onClick={() => {
          handleOpen();
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={() => {
          if (id) {
            axios
              .post(`http://localhost:5000/Batch/Update?id=${id}`, {...data,EventId:parent._id},jwttoken())
              .then((data) => {
                console.log(arr);
                setId("");
                setData({ StuName: [] });
                console.log(data.StuName)
                setopen(false);
                doupdate(!update);
                handleClick1({ vertical: "top", horizontal: "center" });
    
                setAlertSuccess({
                  open: true,
                  message: "Student Updated Successfully",
          
                });
          
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
              .post("http://localhost:5000/Batch/addbatch", {
                ...data,
                EventId: parent._id,
              },jwttoken())
              .then((data1) => {

                console.log(arr);

                setopen(false);
                setId("");
                setData({ StuName: [] })
                doupdate(!update);
                handleClick1({ vertical: "top", horizontal: "center" });
    
                setAlertSuccess({
                  open: true,
                  message: "Student Added Successfully",
           
                });
            

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
        }}
      >
        Submit
      </Button>
    </DialogActions>
  </DialogContent>
</Dialog>
)
},[open,data,id])
const table=React.useMemo(()=>{
console.log('tabel called')
return(
  <Box>
  <Box sx={{ mt: 4,mx:2 }}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center"
            sx={{ position: "sticky", left: 0, backgroundColor: "white", zIndex: 1,
            }}
            
            >Student Name</TableCell>
            <TableCell align="center">Contact</TableCell>
            <TableCell align="center">Event Batch</TableCell>
            
            <TableCell align="center">Days</TableCell>
            <TableCell align="center">Start Date</TableCell>
            <TableCell align="center">End Date</TableCell>
            
            <TableCell align="center">Batch Time</TableCell>

            <TableCell align="center">
          Actions
        </TableCell>
        
          </TableRow>
        </TableHead>
<TableBody sx={{height:map && map.length<1?220:0}}>
        {map && map.length>0?
          map.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" sx={{ position: "sticky", left: 0, backgroundColor: "white", zIndex: 1,
                              }}
            >
                {row.StuName.map((data, index) => (
               <Box>
              {data.FullName}
                    </Box>
                ))}
              </TableCell>

              <TableCell align="center">
                {row.StuName.map((data) => (
            <Box>
                    {data.Contact}
                    </Box>
                ))}
              </TableCell>
              <TableCell align="center">
              <Box>
                  
                    {row.EventId.eventName}
                  </Box>
              </TableCell>
              
              <TableCell align="center">
                {row.EventId.Days &&
                  row.EventId.Days.map((data) => (
                    <Box>
                      {data}
                      </Box>
                  ))}
              </TableCell>

              <TableCell align="center">
              <Box>
                    {row.EventId.StartDate.split("T")[0]}
                  
                  </Box>
              </TableCell>
              <TableCell align="center">
              <Box>
                    {row.EventId.EndtDate.split("T")[0]}
                  
                  </Box>
              </TableCell>
              
              <TableCell align="center">
              <Box>
                    {row.EventId.BatchTime && convertToIST(row.EventId.BatchTime)}
                  
                  </Box>
              </TableCell>

              <TableCell align="center">
              <Tooltip title="Edit" arrow>
                
                <Button
             
                  onClick={() => {
                    console.log("row")

                    setData({ ...row });
                    setId(row._id);
                    console.log("rwow", arr)
                    // setData({...row,StuName:[...data.StuName]})
                    // console.log(...data.StuName,...arr)
                    console.log("wdfd", row, "arr", ...arr)
                    setarr([...row.StuName, ...arr])

                    setopen(true);
                  }}
                >
                  <EditIcon />
                </Button>
                </Tooltip>
              </TableCell>
              

            
          
            </TableRow>
          ))
          
          :
          <TableRow>

          <TableCell align="center" colSpan={7}> No Data Available!</TableCell>
        </TableRow>
          }
</TableBody>
      </Table>
    </TableContainer>
  </Box>

 
</Box>

)
},[map])
const selectcourse=React.useMemo(()=>{
  console.log('course select called')
return(
  <Grid container spacing={2}>
  <Grid item  xs={2} sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
  <Box sx={{mt:1}}>
 <Tooltip title="Add Batches" arrow>
         <Button
      disabled={!parent._id || map.length>=1?true:false}
           onClick={() => {
             setarr([...arr])
             console.log(arr)

             setopen(true);
             setData({ StuName: [] })
             setId("");
           }}
         >
   <AddIcon/>
         </Button>
         </Tooltip>
         </Box>
      </Grid>
    <Grid xs={5}></Grid>
  <Grid item xs={5}>
      
  <Box sx={{ mr: 3 }}>
       <FormControl fullWidth>
         <InputLabel id="demo-simple-select-label"
          sx={{
            top: "-6px", // Adjust label position slightly upwards
            backgroundColor: "white", // Background to avoid overlap with border

            "&.Mui-focused": {
              top: "0px", // Position when focused
            },
          }}
         >
           {" "}
           Select Event Type
         </InputLabel>
         <Select
           onChange={(e) => {
             handleparent(e);
           }}
           labelId="demo-simple-select-label"
           id="demo-simple-select"
           label="Status"
           renderValue={(data)=>{return(parent._id && data.eventName || '')}}
           sx={{
             height:50,
             borderRadius: "16px",
             '& .MuiOutlinedInput-root': {
               '& fieldset': {
                 border: '2px solid #0063cc', // Default border color
               },
               '&:hover fieldset': {
                 border: '2px solid #0063cc', // Border color on hover
               },
               '&.Mui-focused fieldset': {
                 border: '2px solid #0063cc', // Border color when focused
               },
             },
           }}
         >
           {arr1 &&
             arr1.map((row) => (
               <MenuItem value={row}>
                 <TableRow
                   key={row.name}
                   sx={{
                     "&:last-child td, &:last-child th": { border: 0 },
                   }}
                 >
                   <Typography align="center">{row.eventName}</Typography>

                 </TableRow>
               </MenuItem>
             ))}
         </Select>
       </FormControl>
     </Box>
</Grid>




</Grid>
)
},[open,parent,arr1,arr,map])

  return (
    <>
{snack}  
{addicons}
{selectcourse}
   
    {table}
    
      
    </>
  );
}

export default Batches;
