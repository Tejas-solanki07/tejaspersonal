import * as React from "react";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Img from "./Tnlogo.png";
import dayjs from "dayjs";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import autoTable from "jspdf-autotable";
import SearchIcon from "@mui/icons-material/Search";
import jwttoken from "../Token";
import Pagination from '@mui/material/Pagination';

import { Snackbar, Alert, Typography } from "@mui/material";

import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import utc from "dayjs/plugin/utc";
import Menu from "@mui/material/Menu";

import Paper from "@mui/material/Paper";
import { jsPDF } from "jspdf";
import { Grid } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";

import FilledInput from "@mui/material/FilledInput";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { styled } from "@mui/system";

import SortIcon from "@mui/icons-material/Sort";

export default function FormDialog() {
  const [coursearr, setcoursearr] = React.useState([]);
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
  const [totalpages, settotalpages] = React.useState(1);
  const [arr, setArr] = React.useState([]);
  const [update, doUpdate] = React.useState(false);
  const [page, setpage] = React.useState(1);
  console.log(page);

  const [stuarr, setstuarr] = React.useState([]);
  const [parent, setParent] = React.useState({});
  const handleparent = (e) => {
    setParent({ ...e.target.value });
    setS("hahahh");
  };

  const [s, setS] = React.useState("kalpshha");

  React.useEffect(() => {
    axios
      .get("http://localhost:5000/batchEvent/allcourse", jwttoken())
      .then((data) => {
        setcoursearr(data.data.data);

      })
      .catch((err) => {
        console.log(err);
      });
    
    if (!parent._id) {
      axios
        .get(`http://localhost:5000/invoice/Display?page=${page}&limit=${10}`, jwttoken())
        .then((data) => {
          console.log(data)
          setArr(data.data.data);
          settotalpages(data.data.totalPages)
          console.log("Updated totalpages:", data.data.totalPages);
        })
        .catch((err) => {
          console.log("error ", err);
        });
    } else {
      axios
        .get(
          `http://localhost:5000/invoice/courseIn?parentId=${parent._id}&page=${page}&limit=${10}`,
          jwttoken()
        )
        .then((data) => {
          console.log(data)
          setArr(data.data.data);
          settotalpages(data.data.totalPages)
        })
        .catch((err) => {
          console.log("error ", err);
        });
    }
    if (parent._id) {
      axios
        .get(
          `http://localhost:5000/student/InvoiceGet?id=${parent._id}`,
          jwttoken()
        )
        .then((data) => {
          setstuarr(data.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [page,update, parent, s]);

  React.useEffect(() => {}, []);

  const [open, setOpen] = React.useState(false);
  const newdate = () => {
    const selectedDate = new Date();

    selectedDate.setHours(12,0,0,0)
    const formattedDate = selectedDate.toISOString();


    return formattedDate;
  }
  
  const [data, setData] = React.useState({ invoiceDate:newdate() });
  const [id, setId] = React.useState();

  const handleChange = (e, type) => {
    setData({ ...data, [type]: e.target.value });
  };
  
  const handleClose = () => {
    setData({invoiceDate:data.invoiceDate});
          
    setId();
    setOpen(false);
  };

  const handleopenclose = () => {
    setOpen(!open);
  };
  const [alertMsg, setAlertMsg] = React.useState({ open: false, message: "" });

  const [alertSuccess, setAlertSuccess] = React.useState({
    open: false,
    message: "",
  });

  const [state, setState] = React.useState({
    open1: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, open1 } = state;

  const handleClick1 = (newState) => {
    setState({ ...state, open1: true });
  };
  
  const handleClose1 = () => {
    setState({ ...state, open1: false });
    setAlertSuccess({ ...alertSuccess, open: false });
    setAlertMsg({ ...alertMsg, open: false });
  };

  const AddorUpdate = (message) => {
    if (id) {

      axios
        .post(`http://localhost:5000/invoice/Update?id=${id}`, data, jwttoken())
        .then((data) => {
          doUpdate(!update);
          handleClick1({ vertical: "top", horizontal: "center" });
          setAlertSuccess({
            open: true,
            message: "Invoice Updated Successfully",
          });
          setData({invoiceDate:newdate()});

          setId();
          setOpen(false);
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
        .post(
          "http://localhost:5000/invoice/addinfo",
          {
            ...data,
            courseId: parent._id,
          },
          jwttoken()
        )
        .then((data) => {
          doUpdate(!update);
          handleClick1({ vertical: "top", horizontal: "center" });
          setAlertSuccess({
            open: true,
            message: " Invoice Added Successfully",
          });

          setData({invoiceDate:newdate()});
          

          setId();
          setOpen(false);
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


  dayjs.extend(utc);
  const handleDateChange = (val) => {
    const selectedDate = new Date(val);
    selectedDate.setHours(12,0,0,0)
    const formattedDate = selectedDate.toISOString();



    setData({ ...data, invoiceDate: formattedDate });
  };

  console.log(totalpages)
  let str = "Total Paid Fees";
  const [searchname, setseearchname] = React.useState("");

  const [order, setorder] = React.useState(1);

  const [order1, setorder1] = React.useState(1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openmenu = Boolean(anchorEl);
  const handleClickmenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosemenu = () => {
    setAnchorEl(null);
  };
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const openmenu1 = Boolean(anchorEl1);
  const handleClickmenu1 = (event) => {
    setAnchorEl1(event.currentTarget);
  };

  const handleClosemenu1 = () => {
    setAnchorEl1(null);
  };
  const handlesearchname = (e) => {
    setseearchname(e.target.value);
  };

  const montharr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthname = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  const handlePageChange = (event, value) => {
    setpage(value); 
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
  
  const pagination = React.useMemo(() => {
    return (
      <Grid
      
    item  xs={12} sm={6} md={5} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'center' } }}  

        >
        <Box>
          <CustomPagination
            count={totalpages?totalpages:1}
            page={page}
            size="small"
            siblingCount={1}
            boundaryCount={1}
            onChange={handlePageChange} 
            showFirstButton={false}
            showLastButton={false}
          />
        </Box>
      </Grid>
    );
  }, [totalpages, page]); 
  
    


const ingredients=React.useMemo(()=>{
console.log('ingredients')
return(
  <Grid container spacing={2}>
  {/* Left Section */}
  <Grid
    item
   xs={12} sm={4} md={2} sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' } }}
  >
    <Box sx={{ display: "flex", mt: 1 }}>
      <div>
        <Tooltip title="Add Invoice" arrow>
          <Button
            disabled={parent._id ? false : true}
            onClick={handleopenclose}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      </div>
      <div>
        <Tooltip title="Filter" arrow>
          <Button
            id="basic-button"
            aria-controls={openmenu1 ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openmenu1 ? "true" : undefined}
            onClick={handleClickmenu1}
          >
            <FilterAltIcon sx={{ color: "#0063cc" }} />
          </Button>
        </Tooltip>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl1}
          open={openmenu1}
          onClose={handleClosemenu1}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {montharr.map((val, index) => (
            <MenuItem
              onClick={() => {
                console.log('api called')
                axios
                  .get(
                    `http://localhost:5000/invoice/fillterinvocemonth?courseId=${
                      parent._id ? parent._id : ""
                    }&month=${montharr[index]}&sort=${order1}&page=${page}&limit=${10}`,
                    jwttoken()
                  )
                  .then((data) => {
                    console.log("API Response:", data);
                    setArr(data.data.data);
                    settotalpages(data.data.totalPages)
          
                    setorder1(order1 === 1 ? -1 : 1);
                  })
                  .catch((error) => {
                    console.error("API Request Error:", error);
                  });

                handleClosemenu1();
              }}
            >
              {monthname[index]}
            </MenuItem>
          ))}
        </Menu>
      </div>

      <div>
        <Tooltip title="Sort" arrow>
          <Button
            id="basic-button"
            aria-controls={openmenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openmenu ? "true" : undefined}
            onClick={handleClickmenu}
          >
            <SortIcon sx={{ color: "#0063cc" }} />
          </Button>
        </Tooltip>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openmenu}
          onClose={handleClosemenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            onClick={() => {
              setParent({});
              handleClosemenu();
            }}
          >
            All
          </MenuItem>

          <MenuItem
            onClick={() => {
              axios
                .get(
                  `http://localhost:5000/invoice/filterinvocedate?key=invoiceDate&sortby=${order}&page=${page}&limit=${10}&courseid=${
                    parent._id ? parent._id : ""
                  }`,
                  jwttoken()
                )
                .then((data) => {
                  console.log(data);
                  setorder(order == 1 ? -1 : 1);
                  setArr(data.data.data);
                  settotalpages(data.data.totalpages)

                })
                .catch((err) => {
                  console.log(err);
                });
              handleClosemenu();
            }}
          >
            Sort By Date
          </MenuItem>
          <MenuItem
            onClick={() => {
              axios
                .get(
                  `http://localhost:5000/invoice/filterinvocedate?key=Name&sortby=${order}&page=${page}&limit=${10}&courseid=${
                    parent._id ? parent._id : ""
                  }`,
                  jwttoken()
                )
                .then((data) => {
                  console.log(data);
                  setorder(order == 1 ? -1 : 1);
                  setArr(data.data.data);
                  settotalpages(data.data.totalpages)
                  
                })
                .catch((err) => {
                  console.log(err);
                });
              handleClosemenu();
            }}
          >
            Sort By Name
          </MenuItem>
          <MenuItem
            onClick={() => {
              axios
                .get(
                  `http://localhost:5000/invoice/filterinvocedate?key=Rfees&sortby=${order}&page=${page}&limit=${10}&courseid=${
                    parent._id ? parent._id : ""
                  }`,
                  jwttoken()
                )
                .then((data) => {
                  console.log(data);
                  setorder(order == 1 ? -1 : 1);
                  setArr(data.data.data);
                  settotalpages(data.data.totalpages)
                  
                })
                .catch((err) => {
                  console.log(err);
                });
              handleClosemenu();
            }}
          >
            Sort By RF
          </MenuItem>
        </Menu>
      </div>
    </Box>
  </Grid>
 {pagination}
  <Grid item  xs={12} sm={4} md={2}>
    <Box>
      <FormControl sx={{width:150}}>
        <InputLabel id="demo-simple-select-label"
         sx={{
          top: "-6px", // Adjust label position slightly upwards
          backgroundColor: "white", // Background to avoid overlap with border

          "&.Mui-focused": {
            top: "0px", // Position when focused
          },
        }}
        >
          Select Course
        </InputLabel>
        <Select
          onChange={(e) => {
            handleparent(e);
            
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Status"
          renderValue={(data) => {
            return (parent._id && data.batchName) || "";
          }}
          sx={{
            height: 50,
            
            borderRadius: "16px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "2px solid #0063cc", // Default border color
              },
              "&:hover fieldset": {
                border: "2px solid #0063cc", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                border: "2px solid #0063cc", // Border color when focused
              },
            },
          }}
        >
          {coursearr &&
            coursearr.map((row) => (
              <MenuItem key={row.name} value={row}>
                <TableRow
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

  <Grid
    item
     xs={12} sm={4} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' } }}
     
  >
    <Box sx={{ width: 400, ml: 3 }}>
      <TextField
        value={searchname}
        id="filled-hidden-label-small"
        placeholder="Search Students..."
        variant="filled"
        size="small"
        onChange={handlesearchname}
        sx={{
          width: "100%",
          maxWidth: 400,
          "& .MuiFilledInput-root": {
            borderRadius: "16px",
            border: "2px solid #0063cc",
            backgroundColor: "white",
            padding: "0 16px", // Ensure background color is consistent
            "&:hover": {
              backgroundColor: "white",
            },
            "&.Mui-focused": {
              backgroundColor: "white",
            },
            "& input": {
              padding: "12px 0", // Adjust vertical padding to center text
              // Center the text horizontally
            },
          },
          "& .MuiFilledInput-underline:before": {
            borderBottom: "none", // Remove the default underline before focus
          },
          "& .MuiFilledInput-underline:after": {
            borderBottom: "none", // Remove the default underline after focus
          },
          "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: "none", // Remove underline on hover
          },
        }}
      />
    </Box>

    <Tooltip title="Search" arrow>
      <Button sx={{ color: "#0063cc" }}>
        <SearchIcon
          onClick={() => {
            if(searchname.trim().length>0){
            axios
              .get(
                `http://localhost:5000/invoice/searchinstu?name=${searchname}&page=${page}&limit=${10}`,
                jwttoken()
              )
              .then((data) => {
                console.log(data);
                setArr(data.data.filterdata);
                settotalpages(data.data.totalPages)
                setseearchname("");
              })
              .catch((err) => {
                console.log(err);
              });
            }
            else{
              handleClick1({ vertical: "top", horizontal: "center" });
              setAlertMsg({
                open: true,
                message: 'Please Enter Name First'
              });
              setseearchname("")
            }
          }}
        />
      </Button>
    </Tooltip>
  </Grid>
</Grid>
)
},[totalpages,open,anchorEl,anchorEl1,searchname,parent,coursearr,order,order1])

const dialog=React.useMemo(()=>{
  console.log('dialog')
return(
  <Dialog open={open} onClose={handleClose}>
  <DialogContent>
    {id ? (
      <TextField
        id="outlined-basic"
        label="Student Name"
        variant="filled"
        value={id && data.stuId.Name}
        disabled={true}
        fullWidth
        sx={{ mb: 2 }}
      />
    ) : (
      <Box>
        <FormControl sx={{ my: 2 }} fullWidth>
          <InputLabel id="demo-multiple-checkbox-label">
            Select Students
          </InputLabel>

          <Select
            labelId="demo-multiple-checkbox-label"
            disabled={id ? true : false}
            // renderValue={() => (id ? selectedStudentName : '')}
            id="demo-multiple-checkbox"
            onChange={(e) => {
              handleChange(e, "stuId");
            }}
            sx={{ width: 530 }}
            fullWidth
            input={<FilledInput />}
          >
            {stuarr &&
              stuarr.map((row) => (
                <MenuItem key={row._id} value={row._id}>
                  <TableRow sx={{display:'flex', gap: 2 }}>
                    
                  <Typography align="center">{row.Name}</Typography>
                  <Typography align="center">{row.Contact}</Typography>
                   <Typography align="center">{row.Rfees}</Typography>
                  <Typography align="center">{row.Pfees}</Typography>
                  
                  </TableRow>
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
    )}

    <TextField
      id="outlined-basic"
      type="Number"
      label="Amount"
      variant="filled"
      value={data.Amount}
      onChange={(e) => {
        handleChange(e, "Amount");
      }}
      fullWidth
      sx={{ mb: 2 }}
    />

    <Box sx={{ mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["DatePicker"]}>
          <DatePicker
            
            slotProps={{ textField: { variant: "filled" } }}
            label="Choose Your Date"
            sx={{ width: 525 }}
            value={dayjs(data.invoiceDate)}
            
            onChange={handleDateChange}
          
          />
        </DemoContainer>
      </LocalizationProvider>
    </Box>

    <Box sx={{ minWidth: 120, mb: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          Mode Of Payment
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          variant="filled"
          label="TypeOfPayment"
          value={data.TypeOfPayment}
          onChange={(e) => {
            handleChange(e, "TypeOfPayment");
          }}
        >
          <MenuItem value={"UPI"}>UPI</MenuItem>
          <MenuItem value={"Cash"}>Cash</MenuItem>
          <MenuItem value={"Cheque"}>Cheque</MenuItem>
        </Select>
      </FormControl>
    </Box>
  </DialogContent>
  <DialogActions>
    <Button
      onClick={() => {
        handleClose();
      }}
    >
      Cancel
    </Button>
    <Button
      onClick={() => {
        AddorUpdate("data captured");
      }}
    >
      Submit
    </Button>
  </DialogActions>
</Dialog>

)
},[open,id,data,stuarr])
const table=React.useMemo(()=>{
console.log('table')
return(
  <Box sx={{ mt: 3, mx: 2 }}>
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
                  Student Name
                </TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Batch Name</TableCell>

                <TableCell align="center">Course</TableCell>
                <TableCell align="center">TypeOfPayment</TableCell>

                <TableCell align="center">Invoice Amount</TableCell>
                <TableCell align="center">
                  {str && str.length < 4 ? (
                    str
                  ) : (
                    <Tooltip title="Total Paid Fees" arrow>
                      <span>{"TPF"}</span>
                    </Tooltip>
                  )}
                </TableCell>

                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Remaining</TableCell>
                <TableCell align="center" colSpan={3}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ height: arr && arr.length < 1 ? 300 : 0 }}>
              {arr && arr.length > 0 ? (
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
                      {row.stuId && row.stuId.Name}
                    </TableCell>
                    <TableCell align="center">
                      {row.invoiceDate && row.invoiceDate.split("T")[0]}
                    </TableCell>
                    <TableCell align="center">
                      {row.courseId && row.courseId.batchName}
                    </TableCell>

                    <TableCell align="center">
                      {row.courseId && row.courseId.Course}
                    </TableCell>

                    <TableCell align="center">{row.TypeOfPayment}</TableCell>
                    <TableCell align="center">{row.Amount}</TableCell>

                    <TableCell align="center">
                      {row.stuId && row.stuId.Pfees}
                    </TableCell>

                    <TableCell align="center">
                      {row.stuId && row.stuId.Tfees}
                    </TableCell>
                    <TableCell align="center">
                      {row.stuId && row.stuId.Rfees}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit" arrow>
                        <Button
                          onClick={() => {
                            setData(row);
                            setId(row._id);

                            setOpen(true);
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>

                    <TableCell align="center">
                      {" "}
                      <Tooltip title="Download Receipt" arrow>
                        <Button
                          color="warning"
                          onClick={() => {
                            const doc = new jsPDF();

                            // Set background color
                            doc.setFillColor(255, 255, 255);
                            doc.rect(
                              0,
                              0,
                              doc.internal.pageSize.width,
                              doc.internal.pageSize.height,
                              "F"
                            );

                            // Add a logo at the top center
                            const logoWidth = 50;
                            const logoHeight = 20;
                            const centerX =
                              doc.internal.pageSize.width / 2 - logoWidth / 2;
                            doc.addImage(
                              Img,
                              "PNG",
                              centerX,
                              10,
                              logoWidth,
                              logoHeight
                            );

                            // Title
                            doc.setFont("helvetica", "bold");
                            doc.setFontSize(24);
                            doc.setTextColor(0, 0, 110);
                            doc.text(
                              "Fees Receipt".toUpperCase(),
                              doc.internal.pageSize.width / 2,
                              40,
                              { align: "center" }
                            );

                            // Create a table with 2 columns and 8 rows
                            const table = {
                              headers: ["Field", "Value"],
                              body: [
                                ["Invoice ID", row.invoiceId],
                                [
                                  "Date",
                                  row.invoiceDate &&
                                    row.invoiceDate.split("T")[0],
                                ],
                                [
                                  "Student Name",
                                  row.stuId.Name && row.stuId.Name,
                                ],
                                [
                                  "Course Name",
                                  row.courseId.Course && row.courseId.Course,
                                ],
                                ["Payment Method", row.TypeOfPayment],
                                ["Paid Amount", row.Amount],
                              ],
                            };

                            // Add the table to the PDF with borders and colors
                            doc.autoTable({
                              startY: 60,
                              head: [table.headers],
                              body: table.body,
                              theme: "striped",
                              styles: {
                                cellPadding: 3,
                                fontSize: 10,
                                valign: "middle",
                                halign: "center",
                                fontStyle: "normal",
                                lineWidth: 0.1,
                              },
                              headStyles: {
                                fillColor: [255, 255, 255],
                                textColor: [0, 0, 110],
                                fontStyle: "bold",
                              },
                              columnStyles: {
                                0: {
                                  cellWidth: 40,
                                },
                                1: {
                                  cellWidth: "auto",
                                },
                              },
                            });

                            // Add footer
                            const footerText = [
                              "Email: info@technishal.com",
                              "Contact: +91 9313386475",
                              "Address: H-1210, Titanium City Center Business Park,",
                              "Nr. Prahlad Nagar Rd, Jodhpur Village,",
                              "Ahmedabad, Gujarat 380015.",
                            ];

                            doc.setFontSize(10);
                            doc.setTextColor(0, 0, 0);

                            // Add horizontal line
                            doc.setDrawColor(0, 0, 0);
                            doc.setLineWidth(0.5);
                            doc.line(
                              10,
                              doc.internal.pageSize.height - 30,
                              doc.internal.pageSize.width - 10,
                              doc.internal.pageSize.height - 30
                            );

                            // Add footer text with spacing
                            let footerY = doc.internal.pageSize.height - 25;
                            footerText.forEach((text, index) => {
                              doc.text(
                                text,
                                doc.internal.pageSize.width / 2,
                                footerY,
                                { align: "center" }
                              );
                              footerY += 5;
                            });
                            doc.setFontSize(10);
                            doc.setTextColor(100);
                            doc.text(
                              "This is a computer-generated invoice. Signature not required.",
                              doc.internal.pageSize.width / 2,
                              doc.internal.pageSize.height - 50,
                              { align: "center" }
                            );

                            // Copyright notice
                            doc.setTextColor(100);
                            doc.setFontSize(8);
                            doc.text(
                              "© 2023 TechNishal. All Rights Reserved.",
                              doc.internal.pageSize.width / 2,
                              doc.internal.pageSize.height - 2,
                              { align: "center" }
                            );

                            doc.save(
                              `${row.stuId.Name}-${row.courseId.Course}.pdf`
                            );
                          }}
                        >
                          <DownloadIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Send Email" arrow>
                        <Button
                          sx={{ color: "black" }}
                          onClick={() => {
                            axios
                              .post(
                                "http://localhost:5000/invoice/pdf",
                                row,
                                jwttoken()
                              )
                              .then((data) => {
                                console.log(data);
                                if (data.data) {
                                  handleClick1({
                                    vertical: "top",
                                    horizontal: "center",
                                  });
                                  setAlertSuccess({
                                    open: true,
                                    message: "Email Sent Successfully",
                                  });
                                }
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                        >
                          <EmailIcon />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
)
},[arr,page])
  return (
    <React.Fragment>
    {snack}
  
     {ingredients}
{dialog}
{table}
    
    </React.Fragment>
  );
}

// <BrowserRouter>
// <Routes>
// <Route path='/dashBoard' element={<Navbar/>}>
// <Route path='/dashBoard/Invoice' element={<Invoice/>}/>
// </Route>

// </Routes>
// // </BrowserRouter>
// setData({...data,[type]:e.target.value})
