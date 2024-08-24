import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";


import AddIcon from "@mui/icons-material/Add";

import Tooltip from "@mui/material/Tooltip";

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
  Paper,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { Grid } from "@mui/material";

import { Snackbar, Alert } from '@mui/material';

import axios from "axios";

import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import jwttoken from '../Token'

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
  const [id, setId] = React.useState();

  function convertToIST(utcDateStr) {
    const date = new Date(utcDateStr);

    const options = {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 24-hour format
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  const [update, setUpdate] = React.useState(false);
  const [open, setopen] = React.useState(false);
  const [arr, setarr] = React.useState([]);
  const [map, maparr] = React.useState([]);
  const [add, setAdd] = React.useState("Nothing");
  const [adds, setAdds] = React.useState("No");
  const [course, setcoursearr] = React.useState([]);
  
  const [alertSuccess, setAlertSuccess] = React.useState({
    open: false,
    message: "",
    
  });
  const [alertMsg, setAlertMsg] = React.useState({ open: false, message: "" });
  
  React.useEffect(() => {
    axios
      .get("http://localhost:5000/batchEvent/DisplayBevent",jwttoken())
      .then((data) => {
        setcoursearr(data.data.data);

        console.log("arr is set ", arr);
      })
      .catch((err) => {
        console.log(err);
      });

    if (parent.Course) {
      console.log("called  fd");
      console.log(parent);
      axios
        .get(`http://localhost:5000/inquiry/getisAdded?Course=${parent.Course}`,jwttoken())
        .then((data) => {
          setarr(data.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (parent._id) {
      axios
        .get(`http://localhost:5000/regBatch/Display?id=${parent._id}`,jwttoken())
        .then((data) => {
          console.log(data);
          
          maparr(data.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [parent, update, add, adds]);

  const handleOpen = () => {
    // Check if id is present (editing mode)
    if (id) {
      // Clear the selected values by setting data.StuName to an empty array
      setData((prevData) => ({
        ...prevData,
        StuName: [],
      }));
    }
    setAdd("Yes--");
    setId("");

    setData({ StuName: [] });
    setAdds("Yes-No");
    setopen(false);
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
    const {
      target: { value },
    } = event;
    const newStuNames = value.map((item, index) => {
      const [FullName, Contact, _id] = item.split("-");

      return { FullName, Contact, _id };
    });
    let s = newStuNames.length - 1;

    console.log("ah", newStuNames);
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
      return selectedNames.join(", ");
    }
  };
console.log(course)

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
const snack=React.useMemo(()=>{
  console.log('snackbar called')
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
console.log('map :',map.length)
const addbutton=React.useMemo(()=>{
  console.log('select course called')
return(
  <Grid container spacing={2}>
  <Grid item xs={2} sx={{display:'flex',justifyContent:'flex-start',alignItems:'flex-start'}}>
    <Box sx={{mt:1}}>
      <Tooltip title="Add Batches" arrow>
      <Button
      sx={{ml:2}}
       disabled={!parent._id || map.length>=1?true:false}

        onClick={() => {
          setarr([...arr]);
          console.log(arr); 

          setopen(true);
          setData({ StuName: [] });
          setId("");
        }}
      >
     <AddIcon/>
      </Button>
      </Tooltip>
      </Box>
    </Grid>
    <Grid xs={5}></Grid>
    <Grid xs={5}>
      <Box sx={{ mt: 2,mr:2}}>
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
            Select Course
          </InputLabel>
          <Select
            onChange={(e) => {
              setUpdate(!update)
              setAdds("noes")
              setAdd("trues data")
              handleparent(e);
            }}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status"
            renderValue={(data)=>{return (parent._id && data.batchName || '')}}
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
            {course &&
              course.map((row) => (
                <MenuItem  key={row.name} value={row}>
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <Typography align="center">{row.batchName}</Typography>



                    
                  </TableRow>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>

    </Grid>
   
</Grid>
)
},[open,parent,course,arr,map])

const dialogstudents=React.useMemo(()=>{
  console.log('student dialog ckllled')
return(
  <Dialog open={open}>
  <DialogContent>
  
    <Box>
      <FormControl sx={{width: 300, mt: 3 }}>
        <InputLabel id="demo-multiple-checkbox-label">
          Select Students
        </InputLabel>

        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          sx={{ width: 300 }}
          multiple
          value={
            data.StuName &&
            data.StuName.map(
              (item) => `${item.FullName}-${item.Contact}-${item._id}`
            )
          }
          onChange={handleChange}
          input={<FilledInput />}
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
                  data.StuName &&
                  data.StuName.findIndex(
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
              .post(
                `http://localhost:5000/regBatch/Update?id=${id}&course=${parent.Course}`,
                {
                  ...data,
                  EventId: parent._id,
                },jwttoken()
              )
              .then((data) => {
                console.log(arr);
                setId("");
                setData({ StuName: [] });
                console.log(data.StuName);
                setAdd("setOpen");
                setopen(false);
                setUpdate(!update);
                setAdds("Something22");
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
                  setTimeout(() => {
                    setAlertMsg("");
                  }, 3000);
                }
              });
          } else {
            axios
              .post(
                `http://localhost:5000/regBatch/addbatch?course=${parent.Course}`,
                {
                  ...data,
                  EventId: parent._id,
                },jwttoken()
              )
              .then((data1) => {
                console.log(arr);

                setopen(false);
                setId("");
                setData({ StuName: [] });
                setAdds("Setted");
                setUpdate(!update);
                setAdd("Something12");
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
  console.log('table called')
return(
  <Box>
  <Box sx={{ mt: 5,mx:2 }}>
<TableContainer component={Paper}>
<Table sx={{ minWidth: 650 }} aria-label="simple table">
<TableHead>
  <TableRow>
    <TableCell align="center"
     sx={{
      position: "sticky",
      left: 0,
      backgroundColor: "white",
      zIndex: 1,
    }}

    >Student Name</TableCell>
    <TableCell align="center">Contact</TableCell>
    <TableCell align="center">Batch Name</TableCell>
    
    <TableCell align="center">Days</TableCell>
    <TableCell align="center">Date</TableCell>
    <TableCell align="center">Batch Time</TableCell>
    <TableCell align="center">Actions</TableCell>

    
  </TableRow>

  
</TableHead>
<TableBody sx={{height:map && map.length<1?300:0}}>              
{map && map.length>0?
  map.map((row) => (
    <TableRow
      key={row.name}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="center"
       sx={{
        position: "sticky",
        left: 0,
        backgroundColor: "white",
        zIndex: 1,
      }}
      
      >
        {row.StuName.map((data, index) => (
            <Box>{data.FullName}</Box>
          
        ))}
      </TableCell>

      <TableCell align="center">
        {row.StuName.map((data) => (
            <Box>{data.Contact}</Box>
        ))}
      </TableCell>

      <TableCell align="center">
        
        <Box>
          {row.EventId.batchName && row.EventId.batchName}
        </Box>
    
    </TableCell>
    
      <TableCell align="center">
        {row.EventId.Days &&
          row.EventId.Days.map((data) => (
            <Box>{data}</Box>
            
          ))}
      </TableCell>
      
      <TableCell align="center">
        
          <Box>
            {row.EventId.StartDate && row.EventId.StartDate.split("T")[0]}
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
            console.log("row");

            setData({ ...row });
            setId(row._id);
            console.log("rwow", arr);
            // setData({...row,StuName:[...data.StuName]})

            
            // console.log(...data.StuName,...arr)
            console.log("wdfd", row, "arr", ...arr);
            setarr([...row.StuName, ...arr]);

            setopen(true);
            
            
          }}
        >
          <EditIcon/>
        </Button>
        </Tooltip>
      </TableCell>

    </TableRow>
  ))
:
<TableRow>
<TableCell align="center" colSpan={6}>No Data Available!</TableCell>
</TableRow> 
}
  </TableBody>

</Table>
</TableContainer>
</Box>
</Box>
)
},[map])
  return (
    <>
{snack}
{addbutton}
   
      {dialogstudents}
     {table}
      
    </>
  );
}

export default Batches;



